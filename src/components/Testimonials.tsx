"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { testimonials as defaultTestimonials } from "@/lib/data";
import type { TestimonialView } from "@/lib/queries/content";
import { Quote } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css/pagination";

export default function Testimonials({ testimonials = defaultTestimonials }: { testimonials?: TestimonialView[] }) {
  return (
    <section className="section-padding overflow-hidden bg-white">
      <div className="container-main space-y-12">
        <AnimatedSection>
          <SectionTitle
            label="Testimonials."
            title="See what our customers say"
            description="Don't let what we say influence you, take it from our customers!"
            linkText="see all reviews"
            align="center"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1100: { slidesPerView: 3 },
            }}
            className="testimonials-swiper pb-12"
          >
            {testimonials.map((item) => (
              <SwiperSlide key={`${item.name}-${item.title}`}>
                <div className="flex h-full flex-col rounded-3xl border border-border bg-background-field p-8">
                  <Quote className="h-8 w-8 text-primary/40" />
                  <h3 className="mt-4 font-heading text-xl text-dark">{item.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-text">{item.text}</p>
                  <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-dark">{item.name}</p>
                      <p className="text-sm text-lighter">{item.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </AnimatedSection>
      </div>
    </section>
  );
}
