"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { categories } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export default function Categories() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main space-y-10 md:space-y-12">
        <AnimatedSection>
          <SectionTitle
            label="Categories."
            title="What are you packaging?"
            description="Personalized and specialized custom packaging wholesale service."
            linkText="See all shop"
          />
        </AnimatedSection>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {categories.map((cat, i) => (
            <AnimatedSection key={cat.name} delay={i * 0.05}>
              <Link href="#" className="group block h-full">
                <article className="flex h-full flex-col items-center rounded-2xl border border-border bg-white px-4 py-7 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-[0_12px_40px_rgba(39,87,255,0.08)] lg:px-3 lg:py-8 xl:px-4">
                  <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-full lg:h-[110px] lg:w-[110px] xl:h-[128px] xl:w-[128px]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  </div>

                  <div className="relative mt-5 min-h-[48px] w-full lg:mt-6">
                    <h3 className="font-heading text-[18px] leading-snug text-dark transition-all duration-300 group-hover:translate-y-1 group-hover:opacity-0 xl:text-[20px]">
                      {cat.name}
                    </h3>
                    <p className="absolute inset-0 flex items-center justify-center font-heading text-[18px] text-primary opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 xl:text-[20px]">
                      {cat.count} {cat.count === 1 ? "item" : "items"}
                    </p>
                  </div>
                </article>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
