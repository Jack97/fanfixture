import type { Match } from "@/lib/football-api/types";
import type { TmEvent } from "@/lib/tickets/ticketmaster";
import { tmFromPrice } from "@/lib/tickets/ticketmaster";
import { buildTicketLinks } from "@/lib/tickets/deeplink";
import TicketPricePanelClient from "./TicketPricePanelClient";

interface Props {
  match: Match;
  tmEvent: TmEvent | null;
}

type Row = {
  platform: "ticketmaster" | "viagogo" | "livefootballtickets" | "stubhub" | "twickets";
  name: string;
  from: string | null;
  official: boolean;
};

export default function TicketPricePanel({ match, tmEvent }: Props) {
  const links = buildTicketLinks(match, tmEvent?.url);
  const tmPrice = tmEvent ? tmFromPrice(tmEvent) : null;

  const rows: Row[] = [
    { platform: "ticketmaster", name: "Ticketmaster", from: tmPrice, official: true },
    { platform: "viagogo", name: "Viagogo", from: null, official: false },
    { platform: "livefootballtickets", name: "LiveFootballTickets", from: null, official: false },
    { platform: "stubhub", name: "StubHub", from: null, official: false },
    { platform: "twickets", name: "Twickets", from: null, official: false },
  ];

  return (
    <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-pitch-border)]">
        <h2
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Compare Prices
        </h2>
        {tmEvent && (
          <span
            className="text-xs text-[var(--color-chalk-dim)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            updated hourly
          </span>
        )}
      </div>

      <div className="divide-y divide-[var(--color-pitch-border)]">
        {rows.map((row) => (
          <div
            key={row.platform}
            className="flex items-center justify-between gap-3 px-5 py-3.5"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="text-sm font-bold text-[var(--color-chalk)] truncate"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {row.name}
              </span>
              {row.official && (
                <span
                  className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-[var(--color-grass)]/40 text-[var(--color-grass)] uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}
                >
                  Official
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className="text-sm font-bold tabular-nums text-[var(--color-chalk)] w-16 text-right"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {row.from ? `from ${row.from}` : "—"}
              </span>
              <TicketPricePanelClient
                href={links[row.platform]}
                matchId={match.id}
                platform={row.platform}
                label="View →"
                variant="ghost"
              />
            </div>
          </div>
        ))}
      </div>

      <p
        className="text-xs text-[var(--color-chalk-dim)] px-5 py-3 border-t border-[var(--color-pitch-border)]"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Resale prices may exceed face value. Always buy from trusted sellers.
      </p>
    </div>
  );
}
