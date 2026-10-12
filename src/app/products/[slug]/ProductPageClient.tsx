"use client";

import Footer from "@/components/Footer";
import FAQs from "@/components/FAQs";
import FeatureMarquee from "@/components/FeatureMarquee";
import Header from "@/components/Header";
import ProductDetailsTabs from "@/components/ProductDetailsTabs";
import RelatedProducts from "@/components/RelatedProducts";
import type { Product } from "@/lib/data";
import type { FaqView } from "@/lib/queries/content";
import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  MessageSquare,
  Palette,
  Phone,
  Ruler,
  Sliders,
  Sparkles,
  Star,
  User,
  Mail,
  ArrowUpDown,
  ArrowLeftRight,
  ArrowDownUp,
  Layers,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const materials = ["Corrugated", "Kraft", "Cardboard", "Rigid Board", "SBS"];
const colors = ["White", "Brown Kraft", "Black", "Custom Print"];
const finishes = ["Matte Laminate", "Gloss Laminate", "Soft-Touch", "Spot UV", "Foil Stamping"];

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    productType: product.name as string,
    length: "",
    width: "",
    height: "",
    quantity: "",
    material: "",
    color: "",
    finish: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const inputClass =
    "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

  const selectClass =
    "w-full min-h-[48px] appearance-none rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 cursor-pointer sm:text-sm";

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
          <div className="min-w-0">
            <div className="lg:sticky lg:top-24">
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

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5 rounded-2xl border border-border bg-background-field/30 p-4 sm:mt-8 sm:p-5 md:p-6 lg:border-0 lg:bg-transparent lg:p-0"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`${inputClass} pl-11`}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`${inputClass} pl-11`}
                  />
                </div>
                <div className="relative">
                  <select
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                    className="w-full min-h-[48px] appearance-none rounded-xl border-0 bg-primary/10 px-4 py-3 text-[16px] font-semibold text-dark outline-none transition focus:ring-2 focus:ring-primary/30 cursor-pointer sm:text-sm"
                  >
                    {allProducts.map((p) => (
                      <option key={p.slug} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-dark pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-dark">
                  <Grid3X3 className="h-4 w-4 text-primary" />
                  <span>Size (in inches)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {(
                    [
                      ["Length", "length", ArrowLeftRight],
                      ["Width", "width", ArrowUpDown],
                      ["Height", "height", ArrowDownUp],
                      ["Qty", "quantity", Layers],
                    ] as const
                  ).map(([label, key, Icon]) => (
                    <div key={key}>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-lighter md:sr-only">
                        {label}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 text-lighter md:block" />
                        <input
                          type="number"
                          inputMode="decimal"
                          placeholder={label}
                          value={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          className={`${inputClass} md:pl-9 md:text-center`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-dark">
                  <Sliders className="h-4 w-4 text-primary" />
                  <span>Selection</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 text-lighter sm:block" />
                      <select
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className={`${selectClass} sm:pl-9`}
                      >
                        <option value="">Material</option>
                        {materials.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="relative">
                      <Palette className="absolute left-3 top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 text-lighter sm:block" />
                      <select
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className={`${selectClass} sm:pl-9`}
                      >
                        <option value="">Color</option>
                        {colors.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <div className="relative">
                      <Sparkles className="absolute left-3 top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 text-lighter sm:block" />
                      <select
                        value={formData.finish}
                        onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                        className={`${selectClass} sm:pl-9`}
                      >
                        <option value="">Finish</option>
                        {finishes.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-lighter" />
                <textarea
                  placeholder="Additional Message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={`${inputClass} resize-none pl-11`}
                />
              </div>

              <button
                type="submit"
                className="btn-slip w-full min-h-[52px] rounded-xl bg-primary py-4 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_4px_16px_rgba(39,87,255,0.28)] transition hover:bg-primary/90 hover:shadow-[0_8px_28px_rgba(39,87,255,0.38)]"
              >
                Get Instant Quote
              </button>
            </form>
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
