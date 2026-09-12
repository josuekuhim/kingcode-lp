interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

type SubscribePayload = {
  email?: unknown;
  website?: unknown;
};

type SubscriberRecord = {
  id: number;
  confirmation_sent_at: string | null;
};

const fallbackOrigins = [
  "https://josuekuhim.github.io",
  "https://kingcode.run",
  "https://www.kingcode.run",
  "http://localhost:5173",
];

function getAllowedOrigins(env: Env) {
  return (env.ALLOWED_ORIGINS?.split(",") ?? fallbackOrigins)
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin: string, env: Env) {
  return getAllowedOrigins(env).includes(origin);
}

function corsHeaders(origin: string | null, env: Env) {
  const headers = new Headers({
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  });

  if (origin && isAllowedOrigin(origin, env)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  return headers;
}

function json(
  body: Record<string, unknown>,
  status: number,
  origin: string | null,
  env: Env,
) {
  const headers = corsHeaders(origin, env);
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(body), { status, headers });
}

function isValidEmail(email: string) {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function confirmationIdempotencyKey(email: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(email),
  );
  const hash = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `kingcode-welcome-${hash}`;
}

async function sendConfirmationEmail(email: string, env: Env) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    console.error("resend is not configured");
    return null;
  }

  const idempotencyKey = await confirmationIdempotencyKey(email);
  let response: Response;

  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL,
        to: [email],
        subject: "You’re on the KingCode early access list",
        html: `
          <!doctype html>
          <html lang="en">
            <body style="margin:0;background:#0b0a0b;color:#f2eeee;font-family:Arial,Helvetica,sans-serif;">
              <div style="max-width:620px;margin:0 auto;padding:48px 24px;">
                <div style="font-size:18px;font-weight:700;letter-spacing:-.04em;">king<span style="color:#d41445;">code</span></div>
                <div style="margin-top:48px;border:1px solid #342b31;border-radius:12px;background:#121013;padding:36px;">
                  <div style="color:#d41445;font:11px monospace;letter-spacing:.16em;">EARLY ACCESS / CONFIRMED</div>
                  <h1 style="margin:22px 0 16px;font-size:34px;line-height:1.08;font-weight:600;letter-spacing:-.04em;">You’re on the list.</h1>
                  <p style="margin:0;color:#b5aeb3;font-size:16px;line-height:1.7;">Thanks for showing interest in KingCode.</p>
                  <p style="margin:16px 0 0;color:#b5aeb3;font-size:16px;line-height:1.7;">We’re building an open engineering orchestration layer that turns intent into specs, plans and verified execution — with the right model for every task.</p>
                  <div style="margin-top:28px;padding:16px 18px;border-left:2px solid #d41445;background:#1b1117;color:#f2eeee;font:13px/1.7 monospace;">v0.1 launch watch<br /><span style="color:#8e858b;">status: you’ll hear from us when it’s ready</span></div>
                  <p style="margin:28px 0 0;color:#b5aeb3;font-size:15px;line-height:1.7;">We’ll send you a note when the first public release is ready to try. No noise — just the next meaningful update.</p>
                </div>
                <p style="margin:20px 0 0;color:#716970;font:12px/1.7 monospace;">KingCode · The intelligence is open.</p>
              </div>
            </body>
          </html>
        `,
        text: "Thanks for showing interest in KingCode. You’re officially on the early access list. We’ll send you a note when the first public release is ready to try. No noise — just the next meaningful update.\n\n— The KingCode team",
      }),
    });
  } catch {
    console.error("resend request failed");
    return null;
  }

  if (!response.ok) {
    console.error("resend welcome email failed", response.status);
    return null;
  }

  const responseBody = (await response.json().catch(() => ({}))) as {
    id?: unknown;
  };
  return typeof responseBody.id === "string" ? responseBody.id : null;
}

async function subscribe(request: Request, env: Env, origin: string | null) {
  let payload: SubscribePayload;

  try {
    payload = (await request.json()) as SubscribePayload;
  } catch {
    return json({ ok: false, error: "Invalid request body." }, 400, origin, env);
  }

  // Quietly accept bot submissions without storing them.
  if (typeof payload.website === "string" && payload.website.trim()) {
    return json({ ok: true, status: "accepted" }, 202, origin, env);
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return json({ ok: false, error: "Enter a valid work email." }, 422, origin, env);
  }

  let subscriber: SubscriberRecord | null = null;
  let inserted = false;

  try {
    const result = await env.DB
      .prepare(
        "INSERT OR IGNORE INTO newsletter_subscribers (email, source) VALUES (?, ?)",
      )
      .bind(email, "landing")
      .run();

    inserted = Number(result.meta.changes ?? 0) > 0;
    subscriber = await env.DB
      .prepare(
        "SELECT id, confirmation_sent_at FROM newsletter_subscribers WHERE email = ?",
      )
      .bind(email)
      .first<SubscriberRecord>();

    if (!subscriber) {
      throw new Error("subscriber record was not created");
    }
  } catch {
    console.error("newsletter subscription database write failed");
    return json(
      { ok: false, error: "Unable to save your email right now. Please try again." },
      503,
      origin,
      env,
    );
  }

  const status = inserted ? "subscribed" : "already_subscribed";
  if (subscriber.confirmation_sent_at) {
    return json({ ok: true, status, confirmation: "sent" }, 200, origin, env);
  }

  const messageId = await sendConfirmationEmail(email, env);
  if (!messageId) {
    return json(
      {
        ok: false,
        error: "We saved your email, but could not send the confirmation yet. Please try again.",
      },
      503,
      origin,
      env,
    );
  }

  try {
    await env.DB
      .prepare(
        "UPDATE newsletter_subscribers SET confirmation_sent_at = ?, confirmation_message_id = ? WHERE id = ? AND confirmation_sent_at IS NULL",
      )
      .bind(new Date().toISOString(), messageId, subscriber.id)
      .run();
  } catch {
    // The email was accepted by Resend; a later retry can safely reconcile this row.
    console.error("newsletter confirmation status update failed");
  }

  return json({ ok: true, status, confirmation: "sent" }, 200, origin, env);
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (origin && !isAllowedOrigin(origin, env)) {
      return json({ ok: false, error: "Origin not allowed." }, 403, null, env);
    }

    if (url.pathname === "/health" && request.method === "GET") {
      return json({ ok: true, service: "kingcode-newsletter-api" }, 200, origin, env);
    }

    if (url.pathname !== "/subscribe") {
      return json({ ok: false, error: "Not found." }, 404, origin, env);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed." }, 405, origin, env);
    }

    return subscribe(request, env, origin);
  },
};

export default worker;
