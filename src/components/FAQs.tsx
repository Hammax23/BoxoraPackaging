"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { faqs as defaultFaqs } from "@/lib/data";
import type { FaqView } from "@/lib/queries/content";
import { openQuoteDrawer } from "@/lib/quoteDrawer";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MessageCircle, Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function FAQs({ faqs = defaultFaqs }: { faqs?: FaqView[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-main">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 xl:gap-16">
          <AnimatedSection className="lg:sticky lg:top-28">
            <span className="section-label text-primary">FAQs.</span>
            <h2 className="mt-4 font-heading text-[34px] leading-tight text-dark md:text-[44px] lg:text-[48px]">
              Frequently asked questions
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text md:text-lg">
              Everything you need to know about custom packaging, production timelines,
              and working with Boxora — answered in one place.
            </p>

            <div className="mt-8 overflow-hidden rounded-[28px] border border-border bg-background-field p-6 md:p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <MessageCircle className="h-5 w-5 text-primary" strokeWidth={2} />
              </div>
              <h3 className="mt-4 font-heading text-2xl text-dark">Still have questions?</h3>
              <p className="mt-2 text-sm leading-relaxed text-text">
                Can&apos;t find the answer you&apos;re looking for? Our packaging specialists
                are ready to help.
              </p>
              <button
                type="button"
                onClick={() => openQuoteDrawer({ source: "faq" })}
                className="btn-slip mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary/90"
              >
                Get Free Quote
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={faq.question}
                    className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "border-primary/25 bg-background-field/50 shadow-[0_8px_30px_rgba(39,87,255,0.08)]"
                        : "border-border bg-white hover:border-primary/15"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left md:px-6 md:py-6"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`pr-2 font-heading text-[17px] leading-snug transition-colors md:text-lg ${
                          isOpen ? "text-primary" : "text-dark"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-white text-dark"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="h-4 w-4" strokeWidth={2.5} />
                        ) : (
                          <Plus className="h-4 w-4" strokeWidth={2.5} />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="border-t border-border/60 px-5 pb-5 pt-4 text-sm leading-relaxed text-text md:px-6 md:pb-6">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
