import ProductsPageClient from "./ProductsPageClient";
import { getMarqueeItems } from "@/lib/queries/content";
import { listActiveProducts } from "@/lib/queries/products";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "All Products",
  description: "Browse custom packaging solutions including pouches, mailer boxes, rigid setup boxes, and more.",
  path: "/products",
});

export default async function ProductsPage() {
  const [products, marqueeItems] = await Promise.all([listActiveProducts(), getMarqueeItems()]);
  return <ProductsPageClient products={products} marqueeItems={marqueeItems} />;
}
