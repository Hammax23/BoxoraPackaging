import AboutCTAButton from "@/components/AboutCTAButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { packagingStyles } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { ArrowRight, Layers } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Packaging Styles",
  description:
    "Stand-up pouches, flat bottom bags, mailer boxes, rigid boxes and more. Explore every custom packaging style Boxora makes.",
  path: "/styles",
});

export default function StylesPage() {
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
              Packaging styles
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl font-heading text-[40px] leading-[1.1] text-white md:text-[58px]">
              Find the right{" "}
              <span className="hero-shimmer font-body font-extrabold tracking-tight">format</span> for your product
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/70 md:text-lg">
              From flexible pouches to rigid boxes: {packagingStyles.length} custom styles, all printed in your
              brand colors.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packagingStyles.map((style, i) => (
            <AnimatedSection key={style.slug} delay={(i % 3) * 0.07}>
              <Link href={style.href} className="group block h-full">
                <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-white transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(39,87,255,0.13)]">
                  <div className="relative aspect-square overflow-hidden bg-background-field">
                    <Image
                      src={style.image}
                      alt={style.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-dark">
                      <Layers className="h-3 w-3 text-primary" strokeWidth={2.5} />
                      Style {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-heading text-[22px] leading-snug text-dark transition group-hover:text-primary">
                      {style.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-text">{style.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {style.specs.map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-dark"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-primary">
                      View style <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="bg-background-field py-16">
        <div className="container-main text-center">
          <h2 className="mx-auto max-w-2xl font-heading text-[30px] leading-tight text-dark md:text-[40px]">
            Not sure which style fits?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-text">
            Tell us about your product and our specialists will recommend the right structure and material.
          </p>
          <div className="mt-7 flex justify-center">
            <AboutCTAButton label="Get expert advice" source="styles-index" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
