"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { testimonials as defaultTestimonials } from "@/lib/data";
import type { TestimonialView } from "@/lib/queries/content";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export type ReviewsContent = { title: string; highlight: string; rating: string; ratingLabel: string };

export default function Testimonials({
  testimonials = defaultTestimonials,
  heading,
}: {
  testimonials?: TestimonialView[];
  heading: ReviewsContent;
}) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <AnimatedSection className="text-center">
          <h2 className="font-heading text-[34px] leading-tight text-dark md:text-[44px]">
            {heading.title} <span className="rounded-lg bg-primary px-2 text-dark [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">{heading.highlight}</span>
          </h2>
        </AnimatedSection>

        <div className="mt-10 flex items-center gap-4 lg:gap-8">
          {heading.rating && (
            <div className="hidden w-44 shrink-0 text-center lg:block">
              <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-dark">{heading.rating}</p>
              <div className="mt-2 flex justify-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <p className="mt-2 text-xs text-text">{heading.ratingLabel}</p>
            </div>
          )}
          <button type="button" aria-label="Previous reviews" onClick={() => scroll(-1)} className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm transition hover:border-primary hover:text-primary sm:flex">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div ref={track} className="flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {testimonials.map((t) => (
              <article key={t.name + t.title} className="w-[300px] shrink-0 snap-start rounded-2xl border border-border bg-background-field/50 p-5">
                <div className="flex items-center gap-3">
                  <Image src={t.image} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-dark">{t.name}</p>
                    <p className="truncate text-xs text-lighter">{t.role}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 line-clamp-6 text-sm leading-relaxed text-text">{t.text}</p>
              </article>
            ))}
          </div>
          <button type="button" aria-label="Next reviews" onClick={() => scroll(1)} className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-white shadow-sm transition hover:border-primary hover:text-primary sm:flex">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
