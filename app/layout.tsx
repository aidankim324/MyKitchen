import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist } from "next/font/google";
import { TimeZoneSync } from "@/components/layout/TimeZoneSync";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: {
    default: "MyKitchen",
    template: "%s | MyKitchen",
  },
  description:
    "Track the contents of your fridge, freezer, and pantry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={geist.variable}
      >
        <body>
          <TimeZoneSync />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
