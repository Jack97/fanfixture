import type { Match } from "@/lib/football-api/types";
import type { TmEvent } from "@/lib/tickets/ticketmaster";
import { tmPrimaryRange } from "@/lib/tickets/ticketmaster";
import { buildTicketLinks } from "@/lib/tickets/deeplink";
import TicketPricePanelClient from "./TicketPricePanelClient";

interface Props {
  match: Match;
  tmEvent: TmEvent | null;
}

export default function TicketPricePanel({ match, tmEvent }: Props) {
  const ticketLinks = buildTicketLinks(match, tmEvent?.url);
  const primaryRange = tmEvent ? tmPrimaryRange(tmEvent) : null;

  const allRanges = tmEvent?.priceRanges ?? [];

  return (
    <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-pitch-border)]">
        <h2
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Ticket Prices
        </h2>
        {tmEvent && (
          <span
            className="text-xs text-[var(--color-chalk-dim)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            via Ticketmaster · updated hourly
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col gap-5">

        {/* ── Ticketmaster block ── */}
        {tmEvent ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold text-[var(--color-chalk)] uppercase tracking-wider"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Ticketmaster
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full border border-[var(--color-grass)]/40 text-[var(--color-grass)] uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}>
                Official
              </span>
            </div>

            {/* Price ranges */}
            {allRanges.length > 0 ? (
              <div className="flex flex-col gap-3">
                {allRanges.map((range, i) => {
                  const min = Math.round(range.min);
                  const max = Math.round(range.max);
                  const label = formatRangeType(range.type);
                  return (
                    <PriceRow
                      key={i}
                      label={label}
                      min={min}
                      max={max}
                      currency={range.currency}
                      allRanges={allRanges}
                    />
                  );
                })}
              </div>
            ) : (
              <p
                className="text-sm text-[var(--color-chalk-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Prices not yet listed — check back closer to the match.
              </p>
            )}

            {/* Seatmap */}
            {tmEvent.seatmap?.staticUrl && (
              <div>
                <p
                  className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] mb-2"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Seating Plan
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tmEvent.seatmap.staticUrl}
                  alt="Stadium seating plan"
                  className="w-full rounded-sm border border-[var(--color-pitch-border)] opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            )}

            <TicketPricePanelClient
              href={ticketLinks.ticketmaster}
              matchId={match.id}
              platform="ticketmaster"
              label={primaryRange ? `Buy from £${Math.round(primaryRange.min)}` : "Buy Tickets"}
              variant="primary"
            />
          </div>
        ) : (
          <p
            className="text-sm text-[var(--color-chalk-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            No official listing yet — tickets available on resale markets below.
          </p>
        )}

        {/* ── Resale divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-pitch-border)]" />
          <span
            className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] shrink-0"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Resale marketplaces
          </span>
          <div className="flex-1 h-px bg-[var(--color-pitch-border)]" />
        </div>

        {/* ── Resale links ── */}
        <div className="flex flex-col sm:flex-row gap-2">
          <TicketPricePanelClient
            href={ticketLinks.livefootballtickets}
            matchId={match.id}
            platform="livefootballtickets"
            label="LiveFootballTickets →"
            variant="ghost"
          />
          <TicketPricePanelClient
            href={ticketLinks.viagogo}
            matchId={match.id}
            platform="viagogo"
            label="Viagogo →"
            variant="ghost"
          />
        </div>

        <p
          className="text-xs text-[var(--color-chalk-dim)] border-t border-[var(--color-pitch-border)] pt-4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Resale prices may exceed face value. Always buy from trusted sellers.
        </p>
      </div>
    </div>
  );
}

function formatRangeType(type: string): string {
  if (type === "standard") return "Standard";
  if (type === "standard including fees") return "Incl. fees";
  if (type.includes("resale")) return "Resale";
  if (type.includes("vip") || type.includes("premium")) return "Premium";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function PriceRow({
  label,
  min,
  max,
  currency,
  allRanges,
}: {
  label: string;
  min: number;
  max: number;
  currency: string;
  allRanges: { min: number; max: number }[];
}) {
  const sym = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  const globalMax = Math.max(...allRanges.map((r) => r.max));
  const barPct = globalMax > 0 ? Math.round((max / globalMax) * 100) : 100;
  const fillPct = globalMax > 0 ? Math.round(((max - min) / globalMax) * 100) : 0;
  const startPct = globalMax > 0 ? Math.round((min / globalMax) * 100) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {label}
        </span>
        <span
          className="text-sm font-bold text-[var(--color-chalk)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {sym}{min}
          {max > min && (
            <span className="text-[var(--color-chalk-muted)] font-normal">
              {" "}– {sym}{max}
            </span>
          )}
        </span>
      </div>
      {/* Range bar */}
      <div className="relative h-1 bg-[var(--color-pitch-border)] rounded-full overflow-hidden">
        <div
          className="absolute top-0 h-full bg-[var(--color-grass)] rounded-full opacity-70"
          style={{ left: `${startPct}%`, width: `${fillPct || 4}%` }}
        />
      </div>
    </div>
  );
}
