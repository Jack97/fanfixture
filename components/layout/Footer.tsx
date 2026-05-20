import Link from "next/link";

const CITIES = ["London", "Manchester", "Liverpool", "Birmingham", "Newcastle", "Brighton"];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-pitch-border)] bg-[var(--color-pitch-dark)]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-grass)]" aria-hidden="true" />
              <span className="font-bold text-[var(--color-chalk)] tracking-tight">
                FanFixture
              </span>
            </div>
            <p className="text-sm text-[var(--color-chalk-muted)] max-w-xs leading-relaxed">
              Find football matches across the UK and book your perfect football trip.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-chalk-dim)] mb-3">
              Cities
            </p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
              {CITIES.map((city) => (
                <li key={city}>
                  <Link
                    href={`/city/${city.toLowerCase()}`}
                    className="text-sm text-[var(--color-chalk-muted)] hover:text-[var(--color-chalk)] transition-colors"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 text-xs text-[var(--color-chalk-dim)]">
          © {new Date().getFullYear()} FanFixture · Hotel links powered by Booking.com · Match data
          from football-data.org
        </p>
      </div>
    </footer>
  );
}
