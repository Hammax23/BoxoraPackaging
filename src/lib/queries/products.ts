import { products as staticProducts, getProductBySlug as staticGetBySlug, getRelatedProducts as staticGetRelated } from "@/lib/data";
import { prisma } from "@/lib/db";
import { mapProduct } from "./mappers";
import type { Product } from "@/lib/data";

export async function listActiveProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });
    if (rows.length > 0) return rows.map(mapProduct);
  } catch {
    // fall through to static data
  }
  return [...staticProducts];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const row = await prisma.product.findFirst({
      where: { slug, isActive: true },
    });
    if (row) return mapProduct(row);
  } catch {
    // fall through
  }
  return staticGetBySlug(slug) ?? null;
}

export async function getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
  try {
    const current = await prisma.product.findFirst({ where: { slug, isActive: true } });
    if (current) {
      const rows = await prisma.product.findMany({
        where: { isActive: true, slug: { not: slug } },
        orderBy: { updatedAt: "desc" },
        take: limit * 2,
      });
      const sameCategory = rows.filter(
        (p) => p.category && current.category && p.category === current.category
      );
      const different = rows.filter((p) => !sameCategory.includes(p));
      return [...sameCategory, ...different].slice(0, limit).map(mapProduct);
    }
  } catch {
    // fall through
  }
  return staticGetRelated(slug, limit);
}

export async function listProductSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    if (rows.length > 0) return rows.map((r) => r.slug);
  } catch {
    // fall through
  }
  return staticProducts.map((p) => p.slug);
}
