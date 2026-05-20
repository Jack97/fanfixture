import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMatchById, getUpcomingMatches } from "@/lib/football-api/client";
import { parseMatchId } from "@/lib/utils/slug";
import { formatMatchDate } from "@/lib/utils/dates";
import { findTmEvent, tmFromPrice } from "@/lib/tickets/ticketmaster";
import TicketPricePanel from "@/components/tickets/TicketPricePanel";
import MatchHero from "@/components/matches/MatchHero";
import StickyMobileCTA from "@/components/matches/StickyMobileCTA";
import NearbyFixtures from "@/components/matches/NearbyFixtures";
import MatchJourney from "@/components/matches/MatchJourney";
import MatchStructuredData from "@/components/seo/MatchStructuredData";
import MatchBuzz from "@/components/matches/MatchBuzz";

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

      <div className="mx-auto max-w-3xl px-4 sm:px-6 -mt-16 pb-8 relative z-10 flex flex-col gap-5">
        <section id="plan" className="scroll-mt-28 bg-white border border-[var(--color-pitch-border)] rounded-sm p-4 sm:p-6">
          <MatchJourney
            match={match}
            ticketContent={
              <>
                <MatchBuzz match={match} tmEvent={tmEvent} />
                <TicketPricePanel match={match} tmEvent={tmEvent} />
              </>
            }
          />
        </section>
        <NearbyFixtures currentMatch={match} />
      </div>

      {/* Sticky mobile CTA — tickets primary, hotels secondary */}
      <StickyMobileCTA match={match} tmEvent={tmEvent} tmFromPrice={tmPrice} />
      <div className="h-20 md:hidden" />
    </div>
  );
}
