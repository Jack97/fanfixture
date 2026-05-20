import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Away Day Guides | FanFixture",
  description:
    "Ground-level guides for away fans — pubs, transport, parking, and what to expect at every Premier League and Championship ground.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-14">
      <header className="mb-10 pb-8 border-b border-[var(--color-pitch-border)]">
        <p className="text-xs font-medium uppercase tracking-widest text-[var(--color-chalk-dim)] mb-3">
          Guides
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-chalk)] leading-tight mb-3">
          Away Day Guides
        </h1>
        <p className="text-[var(--color-chalk-muted)] leading-relaxed max-w-lg">
          Ground-level guides for travelling supporters — the away end, the best pubs, how to get
          there, and what to expect on the day.
        </p>
      </header>

      <ul className="divide-y divide-[var(--color-pitch-border)]" role="list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block py-7 hover:no-underline"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-[var(--color-grass)] uppercase tracking-wide">
                  {post.city}
                </span>
                <span className="text-[var(--color-pitch-border)]" aria-hidden="true">·</span>
                <span className="text-xs text-[var(--color-chalk-dim)] font-[var(--font-mono)]">
                  {post.readTime} min read
                </span>
              </div>

              <h2 className="text-xl font-bold text-[var(--color-chalk)] group-hover:text-[var(--color-grass)] transition-colors leading-snug mb-2">
                {post.title}
              </h2>

              <p className="text-sm text-[var(--color-chalk-muted)] leading-relaxed line-clamp-2">
                {post.description}
              </p>

              <span
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-grass)] opacity-0 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                Read guide →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
