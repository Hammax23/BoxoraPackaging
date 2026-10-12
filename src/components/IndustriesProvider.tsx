"use client";

import type { IndustryView } from "@/lib/queries/industries";
import { createContext, useContext } from "react";

const IndustriesContext = createContext<IndustryView[]>([]);

export function IndustriesProvider({
  industries,
  children,
}: {
  industries: IndustryView[];
  children: React.ReactNode;
}) {
  return <IndustriesContext.Provider value={industries}>{children}</IndustriesContext.Provider>;
}

export function useIndustries() {
  return useContext(IndustriesContext);
}
