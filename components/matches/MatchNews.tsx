import type { Match } from "@/lib/football-api/types";
import { getMatchNews, timeAgo } from "@/lib/news/bbc";

interface Props {
  match: Match;
}

export default async function MatchNews({ match }: Props) {
  const articles = await getMatchNews(
    match.homeTeam.name,
    match.awayTeam.name
  ).catch(() => []);

  if (articles.length === 0) return null;

  return (
    <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-pitch-border)]">
        <h2
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Latest News
        </h2>
        <span
          className="text-xs text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          via BBC Sport
        </span>
      </div>

      <div className="divide-y divide-[var(--color-pitch-border)]">
        {articles.map((article, i) => (
          <a
            key={article.link + i}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-4 px-5 py-4 hover:bg-[var(--color-pitch-card)] transition-colors group"
          >
            {/* Thumbnail */}
            {article.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.thumbnail}
                alt=""
                className="w-20 h-14 object-cover rounded-sm shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
              />
            )}

            <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
              <p
                className="text-sm font-bold text-[var(--color-chalk)] leading-snug group-hover:text-[var(--color-grass)] transition-colors line-clamp-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {article.title}
              </p>
              {article.description && (
                <p
                  className="text-xs text-[var(--color-chalk-muted)] leading-relaxed line-clamp-2 hidden sm:block"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {article.description}
                </p>
              )}
              <p
                className="text-xs text-[var(--color-chalk-dim)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {timeAgo(article.pubDate)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
