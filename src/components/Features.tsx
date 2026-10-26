"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { useSiteContent } from "@/components/SiteContentProvider";
import {
  Banknote,
  Calculator,
  Calendar,
  Headset,
  Leaf,
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
  leaf: Leaf,
  headset: Headset,
};

function FeatureIcon({ icon }: { icon: string }) {
  const Icon = iconMap[icon];
  if (!Icon) return null;

  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      <div className="absolute inset-0 rounded-2xl bg-primary/[0.08]" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-[0_4px_16px_rgba(189,249,6,0.1)]">
        <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
        <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-white bg-secondary" />
      </div>
    </div>
  );
}

type Feature = { title: string; description: string; icon: string };

export default function Features({ features }: { features: Feature[] }) {
  const { features: heading } = useSiteContent();
  return (
    <section className="section-padding bg-dark">
      <div className="container-main">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <span className="section-label text-secondary">{heading.label}</span>
          <h2 className="mt-3 font-heading text-[34px] leading-tight text-white md:text-[44px]">{heading.title}</h2>
          <p className="mt-4 text-base text-white/70 md:text-lg">{heading.description}</p>
        </AnimatedSection>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={(i % 4) * 0.06} className="h-full">
              <div className="group flex h-full flex-col gap-4 rounded-[16px] border border-white/10 bg-white/[0.06] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-white/10">
                <FeatureIcon icon={feature.icon} />
                <h3 className="font-heading text-[19px] leading-snug text-white transition-colors group-hover:text-secondary">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-white/65">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
