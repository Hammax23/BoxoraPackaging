import AboutCTAButton from "@/components/AboutCTAButton";
import FeatureMarquee from "@/components/FeatureMarquee";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { businessBenefits } from "@/lib/data";
import { img, images } from "@/lib/images";
import { getMarqueeItems } from "@/lib/queries/content";
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

const stats = [
  { value: "50+", label: "Customization options" },
  { value: "100%", label: "Recyclable & compostable materials" },
  { value: "Free", label: "Standard shipping" },
  { value: "Rush", label: "Orders & short runs welcome" },
];

const values = [
  {
    icon: Gem,
    title: "Quality first",
    text: "Sturdy structures, crisp printing and finishes that hold up from the production line to the customer's hands.",
  },
  {
    icon: Leaf,
    title: "Made to be sustainable",
    text: "Paper-based, plant-based and waste-based materials, so great packaging never costs the planet.",
  },
  {
    icon: Palette,
    title: "Your brand, front and center",
    text: "Every pouch and box is a canvas. We help your story read at a single glance on the shelf.",
  },
  {
    icon: Rocket,
    title: "Speed to market",
    text: "Short runs and rush orders for launches, seasonal drops and niche products, without the long waits.",
  },
  {
    icon: Handshake,
    title: "A real partner",
    text: "Quick responses, honest guidance and one point of contact from first sketch to final delivery.",
  },
  {
    icon: ShieldCheck,
    title: "Promise kept",
    text: "We guarantee the highest quality products and customer experience with every order.",
  },
];

const steps = [
  { n: "01", title: "Tell us what you need", text: "Share your product, quantity and goals, or use our instant quote tool to get started in minutes." },
  { n: "02", title: "Design & proof", text: "Pick from 50+ options and approve a clear proof so nothing is left to guesswork." },
  { n: "03", title: "Print & craft", text: "Your packaging is printed in vibrant color on the materials you chose and carefully quality checked." },
  { n: "04", title: "Ship to your door", text: "Standard shipping is free, and rush options are there when your launch date is tight." },
];

// Small stack of tilted photos inside the hero card. Offsets are in % of the stack box.
const heroStack = [
  { src: images.photo(19), alt: "Printed rigid box", cls: "left-[2%] top-[14%] h-[62%] w-[34%]", rotate: -7, z: "z-10" },
  { src: img("2024/05/h1-banner09.jpg"), alt: "Custom printed kraft pouches", cls: "left-[28%] top-[2%] h-[92%] w-[42%]", rotate: 0, z: "z-20", pos: "78% 50%" },
  { src: images.photo(11), alt: "Stand-up pouch", cls: "right-[2%] top-[16%] h-[62%] w-[34%]", rotate: 7, z: "z-10" },
] as { src: string; alt: string; cls: string; rotate: number; z: string; pos?: string }[];

