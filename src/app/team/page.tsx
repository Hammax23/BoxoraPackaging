import AboutCTAButton from "@/components/AboutCTAButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { buildPageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  Boxes,
  Headset,
  Leaf,
  Palette,
  PackageCheck,
  Printer,
  Ruler,
  Truck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Our Team",
  description:
    "Meet the packaging specialists, designers, print experts and logistics crew behind every Boxora order.",
  path: "/team",
});

/**
 * Add real people here when ready: { name, photo } on any card renders a portrait
 * instead of the icon avatar.
 */
const crew: {
  role: string;
  tagline: string;
  text: string;
  icon: typeof Headset;
  accent: string;
  name?: string;
  photo?: string;
}[] = [
  {
    role: "Packaging Specialists",
    tagline: "Your point of contact",
    text: "One dedicated specialist guides you from first question to final delivery, recommending the right structure, materials and quantity.",
    icon: Headset,
    accent: "from-primary to-[#6d8bff]",
  },
  {
    role: "Structural Designers",
    tagline: "Dielines & fit",
    text: "We engineer boxes and pouches around your product so it fits snugly, protects well and opens beautifully.",
    icon: Ruler,
    accent: "from-[#7b3fe4] to-primary",
  },
  {
    role: "Artwork & Prepress",
    tagline: "Colors that pop",
    text: "Our prepress team checks every file, matches colors and sends a clear proof before anything goes to print.",
    icon: Palette,
    accent: "from-secondary to-[#ff9be8]",
  },
  {
    role: "Print & Production",
    tagline: "Craft at scale",
    text: "Skilled operators run vivid printing and finishing on sturdy stock, from short runs to larger production orders.",
    icon: Printer,
    accent: "from-primary to-secondary",
  },
  {
    role: "Quality Control",
    tagline: "Every unit counts",
    text: "Each order is inspected for color, structure and finish, so what arrives matches what you approved.",
    icon: PackageCheck,
    accent: "from-[#14b8a6] to-primary",
  },
  {
    role: "Sustainability Lead",
    tagline: "Better materials",
    text: "We source paper-based, plant-based and recyclable options so your packaging looks great and treads lightly.",
    icon: Leaf,
    accent: "from-[#22c55e] to-[#14b8a6]",
  },
  {
    role: "Fulfilment & Logistics",
    tagline: "On time, intact",
    text: "Careful packing, free standard shipping and rush options keep your launch dates safe.",
    icon: Truck,
    accent: "from-[#f59e0b] to-secondary",
  },
  {
    role: "Customer Care",
    tagline: "Fast replies",
    text: "Questions about an order? A real person answers quickly, with no ticket maze.",
    icon: Boxes,
    accent: "from-secondary to-primary",
  },
];

const principles = [
  { n: "01", title: "Be honest", text: "Clear pricing, realistic timelines, straight answers." },
  { n: "02", title: "Sweat the details", text: "The fold, the finish, the color: small things people feel." },
  { n: "03", title: "Move fast", text: "Quick responses, short runs and rush orders when you need them." },
  { n: "04", title: "Leave it greener", text: "Choose better materials every chance we get." },
];

