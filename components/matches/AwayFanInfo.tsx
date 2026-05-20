import Image from "next/image";
import type { Match } from "@/lib/football-api/types";
import { buildTicketLinks } from "@/lib/tickets/deeplink";

interface Props {
  match: Match;
}

export default function AwayFanInfo({ match }: Props) {
  const { venue } = match;
  const ticketLinks = buildTicketLinks(match);
  const awayFriendlyPubs = venue.fanPubs?.filter((p) => p.awayFriendly) ?? [];

  return (
    <div className="bg-white border border-[var(--color-pitch-border)] rounded-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-pitch-border)]">
        {match.awayTeam.crest && (
          <Image
            src={match.awayTeam.crest}
            alt={match.awayTeam.shortName}
            width={20}
            height={20}
            className="object-contain"
            unoptimized
          />
        )}
        <h2
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {match.awayTeam.shortName} Fans — Away Guide
        </h2>
      </div>

      <div className="divide-y divide-[var(--color-pitch-border)]">

        {/* Away end */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">🏟️</span>
            <div className="min-w-0">
              <p
                className="text-sm font-bold text-[var(--color-chalk)] uppercase tracking-wide mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Away End{venue.awayStand ? `: ${venue.awayStand}` : ""}
              </p>
              <p
                className="text-xs text-[var(--color-chalk-muted)] leading-relaxed"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {venue.awayCapacity
                  ? `Typical away allocation: ~${venue.awayCapacity.toLocaleString("en-GB")} seats.`
                  : "Away allocation varies — check with your club's ticket office."}
                {" "}Follow stadium signage to the away entrance on arrival.
              </p>
            </div>
          </div>
        </div>

        {/* Away tickets */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">🎟️</span>
            <div className="min-w-0 flex-1">
              <p
                className="text-sm font-bold text-[var(--color-chalk)] uppercase tracking-wide mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Getting Tickets
              </p>
              <p
                className="text-xs text-[var(--color-chalk-muted)] leading-relaxed mb-3"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Away tickets are sold via your own club's ticket office — members and season ticket holders get priority. Buy early, allocations sell out fast.
              </p>
              <div className="flex flex-col gap-2">
                {venue.ticketOfficeUrl && (
                  <a
                    href={venue.ticketOfficeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border border-[var(--color-grass)]/40 hover:border-[var(--color-grass)] rounded-sm px-4 py-2.5 text-xs text-[var(--color-grass)] hover:text-[var(--color-grass)] transition-colors"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span className="uppercase tracking-wider">{match.homeTeam.shortName} — Official Ticket Office</span>
                    <span>→</span>
                  </a>
                )}
                <div className="flex gap-2">
                  <a
                    href={ticketLinks.livefootballtickets}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex-1 flex items-center justify-between border border-[var(--color-pitch-border)] hover:border-[var(--color-chalk-muted)] rounded-sm px-3 py-2 text-xs text-[var(--color-chalk-muted)] hover:text-[var(--color-chalk)] transition-colors"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span className="uppercase tracking-wider text-[0.65rem]">Resale via LFT</span>
                    <span>→</span>
                  </a>
                  <a
                    href={ticketLinks.viagogo}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex-1 flex items-center justify-between border border-[var(--color-pitch-border)] hover:border-[var(--color-chalk-muted)] rounded-sm px-3 py-2 text-xs text-[var(--color-chalk-muted)] hover:text-[var(--color-chalk)] transition-colors"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <span className="uppercase tracking-wider text-[0.65rem]">Resale via Viagogo</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Away-friendly pubs */}
        {awayFriendlyPubs.length > 0 ? (
          <div className="px-5 py-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0 mt-0.5">🍺</span>
              <div className="min-w-0 flex-1">
                <p
                  className="text-sm font-bold text-[var(--color-chalk)] uppercase tracking-wide mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Away-Friendly Pubs
                </p>
                <div className="flex flex-col gap-2">
                  {awayFriendlyPubs.map((pub) => (
                    <div key={pub.name}>
                      <p
                        className="text-xs font-bold text-[var(--color-chalk)] uppercase tracking-wide"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {pub.name}
                        <span className="font-normal text-[var(--color-chalk-dim)] ml-2">{pub.walkMins} min walk</span>
                      </p>
                      <p
                        className="text-xs text-[var(--color-chalk-muted)] mt-0.5 leading-relaxed"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {pub.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 flex items-start gap-3">
            <span className="text-lg shrink-0 mt-0.5">🍺</span>
            <p
              className="text-xs text-[var(--color-chalk-muted)] leading-relaxed"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              No designated away pubs near the ground — stick to the city centre before making your way to the stadium, and check with your club's supporters trust for the latest advice.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
