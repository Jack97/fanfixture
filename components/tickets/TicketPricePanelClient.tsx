"use client";

import { trackTicketCtaClick } from "@/lib/analytics/events";

interface Props {
  href: string;
  matchId: number;
  platform: "ticketmaster" | "livefootballtickets" | "viagogo";
  label: string;
  variant: "primary" | "ghost";
}

export default function TicketPricePanelClient({ href, matchId, platform, label, variant }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={() => trackTicketCtaClick(matchId, platform)}
      className={
        variant === "primary"
          ? "btn-ember w-full py-3 text-sm justify-between flex items-center"
          : "w-full flex items-center justify-between text-xs uppercase tracking-widest text-[var(--color-chalk-muted)] hover:text-[var(--color-chalk)] border border-[var(--color-pitch-border)] hover:border-[var(--color-chalk-muted)] rounded-sm px-4 py-3 transition-colors"
      }
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {label}
    </a>
  );
}
