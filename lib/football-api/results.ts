import type { RawMatch, RawMatchesResponse } from "./types";

const BASE_URL = "https://api.football-data.org/v4";

function footballHeaders(): HeadersInit {
  return { "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY ?? "" };
}

export interface Result {
  id: number;
  utcDate: string;
  competitionCode: string;
  isHome: boolean;
  opponent: { id: number; name: string; shortName: string; crest: string };
  goalsFor: number | null;
  goalsAgainst: number | null;
  outcome: "W" | "D" | "L" | null;
}

async function fetchFinishedMatches(competitionCode: string): Promise<RawMatch[]> {
  const res = await fetch(
    `${BASE_URL}/competitions/${competitionCode}/matches?status=FINISHED`,
    {
      headers: footballHeaders(),
      next: { revalidate: 1800, tags: [`results-${competitionCode}`] },
    }
  );
  if (!res.ok) return [];
  const data: RawMatchesResponse = await res.json();
  return data.matches ?? [];
}

export interface H2HResult {
  id: number;
  utcDate: string;
  homeTeam: { id: number; shortName: string; crest: string };
  awayTeam: { id: number; shortName: string; crest: string };
  homeGoals: number | null;
  awayGoals: number | null;
  winner: "home" | "away" | "draw" | null;
}

function rawToH2HResult(m: RawMatch): H2HResult {
  const homeGoals = m.score?.fullTime?.home ?? null;
  const awayGoals = m.score?.fullTime?.away ?? null;
  let winner: H2HResult["winner"] = null;
  if (m.score?.winner === "DRAW") winner = "draw";
  else if (m.score?.winner === "HOME_TEAM") winner = "home";
  else if (m.score?.winner === "AWAY_TEAM") winner = "away";
  return {
    id: m.id,
    utcDate: m.utcDate,
    homeTeam: { id: m.homeTeam.id, shortName: m.homeTeam.shortName || m.homeTeam.name, crest: m.homeTeam.crest },
    awayTeam: { id: m.awayTeam.id, shortName: m.awayTeam.shortName || m.awayTeam.name, crest: m.awayTeam.crest },
    homeGoals,
    awayGoals,
    winner,
  };
}

/** Uses the dedicated /matches/{id}/head2head endpoint for cross-season history. */
export async function getHeadToHead(matchId: number, limit = 5): Promise<H2HResult[]> {
  const res = await fetch(
    `${BASE_URL}/matches/${matchId}/head2head?limit=${limit}`,
    {
      headers: footballHeaders(),
      next: { revalidate: 3600, tags: [`h2h-${matchId}`] },
    }
  );
  if (!res.ok) return [];
  const data: { matches?: RawMatch[] } = await res.json();
  return (data.matches ?? [])
    .filter((m) => m.score?.winner !== undefined)
    .map(rawToH2HResult);
}

export async function getRecentResults(
  teamId: number,
  competitionCode: string,
  limit = 6
): Promise<Result[]> {
  const raw = await fetchFinishedMatches(competitionCode).catch(() => []);

  const involving = raw
    .filter((m) => m.homeTeam.id === teamId || m.awayTeam.id === teamId)
    .sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())
    .slice(0, limit);

  return involving.map((m): Result => {
    const isHome = m.homeTeam.id === teamId;
    const opponent = isHome ? m.awayTeam : m.homeTeam;
    const goalsFor = isHome ? (m.score?.fullTime?.home ?? null) : (m.score?.fullTime?.away ?? null);
    const goalsAgainst = isHome ? (m.score?.fullTime?.away ?? null) : (m.score?.fullTime?.home ?? null);

    let outcome: "W" | "D" | "L" | null = null;
    if (m.score?.winner === "DRAW") outcome = "D";
    else if (
      (m.score?.winner === "HOME_TEAM" && isHome) ||
      (m.score?.winner === "AWAY_TEAM" && !isHome)
    )
      outcome = "W";
    else if (m.score?.winner) outcome = "L";

    return {
      id: m.id,
      utcDate: m.utcDate,
      competitionCode,
      isHome,
      opponent: {
        id: opponent.id,
        name: opponent.name,
        shortName: opponent.shortName || opponent.name,
        crest: opponent.crest,
      },
      goalsFor,
      goalsAgainst,
      outcome,
    };
  });
}
