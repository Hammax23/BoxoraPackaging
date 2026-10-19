"use client";

import { IndustriesProvider } from "@/components/IndustriesProvider";
import { SiteContentProvider } from "@/components/SiteContentProvider";
import QuoteDrawerProvider from "@/components/QuoteDrawerProvider";
import type { SiteContent } from "@/lib/queries/content";
import type { IndustryView } from "@/lib/queries/industries";

export default function Providers({
  industries,
  siteContent,
  children,
}: {
  industries: IndustryView[];
  siteContent: SiteContent;
  children: React.ReactNode;
}) {
  return (
    <IndustriesProvider industries={industries}>
      <SiteContentProvider content={siteContent}>
        <QuoteDrawerProvider>{children}</QuoteDrawerProvider>
      </SiteContentProvider>
    </IndustriesProvider>
  );
}
