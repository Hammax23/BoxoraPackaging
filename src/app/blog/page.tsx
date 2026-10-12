import BlogPageClient from "./BlogPageClient";
import { getBlogCategories, getFeaturedPost, listPublishedPosts } from "@/lib/queries/blog";
import { getMarqueeItems } from "@/lib/queries/content";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Packaging Blog",
  description:
    "Practical packaging guides on materials, design, sustainability, and production for growing brands.",
  path: "/blog",
});

export default async function BlogPage() {
  const [posts, categories, featured, marqueeItems] = await Promise.all([
    listPublishedPosts(),
    getBlogCategories(),
    getFeaturedPost(),
    getMarqueeItems(),
  ]);

  if (!featured) {
    return null;
  }

  return <BlogPageClient posts={posts} categories={categories} featured={featured} marqueeItems={marqueeItems} />;
}
