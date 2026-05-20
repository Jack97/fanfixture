"use client";

import { useState, useEffect } from "react";
import type { Match } from "@/lib/football-api/types";
import TransportSection from "@/components/trip/TransportSection";
import FanPubsSection from "@/components/trip/FanPubsSection";
import ThingsToDoSection from "@/components/trip/ThingsToDoSection";
import AwayFanInfo from "@/components/matches/AwayFanInfo";
import HotelCTA from "@/components/booking/HotelCTA";

type FanType = "away" | "travelling" | "local";

const FAN_TYPES: { value: FanType; label: string }[] = [
  { value: "away", label: "Away Fan" },
  { value: "travelling", label: "Travelling Fan" },
  { value: "local", label: "Local Fan" },
];

function TripStep({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3 px-1">
        <span
          className="text-xs tabular-nums"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-grass)" }}
        >
          {num}
        </span>
        <span
          className="text-sm font-black uppercase tracking-tight text-[var(--color-chalk)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

interface Props {
  match: Match;
}

const FAN_TYPE_KEY = "fanfixture_fan_type";

export default function TripPlanner({ match }: Props) {
  const [fanType, setFanType] = useState<FanType>("away");

  useEffect(() => {
    const saved = localStorage.getItem(FAN_TYPE_KEY) as FanType | null;
    if (saved && FAN_TYPES.some((f) => f.value === saved)) setFanType(saved);
  }, []);

  function handleFanTypeChange(value: FanType) {
    setFanType(value);
    localStorage.setItem(FAN_TYPE_KEY, value);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <p
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] px-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Plan Your Trip
        </p>

        <div className="flex gap-1 p-1 bg-white border border-[var(--color-pitch-border)] rounded-sm">
          {FAN_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFanTypeChange(value)}
              className={`flex-1 px-2 py-2 text-xs uppercase tracking-widest rounded-sm transition-colors ${
                fanType === value
                  ? "bg-[var(--color-grass)] text-[var(--color-pitch-black)] font-bold"
                  : "text-[var(--color-chalk-dim)] hover:text-[var(--color-chalk)]"
              }`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {fanType === "away" && (
        <>
          <TripStep num="01" title={`Travel to ${match.venue.city}`}>
            <TransportSection match={match} />
          </TripStep>
          <TripStep num="02" title="Book Your Stay">
            <HotelCTA match={match} />
          </TripStep>
          <TripStep num="03" title="Away End Info">
            <AwayFanInfo match={match} />
          </TripStep>
          <TripStep num="04" title="Pre-Match Drinks">
            <FanPubsSection venue={match.venue} awayFriendlyOnly />
          </TripStep>
          <TripStep num="05" title={`Explore ${match.venue.city}`}>
            <ThingsToDoSection venue={match.venue} />
          </TripStep>
        </>
      )}

      {fanType === "travelling" && (
        <>
          <TripStep num="01" title={`Travel to ${match.venue.city}`}>
            <TransportSection match={match} />
          </TripStep>
          <TripStep num="02" title="Book Your Stay">
            <HotelCTA match={match} />
          </TripStep>
          <TripStep num="03" title="Pre-Match Pubs">
            <FanPubsSection venue={match.venue} />
          </TripStep>
          <TripStep num="04" title={`Explore ${match.venue.city}`}>
            <ThingsToDoSection venue={match.venue} />
          </TripStep>
        </>
      )}

      {fanType === "local" && (
        <>
          <TripStep num="01" title="Getting There">
            <TransportSection match={match} hideFlights />
          </TripStep>
          <TripStep num="02" title="Pre-Match Pubs">
            <FanPubsSection venue={match.venue} />
          </TripStep>
          <TripStep num="03" title={`Explore ${match.venue.city}`}>
            <ThingsToDoSection venue={match.venue} />
          </TripStep>
        </>
      )}
    </div>
  );
}
