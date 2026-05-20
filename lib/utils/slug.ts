import type { Match } from "@/lib/football-api/types";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function generateMatchSlug(match: Match): string {
  const home = slugify(match.homeTeam.shortName);
  const away = slugify(match.awayTeam.shortName);
  const date = match.utcDate.split("T")[0];
  const venue = slugify(match.venue.name);
  return `${home}-vs-${away}-${date}-${venue}-${match.id}`;
}

export function parseMatchId(slug: string): number | null {
  const parts = slug.split("-");
  const id = parseInt(parts[parts.length - 1], 10);
  return isNaN(id) ? null : id;
}

export function teamSlug(name: string): string {
  return slugify(name);
}
