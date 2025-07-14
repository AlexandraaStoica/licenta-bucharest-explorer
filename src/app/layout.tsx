import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import UserSyncer from "@/components/UserSyncer";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bucharest Explorer - Discover Romania's Capital",
  description: "Explore Bucharest's museums, restaurants, historical sites, and cultural events. Plan your perfect itinerary and discover the hidden gems of Romania's capital.",
  keywords: "Bucharest, Romania, travel, tourism, museums, restaurants, events, itinerary, culture",
  authors: [{ name: "Bucharest Explorer" }],
  openGraph: {
    title: "Bucharest Explorer - Discover Romania's Capital",
    description: "Explore Bucharest's museums, restaurants, historical sites, and cultural events.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bucharest Explorer - Discover Romania's Capital",
    description: "Explore Bucharest's museums, restaurants, historical sites, and cultural events.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <header className="flex justify-end items-center p-4 border-b bg-white/80 backdrop-blur sticky top-0 z-50">
            <SignedOut>
              <Link href="/sign-in" className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Sign In</Link>
              <Link href="/sign-up" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Sign Up</Link>
            </SignedOut>
            <SignedIn>
              <UserSyncer />
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
