import type { MetadataRoute } from "next";
import { getUpcomingMatches } from "@/lib/football-api/client";
import { SUPPORTED_CITIES } from "@/lib/football-api/search";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fanfixture.co.uk";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const matches = await getUpcomingMatches(60).catch(() => []);

  const matchUrls: MetadataRoute.Sitemap = matches.map((m) => ({
    url: `${BASE}/matches/${m.slug}`,
    lastModified: new Date(m.utcDate),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const cityUrls: MetadataRoute.Sitemap = SUPPORTED_CITIES.map((c) => ({
    url: `${BASE}/city/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  return [
    { url: BASE, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/matches`, changeFrequency: "daily", priority: 0.7 },
    ...cityUrls,
    ...matchUrls,
  ];
}
