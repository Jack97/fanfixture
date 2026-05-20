import Image from "next/image";
import type { Match } from "@/lib/football-api/types";
import { formatMatchDate, formatKickoff } from "@/lib/utils/dates";
import { getTeamColor, hexToRgba } from "@/lib/football-api/team-colors";
import CountdownTimer from "@/components/matches/CountdownTimer";

interface MatchHeroProps {
  match: Match;
}

const COMPETITION_COLORS: Record<string, string> = {
  PL: "var(--color-grass)",
  ELC: "#60a5fa",
};

export default function MatchHero({ match }: MatchHeroProps) {
  const accentColor = COMPETITION_COLORS[match.competition.code] ?? "var(--color-chalk-dim)";
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";

  const homeColor = getTeamColor(match.homeTeam.id);
  const awayColor = getTeamColor(match.awayTeam.id);

  const gradient = `linear-gradient(to right, ${hexToRgba(homeColor, 0.13)} 0%, transparent 42%, transparent 58%, ${hexToRgba(awayColor, 0.13)} 100%)`;

  return (
    <div className="relative bg-[var(--color-pitch-dark)] pitch-texture overflow-hidden">
      {/* Team colour gradient overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: gradient }} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-5 sm:pt-7 pb-28">
        {/* Top row: competition badge + countdown */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
          <span className="competition-badge">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            {match.competition.name}
            {match.matchday ? ` · Matchday ${match.matchday}` : ""}
          </span>
          {!isLive && (
            <CountdownTimer utcDate={match.utcDate} status={match.status} compact />
          )}
          {isLive && (
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-live)" }}
            >
              ● Live
            </span>
          )}
        </div>

        {/* Teams row */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-10 max-w-md mx-auto">
          <div className="flex justify-center">
            <TeamBlock team={match.homeTeam} color={homeColor} align="right" />
          </div>

          <div className="text-center shrink-0">
            <p
              className="text-2xl sm:text-4xl font-bold text-[var(--color-chalk)] leading-none tabular-nums text-center"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {isLive ? (
                <span style={{ color: "var(--color-live)" }}>LIVE</span>
              ) : (
                formatKickoff(match.utcDate)
              )}
            </p>
            <p
              className="text-xs text-[var(--color-chalk-dim)] mt-1.5 tracking-widest uppercase text-center"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {formatMatchDate(match.utcDate)}
            </p>
          </div>

          <div className="flex justify-center">
            <TeamBlock team={match.awayTeam} color={awayColor} align="left" />
          </div>
        </div>

        {/* Venue strip */}
        <p
          className="text-xs text-[var(--color-chalk-dim)] text-center mt-5 tracking-widest"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          📍 {match.venue.name} · {match.venue.city}
        </p>
      </div>

      {/* Fade into page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--color-pitch-black))" }}
      />
    </div>
  );
}

function TeamBlock({
  team,
  color,
  align,
}: {
  team: Match["homeTeam"];
  color: string;
  align: "left" | "right";
}) {
  return (
    <div className={`flex flex-col items-center gap-2 text-center`}>
      {team.crest ? (
        <Image
          src={team.crest}
          alt={team.shortName}
          width={52}
          height={52}
          className="object-contain"
          style={{ filter: `drop-shadow(0 0 14px ${hexToRgba(color, 0.35)})` }}
          unoptimized
        />
      ) : (
        <span className="w-12 h-12 rounded-full bg-[var(--color-pitch-border)]" />
      )}
      <span
        className="text-base sm:text-lg font-black text-[var(--color-chalk)] uppercase tracking-tight leading-tight max-w-[80px] sm:max-w-[110px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {team.shortName}
      </span>
    </div>
  );
}
