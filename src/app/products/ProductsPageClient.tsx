"use client";

import Footer from "@/components/Footer";
import FeatureMarquee from "@/components/FeatureMarquee";
import Header from "@/components/Header";
import type { Product } from "@/lib/data";
import { ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function RatingStars({ rating, total = 5 }: { rating: number; total?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`} strokeWidth={0} />
      ))}
    </div>
  );
}

export default function ProductsPageClient({
  products,
  marqueeItems,
}: {
  products: Product[];
  marqueeItems: string[];
}) {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <FeatureMarquee items={marqueeItems} />
      <div className="border-b border-border bg-background-field/50">
        <div className="container-main py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-text transition hover:text-secondary">Home Page</Link>
            <ChevronRight className="h-4 w-4 text-lighter" />
            <span className="font-semibold text-dark">All Products</span>
          </nav>
        </div>
      </div>
      <div className="container-main py-10 md:py-14">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-dark md:text-4xl lg:text-5xl">Our Packaging Solutions</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-text md:text-lg">
            Explore our range of custom packaging options designed to elevate your brand and protect your products.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link key={product.slug} href={`/products/${product.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-white transition hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/10">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-white p-6">
                <Image src={product.image} alt={product.name} fill className="object-contain p-4 transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading text-xl text-dark">{product.name}</h3>
                  <RatingStars rating={product.rating} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-text">{product.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
