import { footerLinks as staticFooter, navLeft as staticNavLeft, navRight as staticNavRight } from "@/lib/data";
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
  "About Us": "#",
  "Our Services": "#",
  "Contact Us": "#contact",
  Blog: "/blog",
  FAQ: "#faq",
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
        href: r.href,
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
        href: r.href,
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
