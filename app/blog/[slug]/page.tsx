import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/blog";

export const revalidate = 86400;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | FanFixture`,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-14">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-chalk-muted)] hover:text-[var(--color-chalk)] transition-colors mb-10"
      >
        ← All Guides
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-[var(--color-grass)] uppercase tracking-wide">
            {post.city}
          </span>
          <span className="text-[var(--color-pitch-border)]" aria-hidden="true">·</span>
          <span className="text-xs text-[var(--color-chalk-dim)] font-[var(--font-mono)]">
            {post.readTime} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-chalk)] leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-[var(--color-chalk-muted)] leading-relaxed">
          {post.description}
        </p>
      </header>

      <hr className="border-[var(--color-pitch-border)] mb-10" />

      <article className="prose-fanfixture">
        <MDXRemote source={post.content} />
      </article>

      <div className="mt-12 pt-8 border-t border-[var(--color-pitch-border)]">
        <p className="text-sm text-[var(--color-chalk-muted)] mb-3">Planning your trip?</p>
        <Link href="/matches" className="btn-ember inline-flex items-center gap-2">
          Find upcoming fixtures →
        </Link>
      </div>
    </div>
  );
}
