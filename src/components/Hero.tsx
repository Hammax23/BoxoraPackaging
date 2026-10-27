"use client";

import { useSiteContent } from "@/components/SiteContentProvider";
import { ArrowRight, Check, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type HeroImage = { image: string; alt: string };

export default function Hero({ images, checklist }: { images: HeroImage[]; checklist: { text: string }[] }) {
  const { hero, topBar } = useSiteContent();
  return (
    <section className="relative overflow-hidden bg-dark lg:flex lg:min-h-[calc(100svh-10.5rem)] lg:items-center">
      <div className="hero-grid" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full bg-primary/12 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-[120px]" />
      <div className="container-main relative z-10 grid w-full items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-6">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {hero.badge}
          </span>
          <h1 className="mt-5 font-heading text-[36px] leading-[1.08] text-white sm:text-[46px] lg:text-[clamp(36px,6.6vh,54px)]">
            {hero.titleLine1} <span className="text-primary">{hero.titleLine2}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">{hero.subtitle}</p>

          <ul className="mt-6 grid max-w-md gap-x-6 gap-y-3 sm:grid-cols-2">
            {checklist.map((c) => (
              <li key={c.text} className="flex items-center gap-2.5 text-[15px] font-medium text-white">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
                {c.text}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="btn-slip inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(189,249,6,0.28)] transition hover:bg-primary/90"
            >
              Get Free Quote <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/styles"
              className="inline-flex items-center rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:border-primary hover:text-primary"
            >
              Browse Boxes By Style
            </Link>
          </div>
        </div>

        <div className="relative">
          {/* Two straight columns of product photos drifting in opposite directions; pauses on hover. */}
          <div className="hero-wall grid h-[460px] grid-cols-2 gap-3 overflow-hidden sm:h-[540px] sm:gap-4 lg:h-[clamp(380px,calc(100svh-15rem),600px)]" aria-label="Packaging showcase">
            {[0, 1].map((col) => {
              const items = images.filter((_, i) => i % 2 === col);
              return (
                <div key={col} className="hero-wall-col">
                  <div className={`hero-wall-track ${col === 0 ? "hero-wall-up" : "hero-wall-down"}`}>
                    {[0, 1].map((copy) =>
                      items.map((im, i) => (
                        <div
                          key={`${copy}-${im.image}-${i}`}
                          aria-hidden={copy === 1}
                          className="relative aspect-square shrink-0 overflow-hidden rounded-[24px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.3)] ring-1 ring-white/20"
                        >
                          <Image
                            src={im.image}
                            alt={copy === 0 ? im.alt : ""}
                            fill
                            loading="eager"
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                      )),
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <a
            href={`tel:${topBar.phone.replace(/\s/g, "")}`}
            className="absolute -bottom-4 left-4 z-10 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.25)] sm:left-8"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-dark">
              <Phone className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-lighter">Talk to a specialist</span>
              <span className="block text-sm font-bold text-dark">{topBar.phone}</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
