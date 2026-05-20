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

export default function AffiliateBanner({ match, tmEvent, tmFromPrice }: Props) {
  const ticketLinks = buildTicketLinks(match, tmEvent?.url);
  const checkin = toISODate(new Date(match.utcDate));
  const checkout = toISODate(new Date(new Date(match.utcDate).getTime() + 86400000));
  const hotelLink = buildBookingDeeplink({ venue: match.venue, checkin, checkout });

  return (
    <div className="border-b border-[var(--color-pitch-border)] bg-[var(--color-pitch-dark)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center gap-3">

        <a
          href={ticketLinks.ticketmaster}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackTicketCtaClick(match.id, "ticketmaster")}
          className="btn-ember text-xs py-2 px-4 shrink-0"
        >
          🎟 Buy Tickets{tmFromPrice ? ` · from ${tmFromPrice}` : ""}
        </a>

        <div className="flex-1" />

        <a
          href={hotelLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => trackHotelCtaClick(match.id, match.venue.id, "inline")}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-grass)] hover:text-[var(--color-grass-dim)] transition-colors py-2 shrink-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          🏨 Hotels nearby →
        </a>

      </div>
    </div>
  );
}
