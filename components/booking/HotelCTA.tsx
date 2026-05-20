"use client";

import type { Match } from "@/lib/football-api/types";
import { buildBookingDeeplink } from "@/lib/booking/deeplink";
import { trackHotelCtaClick } from "@/lib/analytics/events";
import { toISODate } from "@/lib/utils/dates";

interface HotelCTAProps {
  match: Match;
  sticky?: boolean;
}

export default function HotelCTA({ match, sticky }: HotelCTAProps) {
  const checkin = toISODate(new Date(match.utcDate));
  const checkout = toISODate(new Date(new Date(match.utcDate).getTime() + 86400000));

  const href = buildBookingDeeplink({
    venue: match.venue,
    checkin,
    checkout,
  });

  function handleClick() {
    trackHotelCtaClick(match.id, match.venue.id, sticky ? "sticky" : "inline");
  }

  if (sticky) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-pitch-border)] bg-[var(--color-pitch-black)]/95 backdrop-blur-sm p-4 flex items-center gap-4 md:hidden">
        <div className="min-w-0">
          <p
            className="text-xs text-[var(--color-chalk-muted)] truncate"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {match.venue.name}
          </p>
          <p
            className="text-sm font-black text-[var(--color-chalk)] uppercase truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Find Hotels
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="btn-ember shrink-0 text-sm px-5 py-3"
        >
          Book Now →
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm p-6">
      <div className="flex items-start gap-3 mb-1">
        <span className="text-2xl">🏨</span>
        <div>
          <h2
            className="text-xl font-black text-[var(--color-chalk)] uppercase tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Stay Near {match.venue.name}
          </h2>
          <p
            className="text-sm text-[var(--color-chalk-muted)] mt-0.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Hotels for {match.homeTeam.shortName} vs {match.awayTeam.shortName} ·{" "}
            {checkin} · {match.venue.city}
          </p>
        </div>
      </div>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className="mt-5 flex items-center justify-between w-full border border-[var(--color-chalk-muted)] hover:border-[var(--color-chalk)] rounded-sm px-5 py-3.5 text-sm text-[var(--color-chalk)] hover:text-[var(--color-chalk)] transition-colors"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span className="uppercase tracking-wider text-xs">Find Hotels Nearby</span>
        <span>→</span>
      </a>

      <p
        className="text-xs text-[var(--color-chalk-dim)] text-center mt-3"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Powered by Booking.com
      </p>
    </div>
  );
}
