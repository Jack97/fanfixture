import Image from "next/image";
import type { Match } from "@/lib/football-api/types";
import type { Result } from "@/lib/football-api/results";
import { getRecentResults } from "@/lib/football-api/results";
import { formatShortDate } from "@/lib/utils/dates";

interface Props {
  match: Match;
}

const OUTCOME_STYLES = {
  W: { label: "W", bg: "bg-[var(--color-grass)]/15", text: "text-[var(--color-grass)]", border: "border-[var(--color-grass)]/30" },
  D: { label: "D", bg: "bg-[var(--color-ember)]/15", text: "text-[var(--color-ember)]", border: "border-[var(--color-ember)]/30" },
  L: { label: "L", bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
};

function FormStrip({ results }: { results: Result[] }) {
  return (
    <div className="flex items-center gap-1">
      {results.slice(0, 5).map((r) => {
        const s = r.outcome ? OUTCOME_STYLES[r.outcome] : null;
        return (
          <span
            key={r.id}
            className={`inline-flex items-center justify-center w-5 h-5 rounded-sm text-[0.6rem] font-bold border ${s ? `${s.bg} ${s.text} ${s.border}` : "bg-[var(--color-pitch-border)] text-[var(--color-chalk-dim)]"}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {r.outcome ?? "?"}
          </span>
        );
      })}
    </div>
  );
}

function ResultRows({ results }: { results: Result[] }) {
  return (
    <div className="divide-y divide-[var(--color-pitch-border)]">
      {results.map((result) => {
        const s = result.outcome ? OUTCOME_STYLES[result.outcome] : null;
        const score =
          result.goalsFor !== null && result.goalsAgainst !== null
            ? `${result.goalsFor}–${result.goalsAgainst}`
            : "–";

        return (
          <div key={result.id} className="flex items-center gap-3 px-5 py-3">
            <span
              className={`shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-sm text-xs font-bold border ${s ? `${s.bg} ${s.text} ${s.border}` : "border-[var(--color-pitch-border)] text-[var(--color-chalk-dim)]"}`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {result.outcome ?? "?"}
            </span>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              {result.opponent.crest && (
                <Image
                  src={result.opponent.crest}
                  alt={result.opponent.shortName}
                  width={18}
                  height={18}
                  className="object-contain shrink-0"
                  unoptimized
                />
              )}
              <span
                className="text-sm text-[var(--color-chalk-muted)] truncate"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span className="text-[var(--color-chalk-dim)] text-xs mr-1">
                  {result.isHome ? "vs" : "@"}
                </span>
                {result.opponent.shortName}
              </span>
            </div>

            <span
              className="shrink-0 text-sm font-bold text-[var(--color-chalk)] tabular-nums"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {score}
            </span>

            <span
              className="shrink-0 text-xs text-[var(--color-chalk-dim)] w-16 text-right"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {formatShortDate(result.utcDate)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default async function RecentResults({ match }: Props) {
  const [homeResults, awayResults] = await Promise.all([
    getRecentResults(match.homeTeam.id, match.competition.code, 6).catch(() => []),
    getRecentResults(match.awayTeam.id, match.competition.code, 6).catch(() => []),
  ]);

  if (homeResults.length === 0 && awayResults.length === 0) return null;

  return (
    <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
      {/* Home team */}
      {homeResults.length > 0 && (
        <>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-pitch-border)]">
            <h2
              className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {match.homeTeam.shortName} · Form
            </h2>
            <FormStrip results={homeResults} />
          </div>
          <ResultRows results={homeResults} />
        </>
      )}

      {/* Away team */}
      {awayResults.length > 0 && (
        <>
          <div className="flex items-center justify-between px-5 py-4 border-t-2 border-[var(--color-pitch-border)]">
            <h2
              className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {match.awayTeam.shortName} · Form
            </h2>
            <FormStrip results={awayResults} />
          </div>
          <ResultRows results={awayResults} />
        </>
      )}
    </div>
  );
}
