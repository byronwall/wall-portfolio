import "./global.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Navbar } from "./components/nav";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "./components/footer";
import { baseUrl } from "./sitemap";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Byron Wall",
    template: "%s | Byron Wall",
  },
  description:
    "Software engineer with expertise in TypeScript, React/SolidJS, and data visualization. Currently working as a Hydraulic and Fluid Systems Engineer at Allison Transmission.",
  openGraph: {
    title: "Byron Wall",
    description:
      "Software engineer with expertise in TypeScript, React/SolidJS, and data visualization. Currently working as a Hydraulic and Fluid Systems Engineer at Allison Transmission.",
    url: baseUrl,
    siteName: "Byron Wall",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cx(
        "text-black bg-white dark:text-white dark:bg-black",
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <head>
        <script
          defer
          src="https://as8ws0w.apps.byroni.us/script.js"
          data-website-id="03d5aaeb-7747-4d42-83b1-a3e859babdca"
        ></script>
      </head>
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  );
}
