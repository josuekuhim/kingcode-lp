export type NewsletterSubscriptionStatus =
  | "subscribed"
  | "already_subscribed"
  | "accepted";

type NewsletterResponse = {
  ok?: unknown;
  status?: unknown;
  error?: unknown;
};

const newsletterApiUrl = (process.env.NEXT_PUBLIC_NEWSLETTER_API_URL ?? "").replace(
  /\/+$/,
  "",
);

export async function subscribeToNewsletter(
  email: string,
  website = "",
): Promise<{ status: NewsletterSubscriptionStatus }> {
  if (!newsletterApiUrl) {
    throw new Error("Newsletter service is not configured yet.");
  }

  let response: Response;
  try {
    response = await fetch(`${newsletterApiUrl}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, website }),
    });
  } catch {
    throw new Error("Could not reach the newsletter service. Please try again.");
  }

  const payload = (await response.json().catch(() => ({}))) as NewsletterResponse;
  const status = payload.status;

  if (
    !response.ok ||
    payload.ok !== true ||
    (status !== "subscribed" &&
      status !== "already_subscribed" &&
      status !== "accepted")
  ) {
    throw new Error(
      typeof payload.error === "string"
        ? payload.error
        : "Could not save your email. Please try again.",
    );
  }

  return { status };
}
