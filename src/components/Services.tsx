"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { services } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function Services() {
  return (
    <section id="services" className="section-padding overflow-hidden bg-white">
      <div className="container-main space-y-12">
        <AnimatedSection>
          <SectionTitle
            label="Services."
            title="Be part of the solution"
            description="Improve your operational efficiencies, optimize costs and brand engagements."
            linkText="See all services"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.1}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              900: { slidesPerView: 2.2 },
              1200: { slidesPerView: 3 },
            }}
            className="services-swiper !overflow-visible pb-4"
          >
            {services.map((service) => (
              <SwiperSlide key={service.title}>
                <div className="group overflow-hidden rounded-[28px] border border-border bg-white">
                  <div className="relative aspect-[16/10] overflow-hidden bg-background-field">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 90vw, 33vw"
                    />
                  </div>
                  <div className="space-y-4 p-7">
                    <h3 className="font-heading text-2xl text-dark">{service.title}</h3>
                    <p className="text-sm leading-relaxed text-text">{service.description}</p>
                    {service.bullets && (
                      <ul className="space-y-2 text-sm text-text">
                        {service.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link
                      href="#"
                      className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary transition hover:gap-3"
                    >
                      explore more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
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
