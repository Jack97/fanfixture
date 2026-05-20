/** Ticketmaster Discovery API — free public API.
 *  Register at: https://developer.ticketmaster.com/
 *  Env var: TICKETMASTER_API_KEY
 */

export interface TmPriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface TmEvent {
  id: string;
  name: string;
  url: string;
  priceRanges?: TmPriceRange[];
  seatmap?: { staticUrl: string };
}

export async function findTmEvent(
  homeTeamName: string,
  matchDateUtc: string
): Promise<TmEvent | null> {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) return null;

  const date = new Date(matchDateUtc);
  const dateStr = date.toISOString().split("T")[0];

  const params = new URLSearchParams({
    apikey: apiKey,
    keyword: homeTeamName,
    countryCode: "GB",
    classificationName: "Football",
    startDateTime: `${dateStr}T00:00:00Z`,
    endDateTime: `${dateStr}T23:59:59Z`,
    size: "5",
  });

  const res = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events?${params}`,
    { next: { revalidate: 3600, tags: [`tm-event-${dateStr}-${homeTeamName}`] } }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const events: TmEvent[] = data._embedded?.events ?? [];

  return events.find((e) => e.priceRanges && e.priceRanges.length > 0) ?? events[0] ?? null;
}

export function tmFromPrice(event: TmEvent): string | null {
  if (!event.priceRanges?.length) return null;
  const min = Math.min(...event.priceRanges.map((r) => r.min));
  return `£${Math.round(min)}`;
}

/** Returns the primary standard price range, preferring one without "fees" in the label */
export function tmPrimaryRange(event: TmEvent): TmPriceRange | null {
  if (!event.priceRanges?.length) return null;
  return (
    event.priceRanges.find((r) => r.type === "standard") ??
    event.priceRanges.find((r) => !r.type.includes("fee")) ??
    event.priceRanges[0]
  );
}
