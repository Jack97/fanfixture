import type { Match } from "@/lib/football-api/types";
import { buildTrainlineLink, buildSkyscannerLink, buildJustParkLink } from "@/lib/transport/deeplink";

interface Props {
  match: Match;
  hideFlights?: boolean;
  hideTrains?: boolean;
}

export default function TransportSection({ match, hideFlights, hideTrains }: Props) {
  const { venue } = match;
  const trainlineUrl = buildTrainlineLink(venue);
  const skyscannerUrl = buildSkyscannerLink(venue, match.utcDate);
  const justParkUrl = buildJustParkLink(venue);

  return (
    <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-pitch-border)]">
        <h2
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Getting There
        </h2>
      </div>

      <div className="divide-y divide-[var(--color-pitch-border)]">

        {/* Train */}
        {!hideTrains && (
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-lg shrink-0 mt-0.5">🚆</span>
              <div className="min-w-0">
                <p
                  className="text-sm font-bold text-[var(--color-chalk)] uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Train
                </p>
                {venue.nearestStation && (
                  <p
                    className="text-xs text-[var(--color-chalk-muted)] mt-0.5 leading-relaxed"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {venue.transportNote ?? `Nearest station: ${venue.nearestStation}`}
                  </p>
                )}
              </div>
            </div>
            <a
              href={trainlineUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="shrink-0 text-xs uppercase tracking-widest text-[var(--color-chalk-muted)] hover:text-[var(--color-chalk)] border border-[var(--color-pitch-border)] hover:border-[var(--color-chalk-muted)] rounded-sm px-3 py-2 transition-colors whitespace-nowrap"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Book trains →
            </a>
          </div>
        )}

        {/* Flight */}
        {!hideFlights && venue.airportCode && (
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-lg shrink-0 mt-0.5">✈️</span>
              <div className="min-w-0">
                <p
                  className="text-sm font-bold text-[var(--color-chalk)] uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Fly
                </p>
                <p
                  className="text-xs text-[var(--color-chalk-muted)] mt-0.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Nearest airport: {venue.airportCode}
                </p>
              </div>
            </div>
            <a
              href={skyscannerUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="shrink-0 text-xs uppercase tracking-widest text-[var(--color-chalk-muted)] hover:text-[var(--color-chalk)] border border-[var(--color-pitch-border)] hover:border-[var(--color-chalk-muted)] rounded-sm px-3 py-2 transition-colors whitespace-nowrap"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Search flights →
            </a>
          </div>
        )}

        {/* Parking */}
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-lg shrink-0 mt-0.5">🚗</span>
            <div className="min-w-0">
              <p
                className="text-sm font-bold text-[var(--color-chalk)] uppercase tracking-wide"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Parking
              </p>
              <p
                className="text-xs text-[var(--color-chalk-muted)] mt-0.5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Reserve a space near {venue.name}
              </p>
            </div>
          </div>
          <a
            href={justParkUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="shrink-0 text-xs uppercase tracking-widest text-[var(--color-chalk-muted)] hover:text-[var(--color-chalk)] border border-[var(--color-pitch-border)] hover:border-[var(--color-chalk-muted)] rounded-sm px-3 py-2 transition-colors whitespace-nowrap"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Find parking →
          </a>
        </div>

      </div>
    </div>
  );
}
