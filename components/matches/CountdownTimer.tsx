"use client";

import { useEffect, useState } from "react";

interface Props {
  utcDate: string;
  status: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(utcDate: string): TimeLeft {
  const total = new Date(utcDate).getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total };
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  return { days, hours, minutes, seconds, total };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer({ utcDate, status, compact }: Props) {
  const [time, setTime] = useState<TimeLeft>(() => getTimeLeft(utcDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(utcDate)), 1000);
    return () => clearInterval(id);
  }, [utcDate]);

  const isLive = status === "IN_PLAY" || status === "PAUSED";
  const isToday = new Date(utcDate).toDateString() === new Date().toDateString();

  if (isLive || time.total <= 0) return null;

  const parts: { value: number; label: string; dim?: boolean }[] = [];
  if (time.days > 0) parts.push({ value: time.days, label: "d" });
  parts.push({ value: time.hours, label: "h" });
  parts.push({ value: time.minutes, label: "m" });
  if (time.days === 0) parts.push({ value: time.seconds, label: "s", dim: true });

  const countdownContent = (
    <div className="flex items-baseline gap-1.5">
      {parts.map(({ value, label, dim }, i) => (
        <span key={label}>
          {i > 0 && !dim && (
            <span className="text-[var(--color-pitch-border)] mr-1.5">·</span>
          )}
          <span
            className="text-sm font-bold tabular-nums"
            style={{
              fontFamily: "var(--font-mono)",
              color: isToday && !dim
                ? "var(--color-grass)"
                : dim
                  ? "var(--color-chalk-dim)"
                  : "var(--color-chalk)",
            }}
          >
            {pad(value)}
            <span
              className="text-xs font-normal ml-0.5"
              style={{ color: "var(--color-chalk-dim)" }}
            >
              {label}
            </span>
          </span>
        </span>
      ))}
    </div>
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {isToday ? "⚽" : "in"}
        </span>
        {countdownContent}
      </div>
    );
  }

  return (
    <div className="border-b border-[var(--color-pitch-border)] bg-[var(--color-pitch-dark)] py-2.5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center gap-3">
        <span
          className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] shrink-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {isToday ? "⚽ Today —" : "Kickoff in"}
        </span>
        {countdownContent}
      </div>
    </div>
  );
}
