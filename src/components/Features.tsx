"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { features, featuresSection, topBar } from "@/lib/data";
import { openQuoteDrawer } from "@/lib/quoteDrawer";
import {
  ArrowRight,
  Banknote,
  Calculator,
  Calendar,
  Paintbrush,
  ShieldCheck,
  Target,
  Truck,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  banknote: Banknote,
  target: Target,
  calculator: Calculator,
  paintbrush: Paintbrush,
  calendar: Calendar,
  truck: Truck,
};

function FeatureIcon({ icon }: { icon: string }) {
  const Icon = iconMap[icon];
  if (!Icon) return null;

  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      <div className="absolute inset-0 rounded-2xl bg-primary/[0.08]" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-[0_4px_16px_rgba(39,87,255,0.1)]">
        <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-white bg-secondary" />
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section className="section-padding border-y border-border bg-white">
      <div className="container-main">
        <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch lg:gap-14 xl:gap-16">
          <AnimatedSection className="flex h-full flex-col">
            <span className="section-label text-primary">{featuresSection.label}</span>
            <h2 className="mt-4 font-heading text-[34px] leading-tight text-dark md:text-[40px] lg:text-[44px]">
              {featuresSection.title}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-text md:text-lg">
              {featuresSection.description}
            </p>

            <div className="mt-8 flex flex-1 flex-col lg:mt-10">
              <div className="flex h-full flex-col rounded-[28px] border border-border bg-background-field p-6 md:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-heading text-xl text-dark md:text-2xl">
                  Your brand deserves better packaging
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-text">
                  Get a free quote and see how Boxora can elevate your product presentation.
                </p>
                <button
                  type="button"
                  onClick={() => openQuoteDrawer({ source: "features-cta" })}
                  className="btn-slip mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary/90"
                >
                  Get Free Quote
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid h-full gap-4 sm:grid-cols-2">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.05} className="h-full">
                <div className="group flex h-full items-start gap-4 rounded-[24px] border border-border bg-white p-5 transition-all duration-300 hover:border-primary/25 hover:shadow-[0_12px_40px_rgba(39,87,255,0.08)] md:p-6">
                  <FeatureIcon icon={feature.icon} />
                  <div className="min-w-0">
                    <h3 className="font-heading text-[17px] leading-snug text-dark transition-colors group-hover:text-primary md:text-lg">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
