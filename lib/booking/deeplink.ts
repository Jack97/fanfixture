import type { Venue } from "@/lib/football-api/types";

interface DeeplinkParams {
  venue: Venue;
  checkin: string;  // YYYY-MM-DD
  checkout: string; // YYYY-MM-DD
}

export function buildBookingDeeplink({ venue, checkin, checkout }: DeeplinkParams): string {
  const affiliateId = process.env.NEXT_PUBLIC_BOOKING_AID ?? "";
  const base = "https://www.booking.com/searchresults.html";

  const params = new URLSearchParams({
    ss: `${venue.name}, ${venue.city}`,
    latitude: String(venue.lat),
    longitude: String(venue.lng),
    radius: "2",
    unit: "km",
    checkin,
    checkout,
    aid: affiliateId,
    label: `fanfixture-${venue.id}`,
  });

  return `${base}?${params.toString()}`;
}
