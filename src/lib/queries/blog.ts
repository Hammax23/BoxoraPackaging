import {
  blogCategories as staticCategories,
  blogPosts as staticPosts,
  getBlogPost as staticGetPost,
  getFeaturedPost as staticGetFeatured,
  getRelatedPosts as staticGetRelated,
  type BlogPost,
} from "@/lib/blog";
import { prisma } from "@/lib/db";
import { mapBlogPost } from "./mappers";

const postInclude = {
  category: true,
  blocks: { orderBy: { sortOrder: "asc" as const } },
};

export async function listPublishedPosts(): Promise<BlogPost[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: postInclude,
      orderBy: { publishedAt: "desc" },
    });
    if (rows.length > 0) return rows.map(mapBlogPost);
  } catch {
    // fall through
  }
  return [...staticPosts];
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const rows = await prisma.blogCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) return ["All", ...rows.map((c) => c.name)];
  } catch {
    // fall through
  }
  return [...staticCategories];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const row = await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: postInclude,
    });
    if (row) return mapBlogPost(row);
  } catch {
    // fall through
  }
  return staticGetPost(slug) ?? null;
}

export async function getFeaturedPost(): Promise<BlogPost | null> {
  try {
    const row = await prisma.blogPost.findFirst({
      where: { status: "PUBLISHED", featured: true },
      include: postInclude,
      orderBy: { publishedAt: "desc" },
    });
    if (row) return mapBlogPost(row);
    const first = await prisma.blogPost.findFirst({
      where: { status: "PUBLISHED" },
      include: postInclude,
      orderBy: { publishedAt: "desc" },
    });
    if (first) return mapBlogPost(first);
  } catch {
    // fall through
  }
  return staticGetFeatured();
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  try {
    const current = await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { category: true },
    });
    if (current) {
      const rows = await prisma.blogPost.findMany({
        where: { status: "PUBLISHED", slug: { not: slug } },
        include: postInclude,
        orderBy: { publishedAt: "desc" },
      });
      const same = rows.filter((p) => p.categoryId === current.categoryId);
      const diff = rows.filter((p) => p.categoryId !== current.categoryId);
      return [...same, ...diff].slice(0, limit).map(mapBlogPost);
    }
  } catch {
    // fall through
  }
  return staticGetRelated(slug, limit);
}

export async function listBlogSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    if (rows.length > 0) return rows.map((r) => r.slug);
  } catch {
    // fall through
  }
  return staticPosts.map((p) => p.slug);
}
