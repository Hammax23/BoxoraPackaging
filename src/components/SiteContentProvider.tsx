"use client";

import type { SiteContent } from "@/lib/queries/content";
import { contentSection } from "@/lib/contentSections";
import { defaultFooterGroups, packagingStyles, packagingTrends, topBar, heroContent, featuresSection, navLeft, navRight } from "@/lib/data";
import { createContext, useContext } from "react";

const defaults: SiteContent = {
  topBar,
  hero: { badge: heroContent.badge, titleLine1: heroContent.titleLine1, titleLine2: heroContent.titleLine2, subtitle: heroContent.subtitle },
  features: featuresSection,
  nav: { left: navLeft as SiteContent["nav"]["left"], right: navRight as SiteContent["nav"]["right"] },
  footer: defaultFooterGroups,
  social: [],
  styles: packagingStyles.map((s) => ({ ...s, benefits: [], bestFor: [], materials: [] })),
  trends: packagingTrends,
  menus: contentSection("menus")!.defaults as SiteContent["menus"],
};

const SiteContentContext = createContext<SiteContent>(defaults);

export function SiteContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
