import type { Venue } from "@/lib/football-api/types";

export default function TravelInfo({ venue }: { venue: Venue }) {
  if (!venue.nearestStation && !venue.pubArea) return null;

  return (
    <div className="bg-[var(--color-pitch-dark)] border border-[var(--color-pitch-border)] rounded-sm p-5">
      <h2
        className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] mb-5"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Getting There & Local Tips
      </h2>

      <div className="flex flex-col gap-5">
        {venue.nearestStation && (
          <div className="flex gap-4">
            <span className="text-xl shrink-0 mt-0.5">🚆</span>
            <div>
              <p
                className="text-sm font-bold text-[var(--color-chalk)] mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {venue.nearestStation}
              </p>
              {venue.transportNote && (
                <p className="text-sm text-[var(--color-chalk-muted)] leading-relaxed">
                  {venue.transportNote}
                </p>
              )}
            </div>
          </div>
        )}

        {venue.pubArea && (
          <div className="flex gap-4">
            <span className="text-xl shrink-0 mt-0.5">🍺</span>
            <div>
              <p
                className="text-sm font-bold text-[var(--color-chalk)] mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Pre-Match Drinks
              </p>
              <p className="text-sm text-[var(--color-chalk-muted)] leading-relaxed">
                {venue.pubArea}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
