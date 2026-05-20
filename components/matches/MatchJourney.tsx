"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Match } from "@/lib/football-api/types";
import TransportSection from "@/components/trip/TransportSection";
import FanPubsSection from "@/components/trip/FanPubsSection";
import ThingsToDoSection from "@/components/trip/ThingsToDoSection";
import HotelCTA from "@/components/booking/HotelCTA";

const VenueMap = dynamic(() => import("@/components/map/VenueMap"), { ssr: false });

const STEPS = [
  { num: "01", label: "Tickets" },
  { num: "02", label: "Travel" },
  { num: "03", label: "Stay" },
  { num: "04", label: "Explore" },
];

interface Props {
  match: Match;
  ticketContent: React.ReactNode;
}

export default function MatchJourney({ match, ticketContent }: Props) {
  const [step, setStep] = useState(0);

  function renderStepContent() {
    switch (step) {
      case 0:
        return ticketContent;
      case 1:
        return <TransportSection match={match} />;
      case 2:
        return (
          <div className="flex flex-col gap-5">
            <HotelCTA match={match} />
            <FanPubsSection venue={match.venue} />
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-5">
            <VenueMap venue={match.venue} />
            <ThingsToDoSection venue={match.venue} />
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Step indicator */}
      <div className="flex items-start">
        {STEPS.map((s, i) => {
          const isActive = i === step;
          const isPast = i < step;
          return (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => setStep(i)}
                className="flex flex-col items-center gap-1.5 shrink-0"
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isActive
                      ? "bg-[var(--color-grass)] text-[var(--color-pitch-black)]"
                      : isPast
                      ? "bg-[var(--color-grass)]/30 text-[var(--color-grass)]"
                      : "bg-[var(--color-pitch-border)] text-[var(--color-chalk-dim)]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {isPast ? "✓" : s.num}
                </span>
                <span
                  className={`text-xs uppercase tracking-widest hidden sm:block transition-colors text-center leading-tight ${
                    isActive ? "text-[var(--color-chalk)]" : "text-[var(--color-chalk-dim)]"
                  }`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-1.5 mt-3.5 transition-colors ${
                    i < step ? "bg-[var(--color-grass)]/40" : "bg-[var(--color-pitch-border)]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="min-h-[200px]">
        {renderStepContent()}
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-pitch-border)]">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-muted)] hover:text-[var(--color-chalk)] disabled:opacity-0 disabled:pointer-events-none transition-colors px-1 py-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ← Back
        </button>

        <span
          className="text-xs text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {step + 1} / {STEPS.length}
        </span>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="btn-ember text-sm px-5 py-2.5"
          >
            Continue →
          </button>
        ) : (
          <span
            className="text-xs uppercase tracking-widest text-[var(--color-grass)] px-1 py-2"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            All set ✓
          </span>
        )}
      </div>
    </div>
  );
}
