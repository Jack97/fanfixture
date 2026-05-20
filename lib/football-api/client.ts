import type { Match, RawMatchesResponse } from "./types";
import { mapRawMatches } from "./mappers";

const BASE_URL = "https://api.football-data.org/v4";
const COMPETITIONS = ["PL", "ELC"] as const; // Premier League + Championship

function footballHeaders(): HeadersInit {
  return { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY ?? "" };
}

/** Fetch all scheduled matches for a competition. Cached for 1 hour. */
async function getScheduledForCompetition(
  competitionCode: string
): Promise<Match[]> {
  const res = await fetch(
    `${BASE_URL}/competitions/${competitionCode}/matches?status=SCHEDULED`,
    {
      headers: footballHeaders(),
      next: { revalidate: 3600, tags: ["matches", `matches-${competitionCode}`] },
    }
  );

  if (res.status === 429) throw new Error("football-data.org rate limit hit");
  if (!res.ok) throw new Error(`football-data.org error ${res.status} for ${competitionCode}`);

  const data: RawMatchesResponse = await res.json();
  return mapRawMatches(data.matches ?? []);
}

/** Return all upcoming scheduled matches across PL + Championship. */
export async function getAllScheduledMatches(): Promise<Match[]> {
  const results = await Promise.allSettled(
    COMPETITIONS.map((c) => getScheduledForCompetition(c))
  );
  return results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
}

/** Filter matches to a city and date range. */
export async function getMatchesByCity(
  citySlug: string,
  dateFrom: string,
  dateTo: string
): Promise<Match[]> {
  const { filterMatchesByCity } = await import("./search");
  const all = await getAllScheduledMatches();

  const from = new Date(dateFrom).getTime();
  const to = new Date(dateTo).getTime() + 86400000; // inclusive

  const inRange = all.filter((m) => {
    const t = new Date(m.utcDate).getTime();
    return t >= from && t <= to;
  });

  return filterMatchesByCity(inRange, citySlug);
}

/** Fetch a single match by football-data.org numeric ID. */
export async function getMatchById(matchId: number): Promise<Match | null> {
  const all = await getAllScheduledMatches();
  return all.find((m) => m.id === matchId) ?? null;
}

/** Get next N days of scheduled matches for static param generation. */
export async function getUpcomingMatches(days = 14): Promise<Match[]> {
  const all = await getAllScheduledMatches();
  const cutoff = Date.now() + days * 86400000;
  return all.filter((m) => new Date(m.utcDate).getTime() <= cutoff);
}
