import AboutCTAButton from "@/components/AboutCTAButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getStyles, getTrends } from "@/lib/queries/pageContent";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { ArrowRight, Check, ChevronRight, Layers, Target } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return (await getTrends()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trend = (await getTrends()).find((t) => t.slug === slug);
  if (!trend) return {};
  return buildPageMetadata({
    title: `${trend.title}: Packaging Trend`,
    description: trend.description,
    path: `/trends/${trend.slug}`,
    image: trend.image,
  });
}

export default async function TrendPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [packagingTrends, packagingStyles] = await Promise.all([getTrends(), getStyles()]);
  const index = packagingTrends.findIndex((t) => t.slug === slug);
  if (index === -1) notFound();
  const trend = packagingTrends[index];
  const suited = trend.styles
    .map((s) => packagingStyles.find((p) => p.slug === s))
    .filter((s): s is (typeof packagingStyles)[number] => Boolean(s));
  const next = packagingTrends[(index + 1) % packagingTrends.length];
  const others = packagingTrends.filter((t) => t.slug !== slug).slice(0, 3);

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Packaging Trends", path: "/trends" },
          { name: trend.title, path: `/trends/${slug}` },
        ])}
      />
      <Header />

      <div className="border-b border-border bg-white">
        <div className="container-main flex items-center justify-center py-4 text-[12px] font-semibold text-lighter">
          <Link href="/" className="transition hover:text-primary">Home</Link>
          <ChevronRight className="mx-2 h-4 w-4" strokeWidth={2.5} />
          <Link href="/trends" className="transition hover:text-primary">Packaging Trends</Link>
          <ChevronRight className="mx-2 h-4 w-4" strokeWidth={2.5} />
          <span className="text-dark">{trend.title}</span>
        </div>
      </div>

      <section className="bg-white pb-16 pt-10 md:pt-14">
        <div className="container-main grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection>
            <span className="section-label text-primary">Packaging trend {String(index + 1).padStart(2, "0")}</span>
            <h1 className="mt-3 font-heading text-[38px] leading-tight text-dark md:text-[54px]">{trend.title}</h1>
            <p className="mt-4 text-lg text-text">{trend.description}</p>
            <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-text">
              {trend.overview.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AboutCTAButton
                label="Get this look"
                source={`trend:${trend.slug}`}
                productName={trend.title}
              />
              <Link
                href="/styles"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-[15px] font-bold text-dark transition hover:border-primary hover:text-primary"
              >
                Browse styles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="relative aspect-square overflow-hidden rounded-[20px] bg-background-field shadow-[0_30px_80px_rgba(189,249,6,0.15)]">
              <Image
                src={trend.image}
                alt={trend.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-background-field py-16 md:py-20">
        <div className="container-main grid gap-6 lg:grid-cols-3">
          <AnimatedSection>
            <div className="h-full rounded-[20px] border border-border bg-white p-7">
              <h2 className="font-heading text-2xl text-dark">What defines it</h2>
              <ul className="mt-4 space-y-3">
                {trend.keyPoints.map((k) => (
                  <li key={k} className="flex items-start gap-3 text-[15px] text-dark">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <div className="h-full rounded-[20px] border border-border bg-white p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background-field text-primary">
                <Layers className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-heading text-2xl text-dark">Materials &amp; finishes</h2>
              <ul className="mt-4 space-y-2.5">
                {trend.materials.map((m) => (
                  <li key={m} className="flex items-center gap-2.5 text-[15px] text-text">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.16}>
            <div className="h-full rounded-[20px] border border-border bg-white p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background-field text-primary">
                <Target className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-heading text-2xl text-dark">Great for</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {trend.bestFor.map((b) => (
                  <span key={b} className="rounded-full bg-background-field px-4 py-2 text-sm font-semibold text-dark">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {suited.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="container-main">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
              <span className="section-label text-secondary">Make it real</span>
              <h2 className="mt-3 font-heading text-[30px] leading-tight text-dark md:text-[42px]">
                Styles that suit this trend
              </h2>
            </AnimatedSection>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {suited.map((s, i) => (
                <AnimatedSection key={s.slug} delay={i * 0.08}>
                  <Link
                    href={s.href}
                    className="group block overflow-hidden rounded-[20px] border border-border bg-white transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(189,249,6,0.13)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-background-field">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-heading text-xl text-dark transition group-hover:text-primary">{s.title}</h3>
                      <p className="mt-1 text-[13px] text-lighter">{s.specs.slice(0, 2).join(" • ")}</p>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-background-field">
        <div className="container-main">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-heading text-[28px] leading-tight text-dark md:text-[38px]">More trends</h2>
            <Link href={next.href} className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
              Next: {next.title} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={o.href}
                className="group flex gap-4 rounded-[16px] border border-border bg-white p-4 transition hover:border-primary/30 hover:shadow-[0_18px_44px_rgba(189,249,6,0.1)]"
              >
                <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-background-field">
                  <Image src={o.image} alt="" fill className="object-cover" sizes="80px" />
                </span>
                <span className="min-w-0">
                  <span className="block font-heading text-lg leading-snug text-dark transition group-hover:text-primary">
                    {o.title}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[13px] text-text">{o.description}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
