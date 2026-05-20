"use client";

import type { Match } from "@/lib/football-api/types";
import { buildTicketLinks, type TicketPlatform } from "@/lib/tickets/deeplink";
import { trackTicketCtaClick } from "@/lib/analytics/events";

const PLATFORMS: {
  key: TicketPlatform;
  label: string;
  badge: string;
  description: string;
}[] = [
  {
    key: "viagogo",
    label: "Viagogo",
    badge: "Resale",
    description: "Largest resale marketplace — guaranteed delivery",
  },
  {
    key: "livefootballtickets",
    label: "LiveFootballTickets",
    badge: "Specialist",
    description: "Football-only platform, UK focused",
  },
];

export default function TicketCTA({ match }: { match: Match }) {
  const links = buildTicketLinks(match);

  return (
    <div className="bg-[var(--color-pitch-card)] border border-[var(--color-pitch-border)] rounded-sm p-6">
      <div className="flex items-start gap-3 mb-5">
        <span className="text-2xl">🎟️</span>
        <div>
          <h2
            className="text-xl font-black text-[var(--color-chalk)] uppercase tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get Tickets
          </h2>
          <p
            className="text-sm text-[var(--color-chalk-muted)] mt-0.5"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {match.homeTeam.shortName} vs {match.awayTeam.shortName}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {PLATFORMS.map(({ key, label, badge, description }) => (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => trackTicketCtaClick(match.id, key)}
            className="group flex items-center justify-between border border-[var(--color-pitch-border)] hover:border-[var(--color-grass)] rounded-sm p-4 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span
                  className="font-black text-sm text-[var(--color-chalk)] uppercase tracking-tight group-hover:text-[var(--color-grass)] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {label}
                </span>
                <span
                  className="text-[0.6rem] uppercase tracking-widest text-[var(--color-chalk-dim)] border border-[var(--color-pitch-border)] rounded-full px-1.5 py-0.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {badge}
                </span>
              </div>
              <p
                className="text-xs text-[var(--color-chalk-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {description}
              </p>
            </div>
            <span className="text-[var(--color-grass)] opacity-0 group-hover:opacity-100 transition-opacity ml-3 shrink-0">
              →
            </span>
          </a>
        ))}
      </div>

      <p
        className="text-xs text-[var(--color-chalk-dim)] mt-4"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Resale tickets — prices may vary from face value
      </p>
    </div>
  );
}
