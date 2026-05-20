import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMatchById, getUpcomingMatches } from "@/lib/football-api/client";
import { parseMatchId } from "@/lib/utils/slug";
import { formatMatchDate } from "@/lib/utils/dates";
import { findTmEvent, tmFromPrice } from "@/lib/tickets/ticketmaster";
import TicketPricePanel from "@/components/tickets/TicketPricePanel";
import MatchHero from "@/components/matches/MatchHero";
import StickyMobileCTA from "@/components/matches/StickyMobileCTA";
import RecentResults from "@/components/matches/RecentResults";
import HeadToHead from "@/components/matches/HeadToHead";
import MatchNews from "@/components/matches/MatchNews";
import NearbyFixtures from "@/components/matches/NearbyFixtures";
import TripPlanner from "@/components/trip/TripPlanner";
import MatchStructuredData from "@/components/seo/MatchStructuredData";

export const revalidate = 3600;

export async function generateStaticParams() {
  const matches = await getUpcomingMatches(14).catch(() => []);
  return matches.map((m) => ({ matchId: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ matchId: string }>;
}): Promise<Metadata> {
  const { matchId } = await params;
  const id = parseMatchId(matchId);
  if (!id) return {};
  const match = await getMatchById(id).catch(() => null);
  if (!match) return {};

  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} | Tickets & Travel Guide`,
    description: `${match.homeTeam.name} vs ${match.awayTeam.name} on ${formatMatchDate(match.utcDate)}. Tickets, hotels, pubs and travel guide for ${match.venue.name}, ${match.venue.city}.`,
    openGraph: { images: [match.homeTeam.crest] },
    alternates: { canonical: `/matches/${match.slug}` },
  };
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const id = parseMatchId(matchId);
  if (!id) notFound();

  const match = await getMatchById(id).catch(() => null);
  if (!match) notFound();

  const tmEvent = await findTmEvent(match.homeTeam.name, match.utcDate).catch(() => null);
  const tmPrice = tmEvent ? tmFromPrice(tmEvent) : null;

  return (
    <div className="min-w-0">
      <MatchStructuredData match={match} />

      <MatchHero match={match} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 -mt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 flex flex-col gap-5 min-w-0">
            <section id="tickets" className="scroll-mt-28">
              <TicketPricePanel match={match} tmEvent={tmEvent} />
            </section>

            {/* On mobile: show form + news between tickets and the trip planner */}
            <div id="form" className="flex flex-col gap-5 lg:hidden scroll-mt-28">
              <HeadToHead match={match} />
              <RecentResults match={match} />
            </div>
            <div id="news" className="lg:hidden scroll-mt-28">
              <MatchNews match={match} />
            </div>

            <section id="plan" className="scroll-mt-28">
              <TripPlanner match={match} />
            </section>
          </div>

          {/* ── Sidebar (desktop only for form/news) ── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start min-w-0">
            <div className="hidden lg:flex lg:flex-col lg:gap-5">
              <HeadToHead match={match} />
              <RecentResults match={match} />
              <MatchNews match={match} />
            </div>
            <NearbyFixtures currentMatch={match} />
          </div>

        </div>
      </div>

      {/* Sticky mobile CTA — tickets primary, hotels secondary */}
      <StickyMobileCTA match={match} tmEvent={tmEvent} tmFromPrice={tmPrice} />
      <div className="h-20 md:hidden" />
    </div>
  );
}
