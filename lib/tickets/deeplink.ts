import type { Match } from "@/lib/football-api/types";

export type TicketPlatform = "viagogo" | "livefootballtickets" | "ticketmaster" | "stubhub" | "twickets";

// ─── LiveFootballTickets slug maps ────────────────────────────────────────────

/** football-data.org team ID → LFT fixture URL slug */
const LFT_TEAM_SLUGS: Record<number, string> = {
  57: "arsenal",
  58: "aston-villa",
  61: "chelsea",
  62: "everton",
  63: "fulham",
  64: "liverpool",
  65: "manchester-city",
  66: "manchester-united",
  67: "newcastle-united",
  73: "tottenham-hotspur",
  76: "wolverhampton-wanderers",
  328: "burnley",
  338: "leicester-city",
  340: "southampton",
  341: "leeds-united",
  345: "sheffield-wednesday",
  351: "nottingham-forest",
  354: "crystal-palace",
  356: "sheffield-united",
  387: "bristol-city",
  397: "brighton-and-hove-albion",
  402: "brentford",
  563: "west-ham-united",
  715: "cardiff-city",
  1044: "afc-bournemouth",
};

/** football-data.org competition code → LFT competition slug */
const LFT_COMPETITION_SLUGS: Record<string, string> = {
  PL: "english-premier-league",
  ELC: "english-championship",
};

// ─── LiveFootballTickets ──────────────────────────────────────────────────────

/** Builds a fixture-specific URL on LFT, e.g.:
 *  /fixtures/chelsea-v-tottenham-hotspur-tickets-english-premier-league.html
 *  Falls back to the home team's category page if slugs are unknown.
 */
export function buildLiveFootballTicketsLink(match: Match): string {
  const affId = process.env.NEXT_PUBLIC_LFT_AFF_ID ?? "";
  const affSuffix = affId ? `?aid=${affId}` : "";
  const base = "https://www.livefootballtickets.com";

  const homeSlug = LFT_TEAM_SLUGS[match.homeTeam.id];
  const awaySlug = LFT_TEAM_SLUGS[match.awayTeam.id];
  const compSlug = LFT_COMPETITION_SLUGS[match.competition.code];

  if (homeSlug && awaySlug && compSlug) {
    return `${base}/fixtures/${homeSlug}-v-${awaySlug}-tickets-${compSlug}.html${affSuffix}`;
  }

  // Fallback: home team's PL/Championship page
  if (homeSlug) {
    const league = compSlug ?? "premier-league";
    return `${base}/${league}/${homeSlug}-tickets.html${affSuffix}`;
  }

  return `${base}/premier-league-tickets.html${affSuffix}`;
}

// ─── Viagogo ──────────────────────────────────────────────────────────────────

/** Viagogo affiliate search URL via CJ Affiliate.
 *  The NEXT_PUBLIC_VIAGOGO_AFF_ID should be your CJ Publisher ID.
 *  For full affiliate tracking, wrap this inside your CJ deep-link URL.
 *  Search by home team name only — more reliable than "Team A vs Team B".
 */
export function buildViagogoLink(match: Match): string {
  const affId = process.env.NEXT_PUBLIC_VIAGOGO_AFF_ID ?? "";
  const params = new URLSearchParams({
    q: `${match.homeTeam.shortName} football tickets`,
    ...(affId && { affid: affId }),
  });
  return `https://www.viagogo.co.uk/search?${params.toString()}`;
}

// ─── Ticketmaster ─────────────────────────────────────────────────────────────

/** Ticketmaster UK affiliate link via Rakuten.
 *  The NEXT_PUBLIC_TM_AFF_ID should be your Rakuten publisher site ID.
 *  Without an affiliate ID this still links to the correct Ticketmaster page.
 */
export function buildTicketmasterLink(match: Match, tmEventUrl?: string | null): string {
  if (tmEventUrl) return tmEventUrl; // direct event URL from their API
  const affId = process.env.NEXT_PUBLIC_TM_AFF_ID ?? "";
  const params = new URLSearchParams({
    q: match.homeTeam.name,
    ...(affId && { aid: affId }),
  });
  return `https://www.ticketmaster.co.uk/search?${params.toString()}`;
}

// ─── StubHub ──────────────────────────────────────────────────────────────────

export function buildStubHubLink(match: Match): string {
  const q = encodeURIComponent(`${match.homeTeam.name} tickets`);
  return `https://www.stubhub.co.uk/search?q=${q}`;
}

// ─── Twickets ─────────────────────────────────────────────────────────────────

export function buildTwicketsLink(match: Match): string {
  const q = encodeURIComponent(match.homeTeam.name);
  return `https://www.twickets.live/app/catalog/search?q=${q}&countryCode=GB`;
}

// ─── Combined ─────────────────────────────────────────────────────────────────

export function buildTicketLinks(
  match: Match,
  tmEventUrl?: string | null
): Record<TicketPlatform, string> {
  return {
    ticketmaster: buildTicketmasterLink(match, tmEventUrl),
    livefootballtickets: buildLiveFootballTicketsLink(match),
    viagogo: buildViagogoLink(match),
    stubhub: buildStubHubLink(match),
    twickets: buildTwicketsLink(match),
  };
}
