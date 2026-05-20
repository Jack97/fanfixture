import type { Match } from "./types";

/** Maps city slugs to home team IDs we track */
export const CITY_TO_TEAMS: Record<string, number[]> = {
  london: [57, 61, 63, 73, 354, 402, 563],
  manchester: [65, 66],
  liverpool: [64, 62],
  birmingham: [58],
  newcastle: [67],
  brighton: [397],
  wolverhampton: [76],
  nottingham: [351],
  leicester: [338],
  southampton: [340],
  bournemouth: [1044],
  sheffield: [356, 345],
  leeds: [341],
  bristol: [387],
  cardiff: [715],
  burnley: [328],
};

export const SUPPORTED_CITIES = Object.keys(CITY_TO_TEAMS).map((slug) => ({
  slug,
  label: slug.charAt(0).toUpperCase() + slug.slice(1),
}));

export function getTeamIdsForCity(citySlug: string): number[] {
  return CITY_TO_TEAMS[citySlug.toLowerCase()] ?? [];
}

export function filterMatchesByCity(
  matches: Match[],
  citySlug: string
): Match[] {
  const teamIds = new Set(getTeamIdsForCity(citySlug));
  if (teamIds.size === 0) return [];
  // Only home matches are relevant — the game is physically in that city
  return matches.filter((m) => teamIds.has(m.homeTeam.id));
}

export function cityLabelFromSlug(slug: string): string {
  const found = SUPPORTED_CITIES.find((c) => c.slug === slug);
  return found?.label ?? slug;
}
