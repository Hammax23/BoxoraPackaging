import type { Product as DbProduct } from "@prisma/client";
import type { Product } from "@/lib/data";
import type { BlogPost as BlogPostView } from "@/lib/blog";

export function mapProduct(row: DbProduct): Product {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category ?? undefined,
    price: row.price ?? undefined,
    salePrice: row.salePrice ?? undefined,
    discount: row.discount ?? undefined,
    rating: row.rating,
    reviews: row.reviews,
    image: row.imageUrl,
    onSale: row.onSale || undefined,
    hot: row.hot || undefined,
    action: "Read more",
  };
}

export function formatBlogDate(date: Date | null | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function mapBlogPost(row: {
  slug: string;
  title: string;
  excerpt: string;
  authorName: string;
  publishedAt: Date | null;
  readTime: string;
  featured: boolean;
  coverImageUrl: string;
  category: { name: string };
  blocks: { content: string; sortOrder: number }[];
}): BlogPostView {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    author: row.authorName,
    date: formatBlogDate(row.publishedAt),
    readTime: row.readTime,
    featured: row.featured || undefined,
    image: row.coverImageUrl,
    category: row.category.name as BlogPostView["category"],
    content: [...row.blocks]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((b) => b.content),
  };
}
