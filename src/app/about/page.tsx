import AboutCTAButton from "@/components/AboutCTAButton";
import FeatureMarquee from "@/components/FeatureMarquee";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { img, images } from "@/lib/images";
import { getMarqueeItems } from "@/lib/queries/content";
import { getContent } from "@/lib/queries/pageContent";
import { buildPageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  Check,
  Gem,
  Handshake,
  Leaf,
  Palette,
  Rocket,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "About Boxora Packaging",
  description:
    "Meet Boxora: a custom packaging partner for modern brands. Eco-friendly materials, vivid printing, short runs and rush orders, built around your brand.",
  path: "/about",
});

const icons: Record<string, LucideIcon> = { Gem, Leaf, Palette, Rocket, Handshake, ShieldCheck };

export default async function AboutPage() {
  const [marqueeItems, stats, rawValues, steps, benefits] = await Promise.all([
    getMarqueeItems(),
    getContent<{ value: string; label: string }[]>("aboutStats"),
    getContent<{ icon: string; title: string; text: string }[]>("aboutValues"),
    getContent<{ n: string; title: string; text: string }[]>("aboutSteps"),
    getContent<{ text: string }[]>("aboutBenefits"),
  ]);
  const values = rawValues.map((v) => ({ ...v, icon: icons[v.icon] ?? Gem }));

  return (
    <main>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background-field">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="container-main relative z-10 py-12 md:py-20 lg:py-24">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-[32px] border border-border bg-white px-6 py-8 shadow-[0_24px_70px_rgba(3,90,83,0.1)] sm:px-10 sm:py-12 lg:px-16 lg:py-16">
              <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                <div>
                  <span className="section-label text-primary">About Boxora</span>
                  <h1 className="mt-6 max-w-xl font-heading text-[42px] leading-[0.98] text-dark sm:text-[58px] lg:text-[72px]">
                    Packaging with a point of view.
                  </h1>
                  <p className="mt-6 max-w-lg text-base leading-relaxed text-text sm:text-lg">
                    We make custom packaging that protects what is inside and makes the moment of opening
                    feel unmistakably yours.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      href="/quote"
                      className="btn-slip group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-dark shadow-[0_10px_30px_rgba(189,249,6,0.25)] transition hover:bg-secondary"
                    >
                      Start your project
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
                    </Link>
                    <Link
                      href="/team"
                      className="group inline-flex items-center gap-2 rounded-full border border-dark/20 px-7 py-3.5 text-sm font-bold text-dark transition hover:border-primary hover:text-primary"
                    >
                      Meet the team
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  <div className="grid grid-cols-[0.78fr_1.22fr] items-end gap-3 sm:gap-5">
                    <div className="relative aspect-[0.8] overflow-hidden rounded-[22px] bg-dark shadow-[0_20px_45px_rgba(3,90,83,0.2)]">
                      <Image
                        src={images.photo(19)}
                        alt="Printed rigid box"
                        fill
                        priority
                        sizes="(max-width: 1024px) 35vw, 220px"
                        className="object-cover"
                      />
                    </div>
                    <div className="relative aspect-[1.12] overflow-hidden rounded-[22px] bg-dark shadow-[0_24px_55px_rgba(3,90,83,0.22)]">
                      <Image
                        src={img("2024/05/h1-banner09.jpg")}
                        alt="Custom printed kraft pouches"
                        fill
                        priority
                        sizes="(max-width: 1024px) 60vw, 420px"
                        className="object-cover"
                        style={{ objectPosition: "78% 50%" }}
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white bg-dark px-4 py-3 text-white shadow-[0_14px_35px_rgba(3,90,83,0.25)] sm:left-10">
                    <span className="font-heading text-3xl leading-none text-primary">50+</span>
                    <span className="text-[11px] font-bold uppercase leading-tight tracking-[0.1em] text-white/75">
                      ways to
                      <br />
                      make it yours
                    </span>
                  </div>
                </div>
            </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <FeatureMarquee items={marqueeItems} />

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-main grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <AnimatedSection className="relative">
            <div className="relative aspect-[4/4.5] overflow-hidden rounded-[28px] shadow-[0_28px_70px_rgba(3,90,83,0.16)]">
              <Image
                src={images.goGreen}
                alt="Eco-friendly custom packaging by Boxora"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="absolute -bottom-6 right-4 hidden w-[46%] overflow-hidden rounded-[20px] border-[6px] border-white shadow-xl sm:block">
              <div className="relative aspect-square">
                <Image src={images.specialOffer} alt="" fill className="object-cover" sizes="25vw" />
              </div>
            </div>
            <div className="absolute -left-3 top-8 rounded-2xl bg-dark px-5 py-4 text-white shadow-[0_16px_40px_rgba(3,90,83,0.3)] sm:-left-6">
              <p className="font-heading text-3xl leading-none text-primary">50+</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/75">
                Options to
                <br />
                make it yours
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <span className="section-label text-primary">Our story</span>
            <h2 className="mt-3 font-heading text-[34px] leading-tight text-dark md:text-[46px]">
              Built for brands that care how they show up
            </h2>
            <p className="mt-5 text-lg text-text">
              Boxora started with a simple belief: great products deserve packaging that does them
              justice, without long lead times, huge minimums or a heavy footprint.
            </p>
            <p className="mt-4 text-text">
              Today we produce custom pouches, coffee bags, mailer boxes, rigid boxes and food
              packaging for brands of every size, from first-run startups to established names.
              Whatever the format, our goal stays the same: vivid print, sturdy construction and
              materials you can feel good about.
            </p>
            <ul className="mt-7 space-y-3">
              {benefits.map(({ text: b }) => (
                <li key={b} className="flex items-start gap-3 text-[15px] text-dark">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-dark py-14">
        <div className="container-main grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-heading text-[44px] leading-none text-primary md:text-[56px]">{s.value}</p>
              <p className="mx-auto mt-3 max-w-[180px] text-sm font-semibold text-white/75">{s.label}</p>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <span className="section-label text-secondary">What we stand for</span>
            <h2 className="mt-3 font-heading text-[34px] leading-tight text-dark md:text-[46px]">
              The principles behind every box
            </h2>
          </AnimatedSection>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={(i % 3) * 0.08}>
                <div className="group h-full rounded-[24px] border border-border/80 bg-background-field/35 p-7 transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:bg-white hover:shadow-[0_24px_60px_rgba(3,90,83,0.1)]">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background-field text-primary transition group-hover:bg-primary group-hover:text-dark">
                    <v.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-heading text-2xl text-dark">{v.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-text">{v.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-background-field">
        <div className="container-main">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <span className="section-label text-secondary">How it works</span>
            <h2 className="mt-3 font-heading text-[34px] leading-tight text-dark md:text-[46px]">
              From idea to doorstep in four steps
            </h2>
          </AnimatedSection>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <AnimatedSection key={s.n} delay={i * 0.08}>
                <div className="group relative h-full rounded-[24px] border border-border/80 bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_24px_60px_rgba(3,90,83,0.1)]">
                  <span className="font-heading text-[56px] leading-none text-transparent [-webkit-text-stroke:1px_rgba(3,90,83,0.55)] transition group-hover:[-webkit-text-stroke:1px_rgba(3,90,83,1)]">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-dark">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-text">{s.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Image band + CTA */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-[28px] bg-dark ring-1 ring-primary/30 px-6 py-16 text-center md:px-16 md:py-20">
              <div className="pointer-events-none absolute -right-10 -top-10 hidden h-64 w-64 rotate-12 overflow-hidden rounded-[16px] opacity-40 md:block">
                <Image src={images.packagingStyles[0]} alt="" fill className="object-cover" sizes="260px" />
              </div>
              <div className="pointer-events-none absolute -bottom-12 -left-8 hidden h-56 w-56 -rotate-12 overflow-hidden rounded-[16px] opacity-40 md:block">
                <Image src={images.packagingStyles[2]} alt="" fill className="object-cover" sizes="230px" />
              </div>
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-heading text-[34px] leading-tight text-white md:text-[48px]">
                  Ready to create packaging people remember?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-white/85 md:text-lg">
                  Tell us about your product and get a tailored quote. No pressure, just great packaging.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <AboutCTAButton variant="light" />
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 rounded-full border border-white/50 px-7 py-3.5 text-[15px] font-bold text-white transition hover:bg-white/10"
                  >
                    Read our packaging guides <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
