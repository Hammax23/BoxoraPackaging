"use client";

import Footer from "@/components/Footer";
import FAQs from "@/components/FAQs";
import FeatureMarquee from "@/components/FeatureMarquee";
import Header from "@/components/Header";
import QuoteForm from "@/components/QuoteForm";
import ProductDetailsTabs from "@/components/ProductDetailsTabs";
import RelatedProducts from "@/components/RelatedProducts";
import type { Product } from "@/lib/data";
import type { FaqView } from "@/lib/queries/content";
import { ChevronLeft, ChevronRight, Clock, Palette, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function RatingStars({ rating, total = 5 }: { rating: number; total?: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 sm:h-5 sm:w-5 ${i < filled ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
          strokeWidth={0}
        />
      ))}
      <span className="ml-2 text-sm text-lighter">({rating.toFixed(1)})</span>
    </div>
  );
}

export default function ProductPageClient({
  product,
  allProducts,
  relatedProducts,
  marqueeItems,
  faqs,
}: {
  product: Product;
  allProducts: Product[];
  relatedProducts: Product[];
  marqueeItems: string[];
  faqs: FaqView[];
}) {
  const currentIndex = allProducts.findIndex((item) => item.slug === product.slug);
  const prevProduct = allProducts[currentIndex - 1] ?? allProducts[allProducts.length - 1];
  const nextProduct = allProducts[currentIndex + 1] ?? allProducts[0];

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <FeatureMarquee items={marqueeItems} />

      <div className="border-b border-border bg-background-field/50">
        <div className="container-main py-3">
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="shrink-0 text-text transition hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-lighter sm:h-4 sm:w-4" />
            <Link href="/products" className="shrink-0 text-text transition hover:text-primary">
              Products
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-lighter sm:h-4 sm:w-4" />
            <span className="min-w-0 truncate font-semibold text-dark">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-main py-6 sm:py-10 md:py-14 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-14 xl:gap-20">
          <div className="min-w-0 lg:self-stretch">
            <div className="space-y-5 lg:sticky lg:top-40">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm sm:rounded-3xl sm:p-6 md:p-10">
                <div className="relative mx-auto aspect-square w-full max-w-[420px]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-2 sm:p-4"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                  />
                </div>
              </div>

              <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  { icon: Palette, title: "Free design support", text: "Print-ready artwork help" },
                  { icon: Clock, title: "Fast turnaround", text: "Quote within 1 business day" },
                  { icon: Truck, title: "Free shipping", text: "With order tracking" },
                ].map((f) => (
                  <li key={f.title} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dark text-[#bdf906]">
                      <f.icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-snug text-dark">{f.title}</p>
                      <p className="text-xs text-text">{f.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="font-heading text-[28px] leading-tight text-dark sm:text-3xl md:text-4xl lg:text-[42px]">
                  {product.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <RatingStars rating={product.rating} />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2 self-start">
                <Link
                  href={`/products/${prevProduct.slug}`}
                  aria-label="Previous product"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-dark transition hover:border-primary hover:text-primary"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Link>
                <Link
                  href={`/products/${nextProduct.slug}`}
                  aria-label="Next product"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-dark transition hover:border-primary hover:text-primary"
                >
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-text sm:text-base md:text-lg">{product.description}</p>

            <div className="mt-6 rounded-[28px] border border-border bg-white p-5 shadow-[0_12px_40px_rgba(3,90,83,0.08)] sm:mt-8 sm:p-7">
              <QuoteForm source={`product:${product.slug}`} productName={product.name} productSlug={product.slug} />
            </div>
          </div>
        </div>

        <ProductDetailsTabs product={product} />
      </div>

      <FAQs faqs={faqs} />
      <RelatedProducts currentSlug={product.slug} related={relatedProducts} />
      <Footer />
    </main>
  );
}
