import { industriesMegamenu } from "@/lib/data";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export type IndustryView = {
  slug: string;
  name: string;
  sub: string;
  image: string;
  href: string;
};

export function industryHref(slug: string) {
  return `/category/${slug}`;
}

export function staticIndustries(): IndustryView[] {
  return industriesMegamenu.categories.map((c) => {
    const slug = slugify(c.name);
    return { slug, name: c.name, sub: c.sub, image: c.image, href: industryHref(slug) };
  });
}

export async function getIndustries(): Promise<IndustryView[]> {
  try {
    const rows = await prisma.industry.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        slug: r.slug,
        name: r.name,
        sub: r.subtitle,
        image: r.imageUrl,
        href: industryHref(r.slug),
      }));
    }
  } catch {
    // fall through
  }
  return staticIndustries();
}
