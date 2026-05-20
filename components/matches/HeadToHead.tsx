import Image from "next/image";
import type { Match } from "@/lib/football-api/types";
import { getHeadToHead } from "@/lib/football-api/results";
import { formatShortDate } from "@/lib/utils/dates";

interface Props {
  match: Match;
}

export default async function HeadToHead({ match }: Props) {
  const results = await getHeadToHead(match.id).catch(() => []);

  if (results.length === 0) return null;

  let homeWins = 0;
  let draws = 0;
  let awayWins = 0;

  for (const r of results) {
    const homeIsA = r.homeTeam.id === match.homeTeam.id;
    if (r.winner === "draw") draws++;
    else if ((r.winner === "home" && homeIsA) || (r.winner === "away" && !homeIsA)) homeWins++;
    else awayWins++;
  }

  return (
    <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-pitch-border)]">
        <h2
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Head to Head
        </h2>
      </div>

      {/* Summary bar */}
      <div className="px-5 py-4 border-b border-[var(--color-pitch-border)]">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-bold uppercase tracking-tight text-[var(--color-chalk)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {match.homeTeam.tla}
          </span>
          <span
            className="text-xs text-[var(--color-chalk-dim)] uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            last {results.length}
          </span>
          <span
            className="text-xs font-bold uppercase tracking-tight text-[var(--color-chalk)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {match.awayTeam.tla}
          </span>
        </div>

        {/* W/D/W bar */}
        <div className="flex items-center gap-1 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-grass)] rounded-l-full"
            style={{ flex: homeWins || 0.01 }}
          />
          <div
            className="h-full bg-[var(--color-ember)]"
            style={{ flex: draws || 0.01 }}
          />
          <div
            className="h-full bg-red-400 rounded-r-full"
            style={{ flex: awayWins || 0.01 }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span
            className="text-sm font-black tabular-nums text-[var(--color-grass)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {homeWins}W
          </span>
          <span
            className="text-sm font-black tabular-nums text-[var(--color-ember)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {draws}D
          </span>
          <span
            className="text-sm font-black tabular-nums text-red-400"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {awayWins}W
          </span>
        </div>
      </div>

      {/* Recent meetings */}
      <div className="divide-y divide-[var(--color-pitch-border)]">
        {results.map((r) => {
          const homeIsA = r.homeTeam.id === match.homeTeam.id;
          const teamAWon =
            (r.winner === "home" && homeIsA) ||
            (r.winner === "away" && !homeIsA);
          const teamBWon =
            (r.winner === "home" && !homeIsA) ||
            (r.winner === "away" && homeIsA);

          const scoreA = homeIsA ? r.homeGoals : r.awayGoals;
          const scoreB = homeIsA ? r.awayGoals : r.homeGoals;
          const score =
            scoreA !== null && scoreB !== null ? `${scoreA}–${scoreB}` : "–";

          return (
            <div key={r.id} className="flex items-center gap-3 px-5 py-3">
              {/* Home team crest */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                <span
                  className={`text-xs truncate ${teamAWon ? "font-bold text-[var(--color-chalk)]" : "text-[var(--color-chalk-dim)]"}`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {r.homeTeam.shortName}
                </span>
                {r.homeTeam.crest && (
                  <Image src={r.homeTeam.crest} alt="" width={16} height={16} className="object-contain shrink-0" unoptimized />
                )}
              </div>

              <span
                className="text-sm font-bold tabular-nums text-[var(--color-chalk)] shrink-0"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {score}
              </span>

              {/* Away team crest */}
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {r.awayTeam.crest && (
                  <Image src={r.awayTeam.crest} alt="" width={16} height={16} className="object-contain shrink-0" unoptimized />
                )}
                <span
                  className={`text-xs truncate ${teamBWon ? "font-bold text-[var(--color-chalk)]" : "text-[var(--color-chalk-dim)]"}`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {r.awayTeam.shortName}
                </span>
              </div>

              <span
                className="text-xs text-[var(--color-chalk-dim)] w-14 text-right shrink-0"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {formatShortDate(r.utcDate)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
