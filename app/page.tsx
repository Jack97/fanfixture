import SearchForm from "@/components/search/SearchForm";
import Link from "next/link";
import { SUPPORTED_CITIES } from "@/lib/football-api/search";

export default function HomePage() {
  const featuredCities = SUPPORTED_CITIES.filter((c) =>
    ["london", "manchester", "liverpool", "newcastle", "brighton", "leeds"].includes(c.slug)
  );

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-65px)] flex items-center pitch-texture">
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: "var(--color-grass)", opacity: 0.6 }}
        />

        <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Headline */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] text-[var(--color-grass)] mb-4"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                UK Football Tourism
              </p>
              <h1
                className="uppercase font-black leading-none tracking-tight text-[var(--color-chalk)] mb-6"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
                }}
              >
                Find
                <br />
                <span style={{ color: "var(--color-grass)" }}>Your</span>
                <br />
                Match.
              </h1>
              <p className="text-[var(--color-chalk-muted)] max-w-sm leading-relaxed">
                The away day planner for English football. Compare ticket prices, sort your
                travel, book a hotel near the ground, and find things to do in the city.
              </p>

              <p
                className="mt-8 text-xs tracking-widest text-[var(--color-chalk-dim)] uppercase"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Premier League · Championship
              </p>
            </div>

            {/* Right: Search form */}
            <div className="bg-[var(--color-pitch-dark)] border border-[var(--color-pitch-border)] rounded-sm p-6 sm:p-8">
              <p
                className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] mb-6"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Search Fixtures
              </p>
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* Featured cities */}
      <section id="cities" className="bg-[var(--color-pitch-dark)] border-t border-[var(--color-pitch-border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <p
            className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] mb-8"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Browse by City
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {featuredCities.map((city) => (
              <Link
                key={city.slug}
                href={`/city/${city.slug}`}
                className="group bg-[var(--color-pitch-card)] border border-[var(--color-pitch-border)] hover:border-[var(--color-grass)] rounded-sm p-5 transition-colors"
              >
                <span className="text-[var(--color-grass)] text-xs mb-2 block">●</span>
                <p
                  className="font-black text-xl text-[var(--color-chalk)] uppercase tracking-tight group-hover:text-[var(--color-grass)] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {city.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[var(--color-pitch-border)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <p
            className="text-xs uppercase tracking-widest text-[var(--color-chalk-dim)] mb-12"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            How It Works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: "01",
                title: "Get Tickets",
                body: "Compare prices across Ticketmaster, Viagogo, StubHub and more in one place.",
              },
              {
                num: "02",
                title: "Sort Your Travel",
                body: "Find flights and trains to the city, with links to book in seconds.",
              },
              {
                num: "03",
                title: "Book Your Stay",
                body: "Hotels within walking distance of the ground — filtered by check-in date.",
              },
              {
                num: "04",
                title: "Explore the City",
                body: "Discover fan pubs, local attractions, and things to do on match day.",
              },
            ].map((step) => (
              <div key={step.num}>
                <span
                  className="text-5xl font-black text-[var(--color-pitch-border)] block mb-4"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.num}
                </span>
                <h3
                  className="text-xl font-black text-[var(--color-chalk)] uppercase tracking-tight mb-2"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--color-chalk-muted)]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
