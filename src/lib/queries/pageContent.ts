import { cache } from "react";
import { contentSection } from "@/lib/contentSections";
import type { PackagingTrend } from "@/lib/data";
import { prisma } from "@/lib/db";

export type StyleView = {
  title: string;
  slug: string;
  description: string;
  image: string;
  specs: string[];
  href: string;
  benefits: string[];
  bestFor: string[];
  materials: string[];
};

/** Admin-edited section from SiteSetting `content:<key>`, falling back to the built-in default. */
export const getContent = cache(async <T,>(key: string): Promise<T> => {
  const def = contentSection(key)?.defaults as T;
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: `content:${key}` } });
    const v = row?.value;
    if (Array.isArray(def) ? Array.isArray(v) && v.length > 0 : v && typeof v === "object" && !Array.isArray(v)) {
      return v as T;
    }
  } catch {
    // fall through to defaults
  }
  return def;
});

export const getStyles = () => getContent<StyleView[]>("styles");
export const getTrends = () => getContent<PackagingTrend[]>("trends");
