import { XMLParser } from "fast-xml-parser";

export interface BbcArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  thumbnail?: string;
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  cdataPropName: "__cdata",
  isArray: (name) => name === "item",
});

interface RssItem {
  title: string | { __cdata: string };
  link: string;
  description: string | { __cdata: string };
  pubDate: string;
  "media:thumbnail"?: { "@_url": string };
  "media:content"?: { "@_url": string };
}

function str(v: string | { __cdata: string } | undefined): string {
  if (!v) return "";
  if (typeof v === "string") return v.trim();
  return v.__cdata.trim();
}

function parseRss(xml: string): BbcArticle[] {
  const parsed = parser.parse(xml);
  const items: RssItem[] = parsed?.rss?.channel?.item ?? [];
  return items
    .map((item) => ({
      title: str(item.title),
      link: typeof item.link === "string" ? item.link.trim() : "",
      description: str(item.description),
      pubDate: str(item.pubDate),
      thumbnail:
        item["media:thumbnail"]?.["@_url"] ||
        item["media:content"]?.["@_url"] ||
        undefined,
    }))
    .filter((a) => a.title && a.link);
}

const BBC_FOOTBALL_RSS = "https://feeds.bbci.co.uk/sport/football/rss.xml";

export async function getMatchNews(
  homeTeam: string,
  awayTeam: string
): Promise<BbcArticle[]> {
  const res = await fetch(BBC_FOOTBALL_RSS, {
    next: { revalidate: 1800, tags: ["bbc-football-news"] },
  }).catch(() => null);

  if (!res?.ok) return [];

  const xml = await res.text();
  const all = parseRss(xml);

  const homeLower = homeTeam.toLowerCase().replace(/ fc$/i, "").trim();
  const awayLower = awayTeam.toLowerCase().replace(/ fc$/i, "").trim();

  const relevant = all.filter((a) => {
    const text = (a.title + " " + a.description).toLowerCase();
    return text.includes(homeLower) || text.includes(awayLower);
  });

  return relevant.length >= 2 ? relevant.slice(0, 3) : all.slice(0, 3);
}

export function timeAgo(pubDate: string): string {
  const ms = Date.now() - new Date(pubDate).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
