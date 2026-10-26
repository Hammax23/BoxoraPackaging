import AboutCTAButton from "@/components/AboutCTAButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getStyles } from "@/lib/queries/pageContent";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import { ArrowRight, Check, ChevronRight, Layers, Package, Palette, Send, Target } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return (await getStyles()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const style = (await getStyles()).find((s) => s.slug === slug);
  if (!style) return {};
  return buildPageMetadata({
    title: `Custom ${style.title}`,
    description: style.description,
    path: `/styles/${style.slug}`,
    image: style.image,
  });
}

const steps = [
  { icon: Send, title: "Send your specs", text: "Share size, quantity and print needs." },
  { icon: Palette, title: "Approve the proof", text: "Review artwork and structure before printing." },
  { icon: Package, title: "We print & ship", text: "Production, quality checks and delivery." },
];

export default async function StylePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const packagingStyles = await getStyles();
  const index = packagingStyles.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const style = packagingStyles[index];
  const detail = style;
  const others = packagingStyles.filter((s) => s.slug !== slug).slice(0, 4);

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Packaging Styles", path: "/styles" },
          { name: style.title, path: `/styles/${slug}` },
        ])}
      />
      <Header />

      <div className="border-b border-border bg-white">
        <div className="container-main flex items-center justify-center py-4 text-[12px] font-semibold text-lighter">
          <Link href="/" className="transition hover:text-primary">Home</Link>
          <ChevronRight className="mx-2 h-4 w-4" strokeWidth={2.5} />
          <Link href="/styles" className="transition hover:text-primary">Packaging Styles</Link>
          <ChevronRight className="mx-2 h-4 w-4" strokeWidth={2.5} />
          <span className="text-dark">{style.title}</span>
        </div>
      </div>

      <section className="bg-white pb-16 pt-10 md:pt-14">
        <div className="container-main grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection>
            <div className="relative aspect-square overflow-hidden rounded-[20px] bg-background-field shadow-[0_30px_80px_rgba(189,249,6,0.15)]">
              <Image
                src={style.image}
                alt={style.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-dark">
                <Layers className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                Style {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <span className="section-label text-primary">Packaging style</span>
            <h1 className="mt-3 font-heading text-[38px] leading-tight text-dark md:text-[52px]">{style.title}</h1>
            <p className="mt-4 text-lg text-text">{style.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {style.specs.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-primary/20 bg-primary/[0.07] px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-dark"
                >
                  {s}
                </span>
              ))}
            </div>

            <ul className="mt-7 space-y-3">
              {detail.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] text-dark">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <AboutCTAButton
                label={`Order ${style.title}`}
                source="style-page"
                productName={style.title}
              />
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-[15px] font-bold text-dark transition hover:border-primary hover:text-primary"
              >
                Browse products <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-background-field py-16 md:py-20">
        <div className="container-main grid gap-6 md:grid-cols-2">
          <AnimatedSection>
            <div className="h-full rounded-[20px] border border-border bg-white p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background-field text-primary">
                <Target className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-heading text-2xl text-dark">Best for</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {detail.bestFor.map((b) => (
                  <span key={b} className="rounded-full bg-background-field px-4 py-2 text-sm font-semibold text-dark">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <div className="h-full rounded-[20px] border border-border bg-white p-7">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background-field text-primary">
                <Layers className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-heading text-2xl text-dark">Materials &amp; options</h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {detail.materials.map((m) => (
                  <li key={m} className="flex items-center gap-2.5 text-[15px] text-text">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="container-main">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <span className="section-label text-secondary">How to order</span>
            <h2 className="mt-3 font-heading text-[32px] leading-tight text-dark md:text-[42px]">
              Three simple steps
            </h2>
          </AnimatedSection>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 0.08}>
                <div className="h-full rounded-[20px] border border-border p-7 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-dark">
                    {i + 1}. {s.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] text-text">{s.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background-field">
        <div className="container-main">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-heading text-[30px] leading-tight text-dark md:text-[40px]">More styles</h2>
            <Link href="/styles" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={o.href}
                className="group overflow-hidden rounded-[16px] border border-border bg-white transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(189,249,6,0.12)]"
              >
                <div className="relative aspect-square bg-background-field">
                  <Image
                    src={o.image}
                    alt={o.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl text-dark transition group-hover:text-primary">{o.title}</h3>
                  <p className="mt-1 text-[13px] text-lighter">{o.specs.slice(0, 2).join(" • ")}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
