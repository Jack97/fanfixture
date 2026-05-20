import type { Metadata } from "next";
import { getMatchesByCity } from "@/lib/football-api/client";
import { cityLabelFromSlug } from "@/lib/football-api/search";
import MatchList from "@/components/matches/MatchList";
import EmptyState from "@/components/matches/EmptyState";
import SearchForm from "@/components/search/SearchForm";

interface SearchParams {
  city?: string;
  from?: string;
  to?: string;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { city = "", from = "", to = "" } = await searchParams;
  const cityLabel = cityLabelFromSlug(city);
  return {
    title: `Football Matches in ${cityLabel}`,
    description: `Find upcoming Premier League and Championship fixtures in ${cityLabel} between ${from} and ${to}. Book hotels near the ground.`,
  };
}

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { city = "", from = "", to = "" } = await searchParams;
  const cityLabel = cityLabelFromSlug(city);

  const matches =
    city && from && to ? await getMatchesByCity(city, from, to).catch(() => []) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      {/* Compact search bar */}
      <div className="mb-10 bg-[var(--color-pitch-dark)] border border-[var(--color-pitch-border)] rounded-sm p-5">
        <SearchForm defaultCity={city} defaultFrom={from} defaultTo={to} compact />
      </div>

      {/* Results header */}
      {city && (
        <div className="mb-6 flex items-baseline gap-3">
          <h1
            className="text-3xl font-black text-[var(--color-chalk)] uppercase tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {cityLabel}
          </h1>
          <span
            className="text-sm text-[var(--color-chalk-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {matches.length} match{matches.length !== 1 ? "es" : ""}
          </span>
        </div>
      )}

      {matches.length > 0 ? (
        <MatchList matches={matches} />
      ) : city ? (
        <EmptyState city={cityLabel} from={from} to={to} />
      ) : (
        <div className="py-20 text-center">
          <p
            className="text-[var(--color-chalk-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Enter a city above to search for fixtures.
          </p>
        </div>
      )}
    </div>
  );
}