export default async function AboutPage() {
  const marqueeItems = await getMarqueeItems();

  return (
    <main>
      <Header />

      {/* Hero: compact banner card */}
      <section className="bg-gradient-to-b from-white to-[#eef1ff] py-8 sm:py-10">
        <div className="container-main">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-[32px] border border-white bg-white/80 shadow-[0_24px_70px_rgba(39,87,255,0.12)] sm:rounded-[40px]">
              <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-primary/20 to-secondary/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative grid items-center gap-2 px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1.25fr_1fr] lg:px-14">
                <div className="text-center md:text-left">
                  <span className="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    About Boxora
                  </span>
                  <h1 className="mt-4 font-heading text-[30px] leading-[1.1] text-dark sm:text-[40px] lg:text-[46px]">
                    We make packaging{" "}
                    <span className="whitespace-nowrap bg-[linear-gradient(100deg,#2757ff_0%,#7a4dff_50%,#f865dc_100%)] bg-clip-text font-body font-extrabold tracking-tight text-transparent">
                      worth keeping
                    </span>
                  </h1>
                  <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-text sm:text-base md:mx-0">
                    Custom, eco-friendly packaging that makes your brand&apos;s first impression count.
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-5 md:justify-start">
                    <Link
                      href="/quote"
                      className="btn-slip group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(39,87,255,0.3)] transition-all duration-300 hover:bg-primary/90"
                    >
                      Start your project
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
                    </Link>
                    <Link
                      href="/team"
                      className="group inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-dark transition hover:text-primary"
                    >
                      Meet the team
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>

                <div className="relative mx-auto hidden h-[230px] w-full max-w-[380px] sm:block lg:h-[250px]">
                  {heroStack.map((p) => (
                    <div
                      key={p.src}
                      className={`absolute overflow-hidden rounded-2xl border-[4px] border-white bg-background-field shadow-[0_16px_40px_rgba(39,87,255,0.2)] ${p.cls} ${p.z}`}
                      style={{ transform: `rotate(${p.rotate}deg)` }}
                    >
                      <Image
                        src={p.src}
                        alt={p.alt}
                        fill
                        priority
                        sizes="160px"
                        className="object-cover"
                        style={{ objectPosition: p.pos ?? "50% 50%" }}
                      />
                    </div>
                  ))}
                  <div className="absolute -bottom-1 right-2 z-30 flex items-center gap-2 rounded-xl border border-white bg-white px-3 py-2 shadow-[0_12px_30px_rgba(39,87,255,0.2)]">
                    <span className="font-heading text-[22px] leading-none text-primary">50+</span>
                    <span className="text-[11px] font-semibold leading-tight text-dark">
                      custom
                      <br />
                      options
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-[40px] shadow-[0_30px_80px_rgba(39,87,255,0.18)]">
              <Image
                src={images.goGreen}
                alt="Eco-friendly custom packaging by Boxora"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="absolute -bottom-6 right-4 hidden w-[46%] overflow-hidden rounded-[28px] border-[6px] border-white shadow-xl sm:block">
              <div className="relative aspect-square">
                <Image src={images.specialOffer} alt="" fill className="object-cover" sizes="25vw" />
              </div>
            </div>
            <div className="absolute -left-3 top-8 rounded-2xl bg-primary px-5 py-4 text-white shadow-[0_16px_40px_rgba(39,87,255,0.45)] sm:-left-6">
              <p className="font-heading text-3xl leading-none">50+</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-white/85">
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
              {businessBenefits.map((b) => (
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
      <section className="bg-background-field py-14">
        <div className="container-main grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((s, i) => (
            <AnimatedSection key={s.label} delay={i * 0.08} className="text-center">
              <p className="font-heading text-[44px] leading-none text-primary md:text-[56px]">{s.value}</p>
              <p className="mx-auto mt-3 max-w-[180px] text-sm font-semibold text-dark">{s.label}</p>
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
                <div className="group h-full rounded-[28px] border border-border bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(39,87,255,0.12)]">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background-field text-primary transition group-hover:bg-primary group-hover:text-white">
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
                <div className="group relative h-full rounded-[28px] border border-border bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(39,87,255,0.12)]">
                  <span className="font-heading text-[56px] leading-none text-transparent [-webkit-text-stroke:1px_rgba(39,87,255,0.6)] transition group-hover:[-webkit-text-stroke:1px_rgba(248,101,220,0.9)]">
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
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-primary via-[#4a3df0] to-secondary px-6 py-16 text-center md:px-16 md:py-20">
              <div className="pointer-events-none absolute -right-10 -top-10 hidden h-64 w-64 rotate-12 overflow-hidden rounded-[32px] opacity-40 md:block">
                <Image src={images.packagingStyles[0]} alt="" fill className="object-cover" sizes="260px" />
              </div>
              <div className="pointer-events-none absolute -bottom-12 -left-8 hidden h-56 w-56 -rotate-12 overflow-hidden rounded-[32px] opacity-40 md:block">
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
