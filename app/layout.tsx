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
    default: "FanFixture — Find UK Football Matches & Book Hotels",
    template: "%s | FanFixture",
  },
  description:
    "Find Premier League and Championship football matches near you. Book hotels close to the stadium for your perfect football trip.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://fanfixture.co.uk"),
  openGraph: {
    type: "website",
    siteName: "FanFixture",
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
