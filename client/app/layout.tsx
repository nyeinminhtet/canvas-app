import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/ui/toaster";
import { Providers } from "./provider";

const inter = Inter({ subsets: ["latin"] });

const TITLE = "Canvas Drawing";
const DESCRIPTION = "Draw with friends in real-time.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: "no",
  },
  metadataBase: "https://canvas-app-rt.vercel.app",
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og"],
    creator: "@nmh",
  },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og"],
    siteName: TITLE,
    url: "https://canvas-app-rt.vercel.app",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
