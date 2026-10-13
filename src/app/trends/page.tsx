import AboutCTAButton from "@/components/AboutCTAButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { packagingTrends } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { ArrowRight, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Packaging Trends",
  description:
    "Minimalist, eco-luxury, subscription, bold print, plastic-free and smart packaging. Explore the packaging trends shaping modern brands.",
  path: "/trends",
});

export default function TrendsPage() {
  const [lead, ...rest] = packagingTrends;

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
              Packaging trends
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl font-heading text-[40px] leading-[1.1] text-white md:text-[58px]">
              What&apos;s shaping{" "}
              <span className="hero-shimmer font-body font-extrabold tracking-tight">modern packaging</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/70 md:text-lg">
              Ideas, materials and formats that leading brands are using to stand out, and how to bring them to
              your own products.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          {/* Lead trend */}
          <AnimatedSection>
            <Link
              href={lead.href}
              className="group grid overflow-hidden rounded-[36px] border border-border bg-white transition duration-300 hover:border-primary/30 hover:shadow-[0_28px_70px_rgba(39,87,255,0.13)] lg:grid-cols-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-background-field lg:aspect-auto lg:min-h-[380px]">
                <Image
                  src={lead.image}
                  alt={lead.title}
                  fill
                  priority
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                  <TrendingUp className="h-3.5 w-3.5" /> Top trend
                </span>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                <h2 className="font-heading text-[32px] leading-tight text-dark transition group-hover:text-primary md:text-[42px]">
                  {lead.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-text md:text-lg">{lead.description}</p>
                <span className="mt-7 inline-flex w-fit items-center gap-2 text-[14px] font-bold text-primary">
                  Explore this trend <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </AnimatedSection>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((t, i) => (
              <AnimatedSection key={t.slug} delay={(i % 3) * 0.07}>
                <Link
                  href={t.href}
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-white transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(39,87,255,0.13)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-background-field">
                    <Image
                      src={t.image}
                      alt={t.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-dark">
                      Trend {String(i + 2).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-[22px] leading-snug text-dark transition group-hover:text-primary">
                      {t.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-text">{t.description}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-primary">
                      Read more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background-field py-16">
        <div className="container-main text-center">
          <h2 className="mx-auto max-w-2xl font-heading text-[30px] leading-tight text-dark md:text-[40px]">
            Want a trend on your own packaging?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-text">
            Our specialists will help you pick the right style, material and finish for your product.
          </p>
          <div className="mt-7 flex justify-center">
            <AboutCTAButton label="Get expert guidance" source="trends-index" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
