"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { faqs as defaultFaqs } from "@/lib/data";
import type { FaqView } from "@/lib/queries/content";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export type FaqHeading = { title: string; text: string; image: string };

const defaultHeading: FaqHeading = { title: "Frequently Asked Questions", text: "Quick answers about custom packaging, printing, shipping and ordering.", image: "" };

export default function FAQs({ faqs = defaultFaqs, heading = defaultHeading }: { faqs?: FaqView[]; heading?: FaqHeading }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-padding bg-background-field">
      <div className="container-main grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        {heading.image && (
          <AnimatedSection className="relative hidden aspect-[4/5] overflow-hidden rounded-[16px] bg-white lg:block">
            <Image src={heading.image} alt="" fill sizes="40vw" className="object-cover" />
          </AnimatedSection>
        )}
        <AnimatedSection delay={0.1} className={heading.image ? "" : "lg:col-span-2"}>
          <h2 className="font-heading text-[32px] leading-tight text-dark md:text-[42px]">{heading.title}</h2>
          <p className="mt-3 text-base text-text">{heading.text}</p>
          <div className="mt-7 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.question} className="overflow-hidden rounded-2xl border border-border bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className={`text-[15px] font-semibold leading-snug ${isOpen ? "text-primary" : "text-dark"}`}>{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-lighter transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                        <p className="border-t border-border/60 px-5 pb-5 pt-4 text-sm leading-relaxed text-text">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
