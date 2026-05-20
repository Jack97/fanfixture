import { NextRequest, NextResponse } from "next/server";
import { PostHog } from "posthog-node";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.BOOKING_POSTBACK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { label, booking_value, venue_id } = body;

  const phKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const phHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

  if (phKey) {
    const client = new PostHog(phKey, { host: phHost });
    client.capture({
      distinctId: `booking-${label ?? "unknown"}`,
      event: "booking_conversion",
      properties: { label, booking_value, venue_id },
    });
    await client.shutdown();
  }

  return NextResponse.json({ received: true });
}
