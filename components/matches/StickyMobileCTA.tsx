"use client";

import type { Match } from "@/lib/football-api/types";
import type { TmEvent } from "@/lib/tickets/ticketmaster";
import { buildTicketLinks } from "@/lib/tickets/deeplink";
import { buildBookingDeeplink } from "@/lib/booking/deeplink";
import { trackTicketCtaClick, trackHotelCtaClick } from "@/lib/analytics/events";
import { toISODate } from "@/lib/utils/dates";

interface Props {
  match: Match;
  tmEvent: TmEvent | null;
  tmFromPrice: string | null;
}

export default function StickyMobileCTA({ match, tmEvent, tmFromPrice }: Props) {
  const ticketLinks = buildTicketLinks(match, tmEvent?.url);
  const checkin = toISODate(new Date(match.utcDate));
  const checkout = toISODate(new Date(new Date(match.utcDate).getTime() + 86400000));
  const hotelLink = buildBookingDeeplink({ venue: match.venue, checkin, checkout });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-pitch-border)] bg-[var(--color-pitch-black)]/95 backdrop-blur-sm p-3 flex items-center gap-2 md:hidden">
      {/* Tickets — primary */}
      <a
        href={ticketLinks.ticketmaster}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => trackTicketCtaClick(match.id, "ticketmaster")}
        className="btn-ember flex-1 py-3 text-sm justify-center gap-2"
      >
        <span>🎟️ Tickets</span>
        {tmFromPrice && (
          <span className="opacity-75 font-normal text-xs">from {tmFromPrice}</span>
        )}
      </a>

      {/* Hotels — secondary */}
      <a
        href={hotelLink}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={() => trackHotelCtaClick(match.id, match.venue.id, "sticky")}
        className="shrink-0 flex items-center justify-center gap-1.5 border border-[var(--color-pitch-border)] hover:border-[var(--color-chalk-muted)] rounded-sm px-4 py-3 text-xs uppercase tracking-widest text-[var(--color-chalk-muted)] hover:text-[var(--color-chalk)] transition-colors"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        🏨 Hotels
      </a>
    </div>
  );
}
