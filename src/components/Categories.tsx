"use client";

import { useIndustries } from "@/components/IndustriesProvider";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import type { Product } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function inCategory(productCategory: string | undefined, name: string) {
  if (!productCategory) return false;
  return productCategory
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .includes(name.toLowerCase());
}

export default function Categories({ products }: { products: Product[] }) {
  const industries = useIndustries();

  return (
    <section className="section-padding bg-white">
      <div className="container-main space-y-10 md:space-y-12">
        <AnimatedSection>
          <SectionTitle
            label="Categories."
            title="What are you packaging?"
            description="Personalized and specialized custom packaging wholesale service."
            linkText="See all shop"
            linkHref="/products"
          />
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {industries.map((cat, i) => {
            const count = products.filter((p) => inCategory(p.category, cat.name)).length;
            return (
              <AnimatedSection key={cat.slug} delay={(i % 5) * 0.05}>
                <Link href={cat.href} className="group block h-full" aria-label={`${cat.name}, ${count} ${count === 1 ? "product" : "products"}`}>
                  <article className="relative flex h-full flex-col items-center overflow-hidden rounded-[24px] border border-border bg-white px-3 py-7 text-center transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary/30 group-hover:shadow-[0_22px_50px_rgba(39,87,255,0.12)] sm:px-4 lg:py-8">
                    <span className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-secondary transition-transform duration-500 group-hover:scale-x-100" />

                    <div className="rounded-full bg-gradient-to-br from-primary/0 to-secondary/0 p-1 transition-all duration-300 group-hover:from-primary group-hover:to-secondary">
                      <div className="relative h-[104px] w-[104px] overflow-hidden rounded-full border-4 border-white bg-background-field sm:h-[118px] sm:w-[118px] xl:h-[128px] xl:w-[128px]">
                        <Image
                          src={cat.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 30vw, 140px"
                        />
                      </div>
                    </div>

                    <h3 className="mt-5 font-heading text-[18px] leading-snug text-dark transition-colors group-hover:text-primary xl:text-[20px]">
                      {cat.name}
                    </h3>

                    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-background-field px-3 py-1 text-[12px] font-semibold text-text transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      {count > 0 ? `${count} ${count === 1 ? "product" : "products"}` : "Request a quote"}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </p>
                  </article>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
