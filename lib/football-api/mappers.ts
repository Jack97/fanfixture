import type { Match, RawMatch } from "./types";
import { getVenueByTeamId } from "./venue-map";
import { generateMatchSlug, teamSlug } from "@/lib/utils/slug";

const FALLBACK_VENUE = {
  id: "unknown",
  name: "TBC",
  city: "TBC",
  citySlug: "unknown",
  address: "",
  lat: 0,
  lng: 0,
};

export function mapRawMatch(raw: RawMatch): Match | null {
  const venue = getVenueByTeamId(raw.homeTeam.id);
  if (!venue) return null; // skip matches at untracked venues

  const match: Match = {
    id: raw.id,
    slug: "", // filled below
    utcDate: raw.utcDate,
    status: raw.status,
    matchday: raw.matchday ?? undefined,
    homeTeam: {
      id: raw.homeTeam.id,
      name: raw.homeTeam.name,
      shortName: raw.homeTeam.shortName || raw.homeTeam.name,
      tla: raw.homeTeam.tla,
      crest: raw.homeTeam.crest,
      slug: teamSlug(raw.homeTeam.shortName || raw.homeTeam.name),
    },
    awayTeam: {
      id: raw.awayTeam.id,
      name: raw.awayTeam.name,
      shortName: raw.awayTeam.shortName || raw.awayTeam.name,
      tla: raw.awayTeam.tla,
      crest: raw.awayTeam.crest,
      slug: teamSlug(raw.awayTeam.shortName || raw.awayTeam.name),
    },
    competition: raw.competition,
    venue,
  };

  match.slug = generateMatchSlug(match);
  return match;
}

export function mapRawMatches(raws: RawMatch[]): Match[] {
  return raws.flatMap((r) => {
    const m = mapRawMatch(r);
    return m ? [m] : [];
  });
}
