import type { Venue } from "@/lib/football-api/types";

export default function VenueDetails({ venue }: { venue: Venue }) {
  const mapsUrl = `https://maps.google.com/?q=${venue.lat},${venue.lng}`;

  return (
    <div className="bg-[var(--color-pitch-dark)] border border-[var(--color-pitch-border)] rounded-sm p-5">
      <h2
        className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] mb-4"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Venue
      </h2>

      <p
        className="text-2xl font-black text-[var(--color-chalk)] uppercase tracking-tight mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {venue.name}
      </p>

      <p className="text-sm text-[var(--color-chalk-muted)] mb-4">{venue.address}</p>

      <div className="flex items-center gap-6">
        {venue.capacity && (
          <div>
            <p
              className="text-xs text-[var(--color-chalk-dim)] uppercase tracking-widest"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Capacity
            </p>
            <p
              className="text-[var(--color-chalk)] font-bold"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {venue.capacity.toLocaleString("en-GB")}
            </p>
          </div>
        )}
        <div>
          <p
            className="text-xs text-[var(--color-chalk-dim)] uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            City
          </p>
          <p
            className="text-[var(--color-chalk)] font-bold"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {venue.city}
          </p>
        </div>
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-5 text-xs text-[var(--color-grass)] hover:underline"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Open in Google Maps →
      </a>
    </div>
  );
}
