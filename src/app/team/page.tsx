import AboutCTAButton from "@/components/AboutCTAButton";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getContent } from "@/lib/queries/pageContent";
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
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Our Team",
  description:
    "Meet the packaging specialists, designers, print experts and logistics crew behind every Boxora order.",
  path: "/team",
});

type Crew = {
  role: string; tagline: string; text: string; icon: LucideIcon; accent: string; name?: string; photo?: string;
};

const icons: Record<string, LucideIcon> = { Headset, Ruler, Palette, Printer, PackageCheck, Leaf, Truck, Boxes };

function Avatar({ c }: { c: Crew }) {
  if (c.photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={c.photo} alt={c.name || c.role} className="h-20 w-20 rounded-2xl object-cover" />;
  }
  return (
    <span
      className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${c.accent} text-white shadow-lg transition duration-300 group-hover:rotate-6 group-hover:scale-105`}
    >
      <c.icon className="h-9 w-9" />
    </span>
  );
}

export default async function TeamPage() {
  const [rawCrew, principles] = await Promise.all([
    getContent<(Omit<Crew, "icon"> & { icon: string })[]>("teamCrew"),
    getContent<{ n: string; title: string; text: string }[]>("teamPrinciples"),
  ]);
  const crew: Crew[] = rawCrew.map((c) => ({ ...c, icon: icons[c.icon] ?? Boxes }));
  return (
    <main>
      <Header />

      <section className="bg-gradient-to-b from-white to-[#f3f1de] py-8 sm:py-10">
        <div className="container-main">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-[16px] border border-white bg-white/80 shadow-[0_24px_70px_rgba(189,249,6,0.12)] sm:rounded-[20px]">
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
                    <span className="whitespace-nowrap bg-[linear-gradient(100deg,#035a53_0%,#0b7a6e_100%)] bg-clip-text font-body font-extrabold tracking-tight text-transparent">
                      perfect box
                    </span>
                  </h1>
                  <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-text sm:text-base md:mx-0">
                    Designers, print experts and packaging specialists working as one crew.
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-5 md:justify-start">
                    <Link
                      href="/quote"
                      className="btn-slip group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(189,249,6,0.3)] transition-all duration-300 hover:bg-primary/90"
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
                        className={`-ml-5 flex h-[76px] w-[76px] items-center justify-center rounded-full border-[4px] border-white bg-gradient-to-br ${c.accent} text-white shadow-[0_12px_28px_rgba(189,249,6,0.22)] first:ml-0`}
                        style={{ zIndex: 10 - i }}
                      >
                        <c.icon className="h-7 w-7" />
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white bg-white px-4 py-2 text-[12px] font-bold text-dark shadow-[0_10px_26px_rgba(189,249,6,0.15)]">
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
                <article className="group relative h-full overflow-hidden rounded-[20px] border border-border bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(189,249,6,0.13)]">
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${c.accent} opacity-10 blur-2xl transition group-hover:opacity-30`}
                  />
                  <Avatar c={c} />
                  <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                    {c.tagline}
                  </p>
                  <h3 className="mt-1 font-heading text-[22px] leading-snug text-dark">{c.name || c.role}</h3>
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
                <div className="group h-full rounded-[20px] border border-border bg-white p-7 transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_24px_60px_rgba(189,249,6,0.12)]">
                  <span className="font-heading text-[52px] leading-none text-transparent [-webkit-text-stroke:1px_rgba(3,90,83,0.55)] transition group-hover:[-webkit-text-stroke:1px_rgba(3,90,83,1)]">
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
            <div className="rounded-[20px] bg-dark ring-1 ring-primary/30 px-6 py-16 text-center md:px-16 md:py-20">
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
