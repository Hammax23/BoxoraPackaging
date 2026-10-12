"use client";

import { IndustriesProvider } from "@/components/IndustriesProvider";
import QuoteDrawerProvider from "@/components/QuoteDrawerProvider";
import type { IndustryView } from "@/lib/queries/industries";

export default function Providers({
  industries,
  children,
}: {
  industries: IndustryView[];
  children: React.ReactNode;
}) {
  return (
    <IndustriesProvider industries={industries}>
      <QuoteDrawerProvider>{children}</QuoteDrawerProvider>
    </IndustriesProvider>
  );
}
