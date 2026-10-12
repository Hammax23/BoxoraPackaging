import ProductPageClient from "./ProductPageClient";
import JsonLd from "@/components/JsonLd";
import { getFaqs, getMarqueeItems } from "@/lib/queries/content";
import { getProductBySlug, getRelatedProducts, listActiveProducts } from "@/lib/queries/products";
import { breadcrumbJsonLd, buildPageMetadata, productJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const products = await listActiveProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildPageMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, allProducts, relatedProducts, marqueeItems, faqs] = await Promise.all([
    getProductBySlug(slug),
    listActiveProducts(),
    getRelatedProducts(slug, 4),
    getMarqueeItems(),
    getFaqs(),
  ]);

  if (!product) notFound();

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(product),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        ]}
      />
      <ProductPageClient
        product={product}
        allProducts={allProducts}
        relatedProducts={relatedProducts}
        marqueeItems={marqueeItems}
        faqs={faqs}
      />
    </>
  );
}
