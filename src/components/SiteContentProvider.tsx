"use client";

import type { SiteContent } from "@/lib/queries/content";
import { defaultFooterGroups, topBar, heroContent, featuresSection, navLeft, navRight } from "@/lib/data";
import { createContext, useContext } from "react";

const defaults: SiteContent = {
  topBar,
  hero: { badge: heroContent.badge, titleLine1: heroContent.titleLine1, titleLine2: heroContent.titleLine2, subtitle: heroContent.subtitle },
  features: featuresSection,
  nav: { left: navLeft as SiteContent["nav"]["left"], right: navRight as SiteContent["nav"]["right"] },
  footer: defaultFooterGroups,
};

const SiteContentContext = createContext<SiteContent>(defaults);

export function SiteContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
