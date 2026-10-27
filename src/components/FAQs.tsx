"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { faqs as defaultFaqs } from "@/lib/data";
import type { FaqView } from "@/lib/queries/content";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircleQuestion, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type FaqHeading = { title: string; text: string; image: string };

const defaultHeading: FaqHeading = { title: "Frequently Asked Questions", text: "Quick answers about custom packaging, printing, shipping and ordering.", image: "" };

export default function FAQs({ faqs = defaultFaqs, heading = defaultHeading }: { faqs?: FaqView[]; heading?: FaqHeading }) {
  const [openIndex, setOpenIndex] = useState(0);

  const hasImage = Boolean(heading.image);
  const words = heading.title.trim().split(" ");
  const last = words.length > 1 ? words.pop() : "";
  const lead = words.join(" ");

  return (
    <section id="faq" className="section-padding relative overflow-hidden bg-background-field">
      {/* Soft decorative glows */}
      <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-dark/10 blur-3xl" />

      <div className={`container-main relative grid items-stretch gap-10 ${hasImage ? "lg:grid-cols-[0.85fr_1.15fr] lg:gap-14" : "mx-auto max-w-4xl"}`}>
        {hasImage && (
        <AnimatedSection className="relative hidden min-h-[520px] overflow-hidden rounded-[28px] bg-dark shadow-[0_24px_60px_rgba(3,90,83,0.18)] lg:block">
          <Image src={heading.image} alt="" fill sizes="40vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-white/95 p-6 shadow-xl backdrop-blur">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-dark text-[#bdf906]">
              <MessageCircleQuestion className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <h3 className="mt-4 font-heading text-[22px] leading-snug text-dark">Still have questions?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-text">Can&apos;t find what you need? Our packaging team replies within 1 business day.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/quote" className="inline-flex items-center gap-2 rounded-full bg-dark px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary hover:text-dark">
                Get a quote <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
              <Link href="/contact" className="inline-flex items-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-bold text-dark transition hover:border-primary">
                Contact us
              </Link>
            </div>
          </div>
        </AnimatedSection>
        )}

        {/* Right: heading + accordion */}
        <AnimatedSection delay={0.1}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-dark">
            <span className="h-2 w-2 rounded-full bg-primary" /> FAQ
          </span>
          <h2 className="mt-4 font-heading text-[32px] leading-tight text-dark md:text-[44px]">
            {lead}{" "}
            {last && <span className="rounded-lg bg-primary px-2 text-dark [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">{last}</span>}
          </h2>
          <p className="mt-3 max-w-xl text-base text-text">{heading.text}</p>

          <div className="mt-8 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border bg-white transition duration-300 ${
                    isOpen ? "border-primary shadow-[0_12px_32px_rgba(189,249,6,0.22)]" : "border-border shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-primary/60"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition ${isOpen ? "bg-primary text-dark" : "bg-background-field text-dark"}`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-[15px] font-semibold leading-snug text-dark md:text-base">{faq.question}</span>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition duration-300 ${isOpen ? "bg-dark text-white" : "bg-background-field text-dark"}`}>
                        {isOpen ? <Minus className="h-4 w-4" strokeWidth={2.5} /> : <Plus className="h-4 w-4" strokeWidth={2.5} />}
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="mx-5 mb-5 border-l-4 border-primary pl-4 text-sm leading-relaxed text-text md:text-[15px]">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {
            <div className={`mt-8 flex flex-col items-start gap-5 rounded-2xl bg-dark p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7 ${hasImage ? "lg:hidden" : ""}`}>
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#bdf906] text-dark">
                  <MessageCircleQuestion className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div>
                  <h3 className="font-heading text-[20px] leading-snug text-white">Still have questions?</h3>
                  <p className="mt-1 text-sm text-white/75">Our packaging team replies within 1 business day.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/quote" className="inline-flex items-center gap-2 rounded-full bg-[#bdf906] px-5 py-2.5 text-sm font-bold text-dark transition hover:bg-white">
                  Get a quote <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </Link>
                <Link href="/contact" className="inline-flex items-center rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#bdf906] hover:text-[#bdf906]">
                  Contact us
                </Link>
              </div>
            </div>
          }
        </AnimatedSection>
      </div>
    </section>
  );
}
