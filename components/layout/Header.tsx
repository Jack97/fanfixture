"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV: { href: string; label: string; activePrefix?: string }[] = [
  { href: "/matches", label: "Matches" },
  { href: "/#cities", label: "Cities", activePrefix: "/city/" },
  { href: "/blog", label: "Guides" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-pitch-black)]/95 backdrop-blur-sm border-b border-[var(--color-pitch-border)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group" aria-label="FanFixture home">
          <span
            className="w-2 h-2 rounded-full bg-[var(--color-grass)] shrink-0"
            aria-hidden="true"
          />
          <span className="text-lg font-bold tracking-tight text-[var(--color-chalk)]">
            FanFixture
          </span>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="hidden sm:flex items-center gap-1">
            {NAV.map(({ href, label, activePrefix }) => {
              const active = activePrefix
                ? pathname.startsWith(activePrefix)
                : pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      active
                        ? "text-[var(--color-grass)] bg-[var(--color-pitch-dark)]"
                        : "text-[var(--color-chalk-muted)] hover:text-[var(--color-chalk)] hover:bg-[var(--color-pitch-dark)]"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
