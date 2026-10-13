import type { MetadataRoute } from "next";
import { listBlogSlugs } from "@/lib/queries/blog";
import { listProductSlugs } from "@/lib/queries/products";
import { getIndustries } from "@/lib/queries/industries";
import { packagingStyles, packagingTrends } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, blogSlugs, industries] = await Promise.all([
    listProductSlugs(),
    listBlogSlugs(),
    getIndustries(),
  ]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/products"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/quote"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/styles"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/trends"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/team"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  const styleRoutes = packagingStyles.map((s) => ({
    url: absoluteUrl(s.href),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const trendRoutes = packagingTrends.map((t) => ({
    url: absoluteUrl(t.href),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const productRoutes = productSlugs.map((slug) => ({
    url: absoluteUrl(`/products/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogRoutes = blogSlugs.map((slug) => ({
    url: absoluteUrl(`/blog/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryRoutes = industries.map((c) => ({
    url: absoluteUrl(c.href),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...styleRoutes, ...trendRoutes, ...productRoutes, ...blogRoutes, ...categoryRoutes];
}
