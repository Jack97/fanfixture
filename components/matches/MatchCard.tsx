import Link from "next/link";
import Image from "next/image";
import type { Match } from "@/lib/football-api/types";
import { formatMatchDate, formatKickoff } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

interface MatchCardProps {
  match: Match;
  animationDelay?: number;
}

const COMPETITION_COLORS: Record<string, string> = {
  PL: "var(--color-grass)",
  ELC: "#60a5fa",
};

function TeamDisplay({ team }: { team: Match["homeTeam"] }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      {team.crest ? (
        <Image
          src={team.crest}
          alt={team.shortName}
          width={28}
          height={28}
          className="object-contain shrink-0"
          unoptimized
        />
      ) : (
        <span className="w-7 h-7 rounded-full bg-[var(--color-pitch-border)] shrink-0" />
      )}
      <span
        className="font-black text-2xl text-[var(--color-chalk)] uppercase tracking-tight truncate"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {team.shortName}
      </span>
    </div>
  );
}

export default function MatchCard({ match, animationDelay = 0 }: MatchCardProps) {
  const accentColor = COMPETITION_COLORS[match.competition.code] ?? "var(--color-chalk-dim)";
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";

  return (
    <Link
      href={`/matches/${match.slug}`}
      className="group block opacity-0 animate-fade-up"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: "forwards" }}
    >
      <article
        className="relative bg-[var(--color-pitch-dark)] border-l-2 hover:bg-[var(--color-pitch-card)] transition-colors duration-200 p-5"
        style={{ borderLeftColor: accentColor }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <span className="competition-badge">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            {match.competition.name}
          </span>
          <span
            className={cn(
              "text-xs tracking-widest",
              isLive ? "text-[var(--color-live)]" : "text-[var(--color-grass)]"
            )}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {isLive
              ? "● LIVE"
              : `${formatMatchDate(match.utcDate)} · ${formatKickoff(match.utcDate)}`}
          </span>
        </div>

        {/* Teams */}
        <div className="flex items-center gap-4">
          <TeamDisplay team={match.homeTeam} />
          <span
            className="text-xs text-[var(--color-chalk-dim)] shrink-0"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            vs
          </span>
          <TeamDisplay team={match.awayTeam} />
        </div>

        {/* Venue row */}
        <div className="mt-4 flex items-center justify-between">
          <p
            className="text-xs text-[var(--color-chalk-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            📍 {match.venue.name} · {match.venue.city}
          </p>
          <span className="text-[var(--color-grass)] opacity-0 group-hover:opacity-100 transition-opacity text-sm">
            →
          </span>
        </div>
      </article>
    </Link>
  );
}
