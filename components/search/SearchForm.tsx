"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SUPPORTED_CITIES } from "@/lib/football-api/search";
import { todayISO, maxDateISO, addDays, toISODate } from "@/lib/utils/dates";
import { trackSearchSubmitted } from "@/lib/analytics/events";

interface SearchFormProps {
  defaultCity?: string;
  defaultFrom?: string;
  defaultTo?: string;
  compact?: boolean;
}

export default function SearchForm({ defaultCity = "", defaultFrom, defaultTo, compact }: SearchFormProps) {
  const router = useRouter();
  const today = todayISO();
  const nextWeekend = toISODate(addDays(new Date(), 7));
  const weekAfter = toISODate(addDays(new Date(), 14));

  const [city, setCity] = useState(defaultCity);
  const [from, setFrom] = useState(defaultFrom ?? nextWeekend);
  const [to, setTo] = useState(defaultTo ?? weekAfter);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!city) return;
    trackSearchSubmitted(city, from, to);
    const params = new URLSearchParams({ city, from, to });
    router.push(`/matches?${params.toString()}`);
  }

  const inputBase =
    "w-full bg-transparent text-[var(--color-chalk)] placeholder:text-[var(--color-chalk-dim)] border-b border-[var(--color-pitch-border)] focus:border-[var(--color-grass)] outline-none py-2 transition-colors text-sm";
  const labelBase =
    "block text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] mb-1";

  return (
    <form onSubmit={handleSubmit} className={compact ? "flex flex-col gap-3" : "flex flex-col gap-5"}>
      <div>
        <label className={labelBase} style={{ fontFamily: "var(--font-mono)" }}>
          City or Region
        </label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className={inputBase}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <option value="" disabled>Select a city…</option>
          {SUPPORTED_CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelBase} style={{ fontFamily: "var(--font-mono)" }}>
            From
          </label>
          <input
            type="date"
            value={from}
            min={today}
            max={maxDateISO()}
            onChange={(e) => setFrom(e.target.value)}
            required
            className={inputBase}
          />
        </div>
        <div>
          <label className={labelBase} style={{ fontFamily: "var(--font-mono)" }}>
            To
          </label>
          <input
            type="date"
            value={to}
            min={from}
            max={maxDateISO()}
            onChange={(e) => setTo(e.target.value)}
            required
            className={inputBase}
            style={{ fontFamily: "var(--font-mono)" }}
          />
        </div>
      </div>

      <button type="submit" className="btn-ember mt-2 w-full gap-3 text-base py-4">
        <span>Find Matches</span>
        <span className="ml-auto text-lg">→</span>
      </button>
    </form>
  );
}
