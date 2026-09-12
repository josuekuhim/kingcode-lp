interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS?: string;
}

type SubscribePayload = {
  email?: unknown;
  website?: unknown;
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

  try {
    const result = await env.DB
      .prepare(
        "INSERT OR IGNORE INTO newsletter_subscribers (email, source) VALUES (?, ?)",
      )
      .bind(email, "landing")
      .run();

    const inserted = Number(result.meta.changes ?? 0) > 0;
    return json(
      { ok: true, status: inserted ? "subscribed" : "already_subscribed" },
      200,
      origin,
      env,
    );
  } catch {
    console.error("newsletter subscription failed");
    return json(
      { ok: false, error: "Unable to save your email right now. Please try again." },
      503,
      origin,
      env,
    );
  }
}

export default {
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
