import type { Venue } from "@/lib/football-api/types";

/** Trainline search deeplink — destination pre-filled, user sets origin + date.
 *  Affiliate via Awin: set NEXT_PUBLIC_TRAINLINE_AWIN_ID to your Awin publisher ID.
 */
export function buildTrainlineLink(venue: Venue): string {
  const awinId = process.env.NEXT_PUBLIC_TRAINLINE_AWIN_ID ?? "";
  const dest = encodeURIComponent(venue.city);
  const direct = `https://www.thetrainline.com/en/search?destination=${dest}`;
  if (awinId) {
    return `https://www.awin1.com/cread.php?awinmid=5833&awinaffid=${awinId}&p=${encodeURIComponent(direct)}`;
  }
  return direct;
}

/** Skyscanner "flights to {city}" deeplink — uses venue's airportCode (IATA).
 *  Affiliate via Skyscanner Partner API or Commission Junction.
 *  Set NEXT_PUBLIC_SKYSCANNER_AFF_ID if you have one.
 */
export function buildSkyscannerLink(venue: Venue, matchDateUtc: string): string {
  const affId = process.env.NEXT_PUBLIC_SKYSCANNER_AFF_ID ?? "";
  const code = venue.airportCode ?? "anywhere";

  // Format date as YYMMDD for Skyscanner
  const d = new Date(matchDateUtc);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const dateStr = `${yy}${mm}${dd}`;

  const base = `https://www.skyscanner.net/transport/flights/anywhere/${code.toLowerCase()}/${dateStr}/`;
  if (affId) {
    return `${base}?&associateId=${affId}`;
  }
  return base;
}

/** JustPark — parking search near the stadium using lat/lng. */
export function buildJustParkLink(venue: Venue): string {
  const q = encodeURIComponent(`${venue.name}, ${venue.city}`);
  return `https://www.justpark.com/search?q=${q}&lat=${venue.lat}&lng=${venue.lng}`;
}
