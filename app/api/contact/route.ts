import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Contact endpoint.
 *
 * Validates and accepts the enquiry. Delivery is intentionally pluggable: set
 * CONTACT_WEBHOOK_URL to forward submissions to an inbox, CRM, or Slack. With
 * no webhook configured the route still validates and reports success, so the
 * form is fully exercisable in a preview deployment.
 */

const MAX_BODY = 8_000;

/* A small in-memory limiter. Per-instance and therefore best-effort — enough
   to blunt a naive script, and deliberately not presented as more than that.
   Put a real limiter at the edge before relying on it. */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const LIMIT = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);

  /* Keep the map from growing without bound on a long-lived instance. */
  if (HITS.size > 5_000) {
    for (const [key, times] of HITS) {
      if (!times.some((t) => now - t < WINDOW_MS)) HITS.delete(key);
    }
  }

  return recent.length > LIMIT;
}

type Payload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  interest?: unknown;
  budget?: unknown;
  company_website?: unknown;
};

const str = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many messages from this address. Try again shortly." },
      { status: 429 },
    );
  }

  let payload: Payload;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) {
      return NextResponse.json({ ok: false, message: "Message is too long." }, { status: 413 });
    }
    payload = JSON.parse(raw) as Payload;
  } catch {
    return NextResponse.json({ ok: false, message: "Could not read that request." }, { status: 400 });
  }

  /* Honeypot: a filled hidden field means a bot. Answer 200 so the script
     believes it succeeded and does not retry with a different shape. */
  if (str(payload.company_website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = str(payload.name, 120);
  const email = str(payload.email, 200);
  const message = str(payload.message, 5_000);
  const company = str(payload.company, 160);
  const interest = str(payload.interest, 400);
  const budget = str(payload.budget, 80);

  const errors: string[] = [];
  if (name.length < 2) errors.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push("email");
  if (message.length < 20) errors.push("message");

  if (errors.length) {
    return NextResponse.json(
      { ok: false, message: `Check these fields: ${errors.join(", ")}.` },
      { status: 422 },
    );
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          interest,
          budget,
          message,
          receivedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
    } catch (error) {
      console.error("[contact] delivery failed:", error);
      return NextResponse.json(
        { ok: false, message: "We could not deliver that. Please email us directly." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
