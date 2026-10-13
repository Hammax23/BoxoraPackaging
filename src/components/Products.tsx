"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import StarRating from "@/components/ui/StarRating";
import { products as defaultProducts } from "@/lib/data";
import type { Product } from "@/lib/data";
import { useWishlist } from "@/lib/wishlist";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Heart,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const pad = (n: number) => String(n).padStart(2, "0");
const money = (n?: number) => `$${(n ?? 0).toFixed(2)}`;

function Price({ product, large = false }: { product: Product; large?: boolean }) {
  const size = large ? "text-[22px]" : "text-[16px]";
  if (product.salePrice) {
    return (
      <span className="flex items-baseline gap-2">
        <span className={`${size} font-bold text-primary`}>{money(product.salePrice)}</span>
        <span className="text-[13px] text-lighter line-through">{money(product.price)}</span>
      </span>
    );
  }
  return <span className={`${size} font-bold text-dark`}>{money(product.price)}</span>;
}

function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[250] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Close quick view"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#080810]/60 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} quick view`}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid max-h-[92vh] w-full max-w-[860px] overflow-y-auto rounded-[28px] bg-white shadow-[0_40px_120px_rgba(8,8,16,0.45)] md:grid-cols-2"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark shadow-md transition hover:bg-primary hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-square bg-[#f5f5f7] md:aspect-auto md:min-h-[420px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 90vw, 430px"
              />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8">
              {product.category && (
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  {product.category}
                </p>
              )}
              <h3 className="mt-2 font-heading text-[28px] leading-tight text-dark">{product.name}</h3>
              <div className="mt-3">
                <StarRating rating={product.rating} reviews={product.reviews} />
              </div>
              <div className="mt-4">
                <Price product={product} large />
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-text">{product.description}</p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/quote?product=${encodeURIComponent(product.name)}`}
                  onClick={onClose}
                  className="btn-slip inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(39,87,255,0.3)]"
                >
                  Get a quote <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </Link>
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-dark transition hover:border-primary hover:text-primary"
                >
                  Full details <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Products({ products }: { products?: Product[] }) {
  const items: Product[] = products ?? [...defaultProducts];
  const wishlist = useWishlist();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const [quick, setQuick] = useState<Product | null>(null);

  const iconBtn =
    "flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark shadow-[0_6px_18px_rgba(8,8,16,0.14)] transition hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white";

  return (
    <section className="section-padding overflow-hidden bg-white">
      <div className="container-main space-y-10">
        <AnimatedSection>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="section-label text-primary">Products.</span>
              <h2 className="mt-3 font-heading text-[34px] leading-[1.15] text-dark md:text-[44px] lg:text-[52px]">
                Bestselling custom bags
              </h2>
              <p className="mt-3 text-base text-text md:text-lg">
                See your ideas come to life with our custom packaging solutions.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-5">
              <div className="hidden sm:block">
                <Link href="/products" className="section-link group">
                  <span>See all shop</span>
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous products"
                  onClick={() => swiper?.slidePrev()}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-dark shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
                </button>
                <button
                  type="button"
                  aria-label="Next products"
                  onClick={() => swiper?.slideNext()}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-dark shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Swiper
            modules={[Autoplay]}
            onSwiper={setSwiper}
            onProgress={(_, p) => setProgress(p)}
            onSlideChange={(s) => setIndex(s.activeIndex)}
            spaceBetween={20}
            slidesPerView={1.12}
            rewind
            autoplay={{ delay: 4800, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              640: { slidesPerView: 2.1 },
              1024: { slidesPerView: 3.1 },
              1400: { slidesPerView: 4 },
            }}
            className="!overflow-visible"
          >
            {items.map((product) => {
              const saved = wishlist.has(product.slug);
              return (
                <SwiperSlide key={product.slug} className="!h-auto">
                  <article className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-border bg-white shadow-[0_6px_28px_rgba(30,16,35,0.05)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_rgba(39,87,255,0.14)]">
                    <div className="relative bg-[#f5f5f7]">
                      <Link
                        href={`/products/${product.slug}`}
                        aria-label={`View ${product.name}`}
                        className="relative block aspect-square"
                      >
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-6 transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 85vw, (max-width: 1400px) 33vw, 25vw"
                        />
                      </Link>

                      <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
                        {product.onSale && (
                          <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                            {product.discount ?? "Sale!"}
                          </span>
                        )}
                        {product.hot && (
                          <span className="rounded-full bg-dark px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                            Hot
                          </span>
                        )}
                      </div>

                      {/* Actions: always visible on touch, revealed on hover for desktop */}
                      <div className="absolute right-3 top-3 flex flex-col gap-2 transition duration-300 md:translate-x-2 md:opacity-0 md:group-focus-within:translate-x-0 md:group-focus-within:opacity-100 md:group-hover:translate-x-0 md:group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => wishlist.toggle(product.slug)}
                          aria-pressed={saved}
                          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                          title={saved ? "Saved to wishlist" : "Save to wishlist"}
                          className={iconBtn}
                        >
                          <Heart
                            className={`h-4 w-4 ${saved ? "fill-secondary text-secondary" : ""}`}
                            strokeWidth={2}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuick(product)}
                          aria-label={`Quick view ${product.name}`}
                          title="Quick view"
                          className={iconBtn}
                        >
                          <Eye className="h-4 w-4" strokeWidth={2} />
                        </button>
                        <Link
                          href={`/quote?product=${encodeURIComponent(product.name)}`}
                          aria-label={`Get a quote for ${product.name}`}
                          title="Get a quote"
                          className={iconBtn}
                        >
                          <FileText className="h-4 w-4" strokeWidth={2} />
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      {product.category && (
                        <p className="truncate text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                          {product.category}
                        </p>
                      )}
                      <h3 className="mt-1.5 font-heading text-[21px] leading-snug text-dark transition-colors group-hover:text-primary">
                        <Link href={`/products/${product.slug}`}>{product.name}</Link>
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-[14px] leading-relaxed text-text">
                        {product.description}
                      </p>
                      <div className="mt-3">
                        <StarRating rating={product.rating} reviews={product.reviews} />
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                        <Price product={product} />
                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-primary transition-all group-hover:gap-2.5"
                        >
                          View <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </Link>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className="mt-8 flex items-center gap-5">
            <p className="font-heading text-[18px] tabular-nums text-dark" aria-hidden="true">
              {pad(Math.min(index + 1, items.length))}
              <span className="text-lighter"> / {pad(items.length)}</span>
            </p>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-primary/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-300"
                style={{ width: `${Math.max(8, progress * 100)}%` }}
              />
            </div>
            <div className="sm:hidden">
              <Link href="/products" className="section-link group">
                <span>All products</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </section>
  );
}
