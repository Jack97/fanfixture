export default function EmptyState({ city, from, to }: { city: string; from: string; to: string }) {
  return (
    <div className="py-20 text-center">
      <p className="text-5xl mb-6">⚽</p>
      <h2
        className="text-2xl font-black uppercase tracking-tight text-[var(--color-chalk)] mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        No Matches Found
      </h2>
      <p className="text-[var(--color-chalk-muted)] text-sm max-w-sm mx-auto">
        No home fixtures in <strong className="text-[var(--color-chalk)]">{city}</strong> between{" "}
        <strong className="text-[var(--color-chalk)]">{from}</strong> and{" "}
        <strong className="text-[var(--color-chalk)]">{to}</strong>. Try a different date range or city.
      </p>
    </div>
  );
}
