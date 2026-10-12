"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { Headphones, HelpCircle, Percent, Truck } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    icon: Headphones,
    title: "24/7 Support",
    value: "+1834 123 456 789",
    bg: "bg-primary",
  },
  {
    icon: HelpCircle,
    title: "How can we help you?",
    value: "Help and FAQ",
    bg: "bg-dark",
  },
  {
    icon: Percent,
    title: "Buy more, save more!",
    value: "20%",
    note: "Free shipping",
    bg: "bg-secondary",
  },
];

export default function PerfectPackaging() {
  return (
    <section className="section-padding bg-background-field">
      <div className="container-main space-y-10">
        <AnimatedSection>
          <h2 className="font-heading text-[34px] leading-tight text-dark md:text-[44px] lg:text-[52px]">
            Perfect packaging every time!
          </h2>
        </AnimatedSection>

        <div className="grid gap-5 lg:grid-cols-3">
          {cards.map((card, i) => (
            <AnimatedSection key={card.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`${card.bg} flex min-h-[220px] flex-col justify-between rounded-[28px] p-7 text-white`}
              >
                <card.icon className="h-9 w-9 opacity-90" strokeWidth={1.5} />
                <div>
                  <h3 className="font-heading text-2xl">{card.title}</h3>
                  <p className="mt-2 text-3xl font-bold tracking-tight">{card.value}</p>
                  {card.note && (
                    <p className="mt-2 flex items-center gap-2 text-sm text-white/90">
                      <Truck className="h-4 w-4" />
                      {card.note}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.2}>
          <div className="rounded-[28px] border border-primary/15 bg-white px-8 py-7 md:px-10">
            <h3 className="font-heading text-2xl text-dark md:text-3xl">
              Savings you don&apos;t want to miss!
            </h3>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
