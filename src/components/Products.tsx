"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import StarRating from "@/components/ui/StarRating";
import { products as defaultProducts } from "@/lib/data";
import type { Product } from "@/lib/data";
import { Eye, Heart, Repeat } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

export default function Products({ products }: { products?: Product[] }) {
  const items = products ?? [...defaultProducts];
  return (
    <section className="section-padding overflow-hidden bg-background-field !pt-10 md:!pt-14">
      <div className="container-main space-y-10">
        <AnimatedSection>
          <SectionTitle
            label="Products."
            title="Bestselling custom bags"
            description="See your ideas come to life with our custom packaging solutions."
            linkText="See all shop"
            linkHref="/products"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.12}
            navigation
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1400: { slidesPerView: 4 },
            }}
            className="products-swiper !overflow-visible"
          >
            {items.map((product) => (
              <SwiperSlide key={product.slug}>
                <Link href={`/products/${product.slug}`} className="block">
                  <article className="product-card group">
                    <div className="relative overflow-hidden rounded-t-[24px] bg-white px-4 pt-4">
                      {product.category && (
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-lighter">
                          {product.category}
                        </p>
                      )}

                      <div className="relative mx-auto aspect-square max-w-[260px]">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain p-2 transition duration-500 group-hover:scale-105"
                          sizes="260px"
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

                        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center gap-2 opacity-0 transition group-hover:opacity-100">
                          {[
                            { Icon: Heart, label: "Wishlist" },
                            { Icon: Eye, label: "Quick view" },
                            { Icon: Repeat, label: "Compare" },
                          ].map(({ Icon, label }) => (
                            <span
                              key={label}
                              aria-hidden
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark shadow-md transition group-hover:bg-primary group-hover:text-white"
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 rounded-b-[24px] bg-white px-5 pb-5 pt-4">
                      <h3 className="font-heading text-xl text-dark transition group-hover:text-primary">
                        {product.name}
                      </h3>
                      <p className="line-clamp-2 text-sm text-lighter">
                        {product.description}
                      </p>
                      <StarRating rating={product.rating} reviews={product.reviews} />
                    </div>
                  </article>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </AnimatedSection>
      </div>
    </section>
  );
}
