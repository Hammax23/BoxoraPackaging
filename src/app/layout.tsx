import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import JsonLd from "@/components/JsonLd";
import { getSiteContent } from "@/lib/queries/content";
import { getIndustries } from "@/lib/queries/industries";
import { getSiteUrl, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

const poppins = Poppins({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [industries, siteContent] = await Promise.all([getIndustries(), getSiteContent()]);

  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <body className="antialiased">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers industries={industries} siteContent={siteContent}>{children}</Providers>
      </body>
    </html>
  );
}
