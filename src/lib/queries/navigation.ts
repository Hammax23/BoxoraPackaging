import { defaultFooterGroups, type FooterGroupView, footerLinks as staticFooter, navLeft as staticNavLeft, navRight as staticNavRight } from "@/lib/data";
import { prisma } from "@/lib/db";

export type NavItemView = {
  label: string;
  href: string;
  megamenu?: "industries" | "packaging-styles" | "trends";
  children?: string[];
};

export type FooterLinksView = {
  shop: { label: string; href: string }[];
  company: { label: string; href: string }[];
  support: { label: string; href: string }[];
};

const footerHrefMap: Record<string, string> = {
  "All Products": "/products",
  Categories: "/products",
  "My account": "#",
  Wishlist: "#",
  Compare: "#",
  "About Us": "/about",
  "Our Services": "#",
  "Contact Us": "/contact",
  Blog: "/blog",
  FAQ: "/faq",
  "Shipping & Delivery": "#",
  Returns: "#",
  "Privacy Policy": "#",
};

function mapStaticFooter(): FooterLinksView {
  return {
    shop: staticFooter.shop.map((label) => ({ label, href: footerHrefMap[label] ?? "#" })),
    company: staticFooter.company.map((label) => ({ label, href: footerHrefMap[label] ?? "#" })),
    support: staticFooter.support.map((label) => ({ label, href: footerHrefMap[label] ?? "#" })),
  };
}

// Older admin-saved rows still point at the home-page anchor.
const fixHref = (href: string, megamenu?: string | null, label?: string) => {
  if (href === "#packaging-styles") return "/styles";
  if (href !== "#") return href;
  if (megamenu === "trends") return "/trends";
  if (megamenu === "industries" || label?.toUpperCase() === "INDUSTRIES") return "/products";
  if (label?.toUpperCase() === "ABOUT US") return "/about";
  return href;
};

export async function getNavLeft(): Promise<NavItemView[]> {
  try {
    const rows = await prisma.navigationItem.findMany({
      where: { area: "left", isActive: true, parentId: null },
      include: { children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        label: r.label,
        href: fixHref(r.href, r.megamenu, r.label),
        megamenu: (r.megamenu as NavItemView["megamenu"]) ?? undefined,
        children: r.children.length > 0 ? r.children.map((c) => c.label) : undefined,
      }));
    }
  } catch {
    // fall through
  }
  return staticNavLeft as NavItemView[];
}

export async function getNavRight(): Promise<NavItemView[]> {
  try {
    const rows = await prisma.navigationItem.findMany({
      where: { area: "right", isActive: true, parentId: null },
      include: { children: { where: { isActive: true }, orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        label: r.label,
        href: fixHref(r.href, r.megamenu, r.label),
        megamenu: (r.megamenu as NavItemView["megamenu"]) ?? undefined,
        children: r.children.length > 0 ? r.children.map((c) => c.label) : undefined,
      }));
    }
  } catch {
    // fall through
  }
  return staticNavRight as NavItemView[];
}

export async function getFooterLinks(): Promise<FooterLinksView> {
  try {
    const groups = await prisma.footerLinkGroup.findMany({
      include: { links: { orderBy: { sortOrder: "asc" } } },
      orderBy: { sortOrder: "asc" },
    });
    if (groups.length > 0) {
      const result: FooterLinksView = { shop: [], company: [], support: [] };
      for (const g of groups) {
        const key = g.title.toLowerCase() as keyof FooterLinksView;
        if (key in result) {
          result[key] = g.links.map((l) => ({ label: l.label, href: l.href }));
        }
      }
      if (result.shop.length + result.company.length + result.support.length > 0) return result;
    }
  } catch {
    // fall through
  }
  return mapStaticFooter();
}

/** Footer link columns managed in Admin → Navigation. Falls back to the defaults if none are set up. */
export async function getFooterGroups(): Promise<FooterGroupView[]> {
  try {
    const groups = await prisma.footerLinkGroup.findMany({
      include: { links: { orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] } },
      orderBy: { sortOrder: "asc" },
    });
    const mapped = groups
      .filter((g) => g.links.length > 0)
      .slice(0, 2)
      .map((g) => ({ title: g.title, links: g.links.map((l) => ({ label: l.label, href: l.href })) }));
    if (mapped.length === 2) return mapped;
  } catch {
    // fall through
  }
  return defaultFooterGroups;
}
