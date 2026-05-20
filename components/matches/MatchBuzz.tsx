import type { Match } from "@/lib/football-api/types";
import type { TmEvent } from "@/lib/tickets/ticketmaster";

const BIG_SIX = new Set([57, 61, 64, 65, 66, 73]); // Arsenal, Chelsea, Liverpool, Man City, Man United, Spurs

function daysUntil(utcDate: string): number {
  return Math.ceil((new Date(utcDate).getTime() - Date.now()) / 86400000);
}

interface Props {
  match: Match;
  tmEvent: TmEvent | null;
}

export default function MatchBuzz({ match, tmEvent }: Props) {
  const homeId = match.homeTeam.id;
  const awayId = match.awayTeam.id;
  const days = daysUntil(match.utcDate);

  const isBigSixHome = BIG_SIX.has(homeId);
  const isBigSixClash = BIG_SIX.has(homeId) && BIG_SIX.has(awayId);
  const isDerby = match.homeTeam.slug.split("-")[0] === match.awayTeam.slug.split("-")[0]
    || match.venue.citySlug === "manchester" && awayId === 66 && homeId === 65
    || match.venue.citySlug === "manchester" && awayId === 65 && homeId === 66
    || match.venue.citySlug === "london" && BIG_SIX.has(homeId) && BIG_SIX.has(awayId)
    || match.venue.citySlug === "merseyside" && ((homeId === 64 && awayId === 394) || (homeId === 394 && awayId === 64));

  const pills: { label: string; style: "hot" | "urgent" | "info" }[] = [];

  if (isDerby) pills.push({ label: "Derby", style: "hot" });
  else if (isBigSixClash) pills.push({ label: "Top fixture", style: "hot" });

  if (isBigSixHome) pills.push({ label: "Away tickets sell out fast", style: "urgent" });

  if (days <= 7 && days > 0) pills.push({ label: `${days} day${days === 1 ? "" : "s"} to go`, style: "urgent" });
  else if (days <= 14 && days > 0) pills.push({ label: `${days} days to go`, style: "info" });

  if (tmEvent && pills.length === 0) pills.push({ label: "Official tickets available", style: "info" });

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {pills.map((pill) => (
        <span
          key={pill.label}
          className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full uppercase tracking-widest ${
            pill.style === "hot"
              ? "bg-[var(--color-ember)]/10 text-[var(--color-ember)] border border-[var(--color-ember)]/30"
              : pill.style === "urgent"
              ? "bg-[var(--color-grass)]/10 text-[var(--color-grass)] border border-[var(--color-grass)]/30"
              : "bg-[var(--color-pitch-border)] text-[var(--color-chalk-dim)] border border-[var(--color-pitch-border)]"
          }`}
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}
        >
          {pill.label}
        </span>
      ))}
    </div>
  );
}
