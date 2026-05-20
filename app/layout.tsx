import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PostHogProvider from "@/components/analytics/PostHogProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: {
    default: "FanFixture — The Away Day Planner for English Football",
    template: "%s | FanFixture",
  },
  description:
    "The away day planner for English football. Compare ticket prices, sort your travel, book a hotel near the ground, and discover what to do in the city.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://fanfixture.co.uk"),
  openGraph: {
    type: "website",
    siteName: "FanFixture",
  },
  other: {
    "impact-site-verification": "e835eaad-c817-4347-bd8b-36a26223405f",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}
