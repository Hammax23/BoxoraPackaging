import type { Metadata } from "next";
import { Figtree, Marcellus } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import JsonLd from "@/components/JsonLd";
import { getSiteUrl, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Boxora – Print Custom Packaging and Pouches",
    template: "%s | Boxora",
  },
  description:
    "Custom packaging, eco-friendly pouches, coffee bags and printing services. Your brand, our packaging.",
  openGraph: {
    siteName: "Boxora",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${marcellus.variable} ${figtree.variable}`}>
      <body className="antialiased">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
