import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMatchesByCity } from "@/lib/football-api/client";
import { cityLabelFromSlug, SUPPORTED_CITIES } from "@/lib/football-api/search";
import { todayISO, toISODate, addDays } from "@/lib/utils/dates";
import MatchList from "@/components/matches/MatchList";
import EmptyState from "@/components/matches/EmptyState";

export const revalidate = 3600;

export function generateStaticParams() {
  return SUPPORTED_CITIES.map((c) => ({ citySlug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}): Promise<Metadata> {
  const { citySlug } = await params;
  const cityLabel = cityLabelFromSlug(citySlug);
  return {
    title: `Football Matches in ${cityLabel}`,
    description: `Upcoming Premier League and Championship home fixtures in ${cityLabel}. Find tickets and book hotels near the stadium.`,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ citySlug: string }>;
}) {
  const { citySlug } = await params;

  const isValid = SUPPORTED_CITIES.some((c) => c.slug === citySlug);
  if (!isValid) notFound();

  const cityLabel = cityLabelFromSlug(citySlug);
  const from = todayISO();
  const to = toISODate(addDays(new Date(), 30));

  const matches = await getMatchesByCity(citySlug, from, to).catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <p
          className="text-xs uppercase tracking-widest text-[var(--color-grass)] mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Upcoming Fixtures
        </p>
        <h1
          className="text-5xl font-black text-[var(--color-chalk)] uppercase tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {cityLabel}
        </h1>
        <p
          className="text-sm text-[var(--color-chalk-muted)] mt-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Next 30 days · Home fixtures only
        </p>
      </div>

      {matches.length > 0 ? (
        <MatchList matches={matches} />
      ) : (
        <EmptyState city={cityLabel} from={from} to={to} />
      )}
    </div>
  );
}
