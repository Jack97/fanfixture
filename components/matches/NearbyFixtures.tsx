import Link from "next/link";
import Image from "next/image";
import type { Match } from "@/lib/football-api/types";
import { formatShortDate, formatKickoff } from "@/lib/utils/dates";
import { getAllScheduledMatches } from "@/lib/football-api/client";

interface Props {
  currentMatch: Match;
}

export default async function NearbyFixtures({ currentMatch }: Props) {
  const all = await getAllScheduledMatches().catch(() => []);

  const nearby = all
    .filter(
      (m) =>
        m.homeTeam.id === currentMatch.homeTeam.id &&
        m.id !== currentMatch.id &&
        new Date(m.utcDate) > new Date()
    )
    .slice(0, 3);

  if (nearby.length === 0) return null;

  return (
    <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm p-5">
      <h2
        className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] mb-4"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        More at {currentMatch.venue.name}
      </h2>

      <div className="flex flex-col divide-y divide-[var(--color-pitch-border)]">
        {nearby.map((match) => (
          <Link
            key={match.id}
            href={`/matches/${match.slug}`}
            className="group flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {match.awayTeam.crest && (
                <Image
                  src={match.awayTeam.crest}
                  alt={match.awayTeam.shortName}
                  width={20}
                  height={20}
                  className="object-contain shrink-0"
                  unoptimized
                />
              )}
              <span
                className="text-sm font-black text-[var(--color-chalk)] uppercase tracking-tight truncate"
                style={{ fontFamily: "var(--font-display)" }}
              >
                vs {match.awayTeam.shortName}
              </span>
            </div>
            <span
              className="text-xs text-[var(--color-chalk-muted)] shrink-0"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {formatShortDate(match.utcDate)} · {formatKickoff(match.utcDate)}
            </span>
            <span className="text-[var(--color-grass)] opacity-0 group-hover:opacity-100 transition-opacity text-xs shrink-0">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
