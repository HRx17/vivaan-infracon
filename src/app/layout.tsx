import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { Suspense } from "react";
import { themeScript } from "@/components/ui/ThemeToggle";
import { Splash } from "@/components/ui/Splash";
import { NavigationProgress } from "@/components/ui/NavigationProgress";
import "./globals.css";

const heading = Manrope({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-heading", display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Vivaan Infracon — Nileesh Baldha, Builder", template: "%s — Vivaan Infracon" },
  description:
    "The portfolio of Nileesh Baldha and Vivaan Infracon: completed, ongoing and upcoming residential and commercial projects.",
  openGraph: { type: "website", siteName: "Vivaan Infracon" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1222" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Splash />
        <Suspense fallback={null}><NavigationProgress /></Suspense>
        {children}
      </body>
    </html>
  );
}
