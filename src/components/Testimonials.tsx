"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { testimonials as defaultTestimonials } from "@/lib/data";
import type { TestimonialView } from "@/lib/queries/content";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Testimonials({ testimonials = defaultTestimonials }: { testimonials?: TestimonialView[] }) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [progress, setProgress] = useState(0);
  const [index, setIndex] = useState(0);
  const total = testimonials.length;

  return (
    <section className="section-padding overflow-hidden bg-white">
      <div className="container-main space-y-10">
        <AnimatedSection>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="section-label text-primary">Testimonials.</span>
              <h2 className="mt-3 font-heading text-[34px] leading-[1.15] text-dark md:text-[44px] lg:text-[52px]">
                See what our customers say
              </h2>
              <p className="mt-3 text-base text-text md:text-lg">
                Don&apos;t let what we say influence you, take it from our customers!
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Previous reviews"
                onClick={() => swiper?.slidePrev()}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-dark shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
              </button>
              <button
                type="button"
                aria-label="Next reviews"
                onClick={() => swiper?.slideNext()}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-dark shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
              </button>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Swiper
            modules={[Autoplay]}
            onSwiper={setSwiper}
            onProgress={(_, p) => setProgress(p)}
            onSlideChange={(s) => setIndex(s.activeIndex)}
            spaceBetween={24}
            slidesPerView={1}
            rewind
            autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1100: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((item) => (
              <SwiperSlide key={`${item.name}-${item.title}`} className="!h-auto">
                <figure className="group flex h-full flex-col rounded-[28px] border border-border bg-background-field/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_24px_56px_rgba(39,87,255,0.1)] md:p-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm transition group-hover:bg-primary group-hover:text-white">
                    <Quote className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <h3 className="mt-5 font-heading text-[21px] leading-snug text-dark">{item.title}</h3>
                  <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-text">{item.text}</blockquote>
                  <figcaption className="mt-6 flex items-center gap-4 border-t border-border pt-5">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-[3px] border-white shadow-md">
                      <Image src={item.image} alt="" fill className="object-cover" sizes="56px" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-bold text-dark">{item.name}</span>
                      <span className="block truncate text-sm text-lighter">{item.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>

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
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
