import type { Match } from "@/lib/football-api/types";

export default function MatchStructuredData({ match }: { match: Match }) {
  const endDate = new Date(new Date(match.utcDate).getTime() + 2 * 60 * 60 * 1000).toISOString();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
    startDate: match.utcDate,
    endDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: match.venue.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: match.venue.address,
        addressLocality: match.venue.city,
        addressCountry: "GB",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: match.venue.lat,
        longitude: match.venue.lng,
      },
    },
    organizer: {
      "@type": "Organization",
      name: match.competition.name,
    },
    performer: [
      { "@type": "SportsTeam", name: match.homeTeam.name },
      { "@type": "SportsTeam", name: match.awayTeam.name },
    ],
    image: match.homeTeam.crest,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
