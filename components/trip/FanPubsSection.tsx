import type { Venue } from "@/lib/football-api/types";

interface Props {
  venue: Venue;
  awayFriendlyOnly?: boolean;
}

export default function FanPubsSection({ venue, awayFriendlyOnly }: Props) {
  const pubs = awayFriendlyOnly
    ? (venue.fanPubs?.filter((p) => p.awayFriendly) ?? [])
    : (venue.fanPubs ?? []);

  if (!pubs.length) {
    if (!awayFriendlyOnly) {
      return (
        <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-pitch-border)]">
            <h2
              className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Fan Pubs
            </h2>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs text-[var(--color-chalk-muted)] leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
              Pub guide for {venue.city} coming soon — check with the home supporters&apos; trust for recommendations near the ground.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-pitch-border)]">
          <h2
            className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Pre-Match Drinks
          </h2>
        </div>
        <div className="px-5 py-4">
          <p className="text-xs text-[var(--color-chalk-muted)] leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
            No designated away-friendly pubs near the ground — stick to the city centre before heading to the stadium, and check with your club&apos;s supporters trust for the latest advice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-pitch-border)]">
        <h2
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Fan Pubs
        </h2>
      </div>

      <div className="divide-y divide-[var(--color-pitch-border)]">
        {pubs.map((pub) => (
          <div key={pub.name} className="px-5 py-4 flex items-start gap-4">
            <span className="text-lg shrink-0 mt-0.5">🍺</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p
                  className="text-sm font-bold text-[var(--color-chalk)] uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {pub.name}
                </p>
                <span
                  className="text-xs text-[var(--color-chalk-dim)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {pub.walkMins} min walk
                </span>
                {pub.awayFriendly && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full border border-[var(--color-grass)]/40 text-[var(--color-grass)] uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}
                  >
                    Away friendly
                  </span>
                )}
              </div>
              <p
                className="text-sm text-[var(--color-chalk-muted)] leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {pub.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
