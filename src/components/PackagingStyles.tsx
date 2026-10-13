"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { packagingStyles } from "@/lib/data";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Soft brand-colored backdrops. Product shots sit on light grey, so multiplying them over
// these tints gives every card its own colour while keeping the set cohesive.
const tints = [
  "linear-gradient(150deg,#dbe5ff,#b9ccff)",
  "linear-gradient(150deg,#ffdff4,#ffc2e8)",
  "linear-gradient(150deg,#e8dcff,#cfbaff)",
  "linear-gradient(150deg,#fff0cc,#ffdc94)",
  "linear-gradient(150deg,#d6f6e8,#a9ead0)",
];

const pad = (n: number) => String(n).padStart(2, "0");

export default function PackagingStyles() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const total = packagingStyles.length;

  return (
    <section id="packaging-styles" className="section-padding overflow-hidden bg-background-field">
      <div className="container-main space-y-10">
        <AnimatedSection>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="section-label text-primary">Packaging Styles.</span>
              <h2 className="mt-3 font-heading text-[34px] leading-[1.15] text-dark md:text-[44px] lg:text-[52px]">
                Engineered formats for every product line
              </h2>
              <p className="mt-3 max-w-2xl text-base text-text md:text-lg">
                From flexible pouches to rigid mailers — scalable packaging architectures built for production,
                compliance, and brand consistency.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-5">
              <div className="hidden sm:block">
                <Link href="/styles" className="section-link group">
                  <span>Explore all styles</span>
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous style"
                  onClick={() => swiper?.slidePrev()}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-dark shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
                </button>
                <button
                  type="button"
                  aria-label="Next style"
                  onClick={() => swiper?.slideNext()}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-dark shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.12}>
          <Swiper
            modules={[Autoplay]}
            onSwiper={setSwiper}
            onProgress={(_, p) => setProgress(p)}
            onSlideChange={(s) => setIndex(s.activeIndex)}
            spaceBetween={20}
            slidesPerView={1.15}
            rewind
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              640: { slidesPerView: 1.7 },
              900: { slidesPerView: 2.5 },
              1200: { slidesPerView: 3.3 },
              1400: { slidesPerView: 4 },
            }}
            className="!overflow-visible pb-2"
          >
            {packagingStyles.map((style, i) => {
              const isPhoto = !style.image.includes("banner");
              return (
                <SwiperSlide key={style.title} className="!h-auto">
                  <Link href={style.href} className="group block h-full">
                    <article className="flex h-full flex-col overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_6px_28px_rgba(30,16,35,0.05)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary/25 group-hover:shadow-[0_26px_60px_rgba(39,87,255,0.14)]">
                      <div
                        className="relative aspect-[4/3] overflow-hidden"
                        style={{ background: tints[i % tints.length] }}
                      >
                        <Image
                          src={style.image}
                          alt={style.title}
                          fill
                          className={`object-cover transition duration-700 group-hover:scale-105 ${
                            isPhoto ? "mix-blend-multiply" : ""
                          }`}
                          sizes="(max-width: 640px) 85vw, (max-width: 1200px) 40vw, 25vw"
                        />
                        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-dark shadow-sm">
                          Style {pad(i + 1)}
                        </span>
                        <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-primary opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-heading text-[23px] leading-snug text-dark transition-colors group-hover:text-primary">
                          {style.title}
                        </h3>
                        <p className="mt-2.5 line-clamp-3 flex-1 text-[14.5px] leading-relaxed text-text">
                          {style.description}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {style.specs.slice(0, 3).map((spec) => (
                            <span
                              key={spec}
                              className="rounded-full bg-background-field px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-dark"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        <span className="mt-6 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-primary transition-all group-hover:gap-3">
                          View specifications
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                      </div>
                    </article>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Counter + progress */}
          <div className="mt-8 flex items-center gap-5">
            <p className="font-heading text-[18px] tabular-nums text-dark" aria-hidden="true">
              {pad(Math.min(index + 1, total))}
              <span className="text-lighter"> / {pad(total)}</span>
            </p>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-primary/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-300"
                style={{ width: `${Math.max(8, progress * 100)}%` }}
              />
            </div>
            <div className="sm:hidden">
              <Link href="/styles" className="section-link group">
                <span>All styles</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
