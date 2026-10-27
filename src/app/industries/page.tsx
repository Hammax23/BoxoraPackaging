import AboutCTAButton from "@/components/AboutCTAButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getIndustries } from "@/lib/queries/industries";
import { buildPageMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Packaging by Industry",
  description:
    "Custom packaging for every industry: food and beverage, beauty, apparel, candles, coffee and more. Browse every industry Boxora serves.",
  path: "/industries",
});

export default async function IndustriesPage() {
  const industries = await getIndustries();
  return (
    <main>
      <Header />

      <section className="hero-section relative overflow-hidden">
        <div className="hero-aurora hero-aurora-1" />
        <div className="hero-aurora hero-aurora-2" />
        <div className="hero-grid" />
        <div className="container-main relative z-10 py-20 text-center md:py-24">
          <AnimatedSection>
            <span className="hero-badge mx-auto">
              <span className="hero-badge-dot" />
              Industries
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl font-heading text-[40px] leading-[1.1] text-white md:text-[58px]">
              Packaging for <span className="hero-shimmer font-body font-extrabold tracking-tight">every industry</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/70 md:text-lg">
              Browse all {industries.length} industries we make custom packaging for, and find options built for the way your products are sold and shipped.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {industries.map((item, i) => (
            <AnimatedSection key={item.slug} delay={(i % 4) * 0.06}>
              <Link
                href={item.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_16px_36px_rgba(189,249,6,0.22)]"
              >
                <div className="relative aspect-square overflow-hidden bg-background-field">
                  {/* unoptimized: admin can paste image URLs from any host */}
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
                </div>
                <div className="flex flex-1 flex-col p-4 md:p-5">
                  <h2 className="font-heading text-[17px] leading-snug text-dark">{item.name}</h2>
                  <p className="mt-1 line-clamp-2 flex-1 text-[13px] leading-relaxed text-text">{item.sub}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary">
                    Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="bg-background-field py-16">
        <div className="container-main text-center">
          <h2 className="mx-auto max-w-2xl font-heading text-[30px] leading-tight text-dark md:text-[40px]">Don&apos;t see your industry?</h2>
          <p className="mx-auto mt-3 max-w-xl text-text">We make custom packaging for all kinds of products. Tell us about yours and we&apos;ll find the right fit.</p>
          <div className="mt-7 flex justify-center">
            <AboutCTAButton label="Talk to a specialist" source="industries-index" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