function Avatar({ c }: { c: (typeof crew)[number] }) {
  if (c.photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={c.photo} alt={c.name ?? c.role} className="h-20 w-20 rounded-2xl object-cover" />;
  }
  return (
    <span
      className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${c.accent} text-white shadow-lg transition duration-300 group-hover:rotate-6 group-hover:scale-105`}
    >
      <c.icon className="h-9 w-9" />
    </span>
  );
}

export default function TeamPage() {
  return (
    <main>
      <Header />

      <section className="bg-gradient-to-b from-white to-[#eef1ff] py-8 sm:py-10">
        <div className="container-main">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-[32px] border border-white bg-white/80 shadow-[0_24px_70px_rgba(39,87,255,0.12)] sm:rounded-[40px]">
              <div className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-secondary/20 to-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative grid items-center gap-6 px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[1.3fr_1fr] lg:px-14">
                <div className="text-center md:text-left">
                  <span className="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    Our team
                  </span>
                  <h1 className="mt-4 font-heading text-[30px] leading-[1.1] text-dark sm:text-[40px] lg:text-[46px]">
                    The people behind every{" "}
                    <span className="whitespace-nowrap bg-[linear-gradient(100deg,#2757ff_0%,#7a4dff_50%,#f865dc_100%)] bg-clip-text font-body font-extrabold tracking-tight text-transparent">
                      perfect box
                    </span>
                  </h1>
                  <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-text sm:text-base md:mx-0">
                    Designers, print experts and packaging specialists working as one crew.
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-5 md:justify-start">
                    <Link
                      href="/quote"
                      className="btn-slip group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(39,87,255,0.3)] transition-all duration-300 hover:bg-primary/90"
                    >
                      Work with us
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
                    </Link>
                    <Link
                      href="/about"
                      className="group inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.08em] text-dark transition hover:text-primary"
                    >
                      About Boxora
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>

                <div className="hidden flex-col items-center gap-4 sm:flex">
                  <div className="flex items-center">
                    {crew.slice(0, 5).map((c, i) => (
                      <span
                        key={c.role}
                        title={c.role}
                        className={`-ml-5 flex h-[76px] w-[76px] items-center justify-center rounded-full border-[4px] border-white bg-gradient-to-br ${c.accent} text-white shadow-[0_12px_28px_rgba(39,87,255,0.22)] first:ml-0`}
                        style={{ zIndex: 10 - i }}
                      >
                        <c.icon className="h-7 w-7" />
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-4 py-2 text-[12px] font-bold text-dark shadow-[0_10px_26px_rgba(39,87,255,0.15)]">
                    <span className="font-heading text-[20px] leading-none text-primary">{crew.length}</span>
                    specialist teams, one goal
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <span className="section-label text-primary">Who you&apos;ll work with</span>
            <h2 className="mt-3 font-heading text-[34px] leading-tight text-dark md:text-[46px]">
              A crew built around your order
            </h2>
          </AnimatedSection>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {crew.map((c, i) => (
              <AnimatedSection key={c.role} delay={(i % 4) * 0.07}>
                <article className="group relative h-full overflow-hidden rounded-[28px] border border-border bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(39,87,255,0.13)]">
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${c.accent} opacity-10 blur-2xl transition group-hover:opacity-30`}
                  />
                  <Avatar c={c} />
                  <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                    {c.tagline}
                  </p>
                  <h3 className="mt-1 font-heading text-[22px] leading-snug text-dark">{c.name ?? c.role}</h3>
                  {c.name && <p className="text-sm font-semibold text-lighter">{c.role}</p>}
                  <p className="mt-3 text-[14.5px] leading-relaxed text-text">{c.text}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background-field">
        <div className="container-main">
          <AnimatedSection className="mx-auto max-w-2xl text-center">
            <span className="section-label text-secondary">How we work</span>
            <h2 className="mt-3 font-heading text-[34px] leading-tight text-dark md:text-[46px]">
              Four principles we share
            </h2>
          </AnimatedSection>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <AnimatedSection key={p.n} delay={i * 0.08}>
                <div className="group h-full rounded-[28px] border border-border bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(39,87,255,0.12)]">
                  <span className="font-heading text-[52px] leading-none text-transparent [-webkit-text-stroke:1px_rgba(39,87,255,0.6)] transition group-hover:[-webkit-text-stroke:1px_rgba(248,101,220,0.9)]">
                    {p.n}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-dark">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-text">{p.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimatedSection>
            <div className="rounded-[40px] bg-gradient-to-br from-primary via-[#4a3df0] to-secondary px-6 py-16 text-center md:px-16 md:py-20">
              <h2 className="mx-auto max-w-2xl font-heading text-[34px] leading-tight text-white md:text-[46px]">
                Let&apos;s build something great together
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/85 md:text-lg">
                Tell us about your product and our team will take it from there.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <AboutCTAButton variant="light" />
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-white/50 px-7 py-3.5 text-[15px] font-bold text-white transition hover:bg-white/10"
                >
                  About Boxora <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
