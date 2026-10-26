import AboutCTAButton from "@/components/AboutCTAButton";
import FaqExplorer from "@/components/FaqExplorer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { getFaqs } from "@/lib/queries/content";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";
import { ArrowRight, Leaf, Package, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQs",
  description:
    "Answers about minimum orders, setup fees, production time, samples, materials, eco-friendly options, design help and shipping at Boxora.",
  path: "/faq",
});

const topics = [
  { icon: Package, title: "Orders & samples", text: "Minimums, setup fees and prototypes." },
  { icon: Leaf, title: "Materials & eco", text: "Kraft, films, compostable options." },
  { icon: Truck, title: "Production & shipping", text: "Turnaround, rush runs, delivery." },
];

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <main>
      <JsonLd data={faqJsonLd(faqs)} />
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#f3f1de] pb-20 pt-12 md:pt-16">
        <div className="pointer-events-none absolute left-1/2 top-[-140px] h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/15 via-[#d8e267]/15 to-secondary/20 blur-3xl" />
        {/* decorative icon chips */}
        <span className="pointer-events-none absolute left-[9%] top-[38%] hidden h-14 w-14 -rotate-6 items-center justify-center rounded-2xl border border-white bg-white text-primary shadow-[0_14px_34px_rgba(189,249,6,0.18)] lg:flex">
          <Package className="h-6 w-6" />
        </span>
        <span className="pointer-events-none absolute right-[10%] top-[30%] hidden h-14 w-14 rotate-6 items-center justify-center rounded-2xl border border-white bg-white text-secondary shadow-[0_14px_34px_rgba(216,226,103,0.2)] lg:flex">
          <Truck className="h-6 w-6" />
        </span>
        <div className="container-main relative z-10 text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              FAQs
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-heading text-[34px] leading-[1.1] text-dark sm:text-[46px] md:text-[54px]">
              Questions? We&apos;ve got{" "}
              <span className="bg-[linear-gradient(100deg,#035a53_0%,#0b7a6e_100%)] bg-clip-text font-body font-extrabold tracking-tight text-transparent">
                answers
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-text sm:text-lg">
              Everything about custom packaging, production and working with Boxora, in one place.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="relative z-10 bg-white pb-20 pt-0 md:pb-28">
        <div className="container-main">
          <div className="-mt-9">
            <FaqExplorer faqs={faqs} />
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3">
            {topics.map((t, i) => (
              <AnimatedSection key={t.title} delay={i * 0.08}>
                <div className="flex h-full items-start gap-4 rounded-[16px] border border-border bg-white p-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-background-field text-primary">
                    <t.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-bold text-dark">{t.title}</span>
                    <span className="block text-sm text-text">{t.text}</span>
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background-field">
        <div className="container-main">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-[20px] bg-dark ring-1 ring-primary/30 px-6 py-14 text-center md:px-16 md:py-16">
              <h2 className="mx-auto max-w-2xl font-heading text-[32px] leading-tight text-white md:text-[44px]">
                Still have a question?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/85 md:text-lg">
                Our packaging specialists are happy to help with your specific project.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <AboutCTAButton variant="light" />
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/50 px-7 py-3.5 text-[15px] font-bold text-white transition hover:bg-white/10"
                >
                  Contact us <ArrowRight className="h-4 w-4" />
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
