"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { packagingStyles } from "@/lib/data";
import { ArrowRight, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function PackagingStyles() {
  return (
    <section id="packaging-styles" className="section-padding overflow-hidden bg-background-field">
      <div className="container-main space-y-12">
        <AnimatedSection>
          <SectionTitle
            label="Packaging Styles."
            title="Engineered formats for every product line"
            description="From flexible pouches to rigid mailers — scalable packaging architectures built for enterprise production, compliance, and brand consistency."
            linkText="Explore all styles"
            linkHref="#packaging-styles"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.12}>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1.15}
            navigation
            autoplay={{ delay: 4800, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1.6 },
              900: { slidesPerView: 2.4 },
              1200: { slidesPerView: 3.2 },
              1400: { slidesPerView: 4 },
            }}
            className="packaging-styles-swiper !overflow-visible pb-2"
          >
            {packagingStyles.map((style, index) => (
              <SwiperSlide key={style.title}>
                <Link href={style.href} className="group block h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-border/80 bg-white shadow-[0_4px_24px_rgba(30,16,35,0.04)] transition-all duration-300 hover:border-primary/25 hover:shadow-[0_20px_50px_rgba(39,87,255,0.1)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#1e1023]">
                      <Image
                        src={style.image}
                        alt={style.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 85vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e1023]/80 via-[#1e1023]/20 to-transparent" />

                      <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1e1023] backdrop-blur-sm">
                        <Layers className="h-3 w-3 text-primary" strokeWidth={2.5} />
                        Style {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-heading text-[22px] leading-snug text-dark transition-colors group-hover:text-primary">
                        {style.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-text">
                        {style.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {style.specs.map((spec) => (
                          <span
                            key={spec}
                            className="rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#1e1023]"
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
            ))}
          </Swiper>
        </AnimatedSection>
      </div>
    </section>
  );
}
