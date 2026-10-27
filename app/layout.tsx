import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeIntel — AI-Powered Codebase Intelligence Platform",
  description:
    "Connect any GitHub repository for instant AI-powered security audits, architecture visualization, dependency analysis, and codebase intelligence. Supports public and private repos.",
  keywords: [
    "codebase analysis",
    "security audit",
    "architecture visualization",
    "dependency scanner",
    "GitHub analytics",
    "AI code review",
    "static analysis",
  ],
  authors: [{ name: "CodeIntel" }],
  openGraph: {
    title: "CodeIntel — AI-Powered Codebase Intelligence",
    description:
      "Instant security audits, architecture graphs, and AI-powered code review for any GitHub repository.",
    type: "website",
    locale: "en_US",
    siteName: "CodeIntel",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeIntel — AI-Powered Codebase Intelligence",
    description:
      "Instant security audits, architecture graphs, and AI-powered code review for any GitHub repository.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
