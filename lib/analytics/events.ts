"use client";

import posthog from "posthog-js";

export function trackSearchSubmitted(city: string, dateFrom: string, dateTo: string) {
  posthog.capture("search_submitted", { city, date_from: dateFrom, date_to: dateTo });
}

export function trackMatchDetailView(params: {
  matchId: number;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venueCity: string;
  daysUntilMatch: number;
}) {
  posthog.capture("match_detail_view", {
    match_id: params.matchId,
    home_team: params.homeTeam,
    away_team: params.awayTeam,
    competition: params.competition,
    venue_city: params.venueCity,
    days_until_match: params.daysUntilMatch,
  });
}

export function trackHotelCtaClick(matchId: number, venueId: string, position: "inline" | "sticky") {
  posthog.capture("hotel_cta_click", { match_id: matchId, venue_id: venueId, position });
}

export function trackTicketCtaClick(
  matchId: number,
  platform: "viagogo" | "livefootballtickets" | "ticketmaster" | "stubhub" | "twickets",
) {
  posthog.capture("ticket_cta_click", { match_id: matchId, platform });
}
