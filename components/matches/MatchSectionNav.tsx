"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "tickets", label: "Tickets" },
  { id: "form", label: "Form" },
  { id: "news", label: "News" },
  { id: "plan", label: "Plan" },
] as const;

export default function MatchSectionNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observers = SECTIONS.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="sticky top-14 z-20 bg-[var(--color-pitch-black)]/95 backdrop-blur-sm border-b border-[var(--color-pitch-border)] -mx-4 sm:-mx-6 px-4 sm:px-6 mb-6">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`shrink-0 px-3 py-1.5 text-xs uppercase tracking-widest rounded-sm transition-colors ${
              active === id
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
  );
}
