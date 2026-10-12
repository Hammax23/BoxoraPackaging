"use client";

import StarRating from "@/components/ui/StarRating";
import { getRelatedProducts, type Product } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

function RelatedCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <article className="product-card flex h-full flex-col">
        <div className="relative overflow-hidden rounded-t-[24px] bg-white px-4 pt-4">
          {product.category && (
            <p className="mb-3 line-clamp-1 text-xs font-semibold uppercase tracking-wide text-lighter">
              {product.category}
            </p>
          )}

          <div className="relative mx-auto aspect-square max-w-[240px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-2 transition duration-500 group-hover:scale-105"
              sizes="240px"
            />

            {"onSale" in product && product.onSale && (
              <span className="absolute left-0 top-0 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase text-white">
                Sale!
              </span>
            )}
            {"hot" in product && product.hot && (
              <span className="absolute right-0 top-0 rounded-md bg-dark px-2.5 py-1 text-[10px] font-bold uppercase text-white">
                Hot
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-2 rounded-b-[24px] bg-white px-5 pb-5 pt-4">
          <h3 className="font-heading text-lg text-dark transition group-hover:text-primary md:text-xl">
            {product.name}
          </h3>
          <p className="line-clamp-2 flex-1 text-sm text-lighter">{product.description}</p>
          <div className="flex items-center justify-between gap-3 pt-1">
            <StarRating rating={product.rating} reviews={product.reviews} />
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary opacity-0 transition group-hover:opacity-100">
              View
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function RelatedProducts({
  currentSlug,
  related,
}: {
  currentSlug: string;
  related?: Product[];
}) {
  const items = related ?? getRelatedProducts(currentSlug, 4);

  if (items.length === 0) return null;

  return (
    <section className="overflow-hidden border-t border-border bg-background-field py-10 sm:py-12 md:py-16 lg:py-20">
      <div className="container-main space-y-6 sm:space-y-8 md:space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-2 sm:space-y-3">
            <span className="section-label text-primary">You may also like</span>
            <h2 className="font-heading text-2xl text-dark sm:text-3xl md:text-4xl">Related Products</h2>
            <p className="text-sm text-text sm:text-base">
              Explore more packaging options that pair well with your current selection.
            </p>
          </div>
          <Link href="/products" className="section-link group w-fit shrink-0">
            <span>View all products</span>
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.08}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            480: { slidesPerView: 1.35, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
          }}
          className="products-swiper related-products-swiper !overflow-visible"
        >
          {items.map((product) => (
            <SwiperSlide key={product.slug} className="!h-auto">
              <RelatedCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
