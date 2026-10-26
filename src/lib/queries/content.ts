import { cache } from "react";
import { featuresSection as staticFeatures, heroContent as staticHero, topBar as staticTopBar, faqs as staticFaqs, marqueeItems as staticMarquee, testimonials as staticTestimonials } from "@/lib/data";
import { prisma } from "@/lib/db";
import type { FooterGroupView } from "@/lib/data";
import { getContent, getStyles, getTrends, type StyleView } from "@/lib/queries/pageContent";
import type { PackagingTrend } from "@/lib/data";
import { getFooterGroups, getNavLeft, getNavRight, type NavItemView } from "@/lib/queries/navigation";

export type FaqView = { question: string; answer: string };
export type TestimonialView = {
  title: string;
  text: string;
  name: string;
  role: string;
  image: string;
};

export async function getMarqueeItems(): Promise<string[]> {
  try {
    const rows = await prisma.marqueeItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) return rows.map((r) => r.text);
  } catch {
    // fall through
  }
  return [...staticMarquee];
}

export async function getFaqs(): Promise<FaqView[]> {
  try {
    const rows = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) return rows.map((r) => ({ question: r.question, answer: r.answer }));
  } catch {
    // fall through
  }
  return staticFaqs.map((f) => ({ question: f.question, answer: f.answer }));
}

export async function getTestimonials(): Promise<TestimonialView[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => {
        const [name, role] = r.name.includes("|") ? r.name.split("|", 2) : [r.name, "Customer"];
        return {
          title: r.title,
          // Older entries were written for the template's former brand name.
          text: r.text.replace(/bocpak/gi, "Boxora"),
          name: name.trim(),
          role: (role ?? "Customer").trim(),
          image: r.imageUrl ?? "/images/placeholder-avatar.png",
        };
      });
    }
  } catch {
    // fall through
  }
  return staticTestimonials.map((t) => ({
    title: t.title,
    text: t.text,
    name: t.name,
    role: t.role,
    image: t.image,
  }));
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    if (row?.value !== undefined) return row.value as T;
  } catch {
    // fall through
  }
  return fallback;
}

type Banner = { title: string; description: string; image: string; href: string };
export type MenusContent = {
  industriesBanners: Banner[];
  stylesBanners: Banner[];
  trendsTitle: string;
  trendsViewAllLabel: string;
  trendsCta: { title: string; description: string; phoneLabel: string; phone: string; buttonLabel: string; buttonHref: string };
};

export type SiteContent = {
  topBar: typeof staticTopBar;
  hero: Pick<typeof staticHero, "badge" | "titleLine1" | "titleLine2" | "subtitle">;
  features: typeof staticFeatures;
  nav: { left: NavItemView[]; right: NavItemView[] };
  footer: FooterGroupView[];
  social: { label: string; href: string }[];
  styles: StyleView[];
  trends: PackagingTrend[];
  menus: MenusContent;
};

/** Editable site copy (Admin → Site settings), merged over the built-in defaults so a missing field never blanks the site. */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const [topBar, hero, features, left, right, footer, social, styles, trends, menus] = await Promise.all([
    getSiteSetting<Partial<typeof staticTopBar>>("topBar", {}),
    getSiteSetting<Partial<SiteContent["hero"]>>("heroContent", {}),
    getSiteSetting<Partial<typeof staticFeatures>>("featuresSection", {}),
    getNavLeft(),
    getNavRight(),
    getFooterGroups(),
    getSiteSetting<{ label: string; href: string }[]>("content:social", []),
    getStyles(),
    getTrends(),
    getContent<MenusContent>("menus"),
  ]);
  const merge = <T extends object>(base: T, over: Partial<T>): T => {
    const out = { ...base };
    for (const k of Object.keys(base) as (keyof T)[]) {
      const v = over?.[k];
      if (typeof v === "string" && v.trim()) out[k] = v as T[keyof T];
    }
    return out;
  };
  return {
    topBar: merge(staticTopBar, topBar),
    hero: merge(
      { badge: staticHero.badge, titleLine1: staticHero.titleLine1, titleLine2: staticHero.titleLine2, subtitle: staticHero.subtitle },
      hero,
    ),
    features: merge(staticFeatures, features),
    nav: { left, right },
    footer,
    styles,
    trends,
    menus,
    social: Array.isArray(social) ? social.filter((x) => x?.href && /^https?:\/\//i.test(x.href)) : [],
  };
});
