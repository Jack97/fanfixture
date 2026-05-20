import type { Venue } from "@/lib/football-api/types";

const CATEGORY_ICONS: Record<string, string> = {
  attraction: "🏛️",
  museum: "🖼️",
  park: "🌿",
  food: "🍽️",
  experience: "⭐",
  shopping: "🛍️",
};

export default function ThingsToDoSection({ venue }: { venue: Venue }) {
  if (!venue.highlights?.length) {
    return (
      <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-pitch-border)]">
          <h2
            className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Things To Do in {venue.city}
          </h2>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-[var(--color-chalk-muted)] leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
            Guide for {venue.city} coming soon — check local tourism boards for attractions near the ground.
          </p>
        </div>
      </div>
    );
  }

  const viatorCity = encodeURIComponent(venue.city);
  const viatorAffId = process.env.NEXT_PUBLIC_VIATOR_AFF_ID ?? "";
  const viatorUrl = viatorAffId
    ? `https://www.viator.com/search/${viatorCity}?pid=${viatorAffId}&mcid=42383&medium=api`
    : `https://www.viator.com/search/${viatorCity}`;

  return (
    <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-pitch-border)]">
        <h2
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Things To Do in {venue.city}
        </h2>
        <a
          href={viatorUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] hover:text-[var(--color-grass)] transition-colors"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          All experiences →
        </a>
      </div>

      <div className="divide-y divide-[var(--color-pitch-border)]">
        {venue.highlights.map((item) => {
          const icon = CATEGORY_ICONS[item.category] ?? "📍";
          return (
            <div key={item.name} className="px-5 py-4 flex items-start gap-4">
              <span className="text-lg shrink-0 mt-0.5">{icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p
                    className="text-sm font-bold text-[var(--color-chalk)] uppercase tracking-wide"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.name}
                  </p>
                  {item.walkMins !== undefined && item.walkMins < 999 && (
                    <span
                      className="text-xs text-[var(--color-chalk-dim)]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {item.walkMins} min walk
                    </span>
                  )}
                </div>
                <p
                  className="text-sm text-[var(--color-chalk-muted)] leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
