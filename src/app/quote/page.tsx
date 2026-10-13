import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InstantQuote from "@/components/InstantQuote";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Get a Free Packaging Quote",
  description:
    "Enter your product size, preview the right box and get a tailored custom packaging quote from Boxora.",
  path: "/quote",
});

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string | string[] }>;
}) {
  const { product } = await searchParams;
  const preset = Array.isArray(product) ? product[0] : product;

  return (
    <main>
      <Header />
      <InstantQuote asPage defaultIndustry={preset} />
      <Footer />
    </main>
  );
}
