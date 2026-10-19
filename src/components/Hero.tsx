"use client";

import { useSiteContent } from "@/components/SiteContentProvider";
import { img, images } from "@/lib/images";
import { openQuoteDrawer } from "@/lib/quoteDrawer";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Three arched photos rising from the bottom edge. The centre one is tallest.
const arches = [
  {
    src: img("2024/05/h1-banner10.jpg"),
    alt: "Printed mailer packaging on green",
    pos: "70% 50%",
    cls: "w-[30%] aspect-[3/5]",
    delay: 0.45,
  },
  {
    src: img("2024/05/h1-banner09.jpg"),
    alt: "Custom printed kraft coffee pouches",
    pos: "78% 50%",
    cls: "w-[37%] aspect-[3/6.3]",
    delay: 0.3,
  },
  {
    src: img("2024/05/banner-megamenu-2.jpg"),
    alt: "Zipper pouch with matcha chocolates",
    pos: "80% 50%",
    cls: "w-[30%] aspect-[3/4.7]",
    delay: 0.6,
  },
];

// Box photos layered on top of the arches (positions are % of the visual column).
const boxes = [
  { src: images.photo(19), alt: "Printed rigid box", cls: "left-[4%] top-[5%] h-[27%] aspect-square", rotate: -7, dur: 6, delay: 0.9 },
  { src: images.photo(14), alt: "Kraft carry box", cls: "right-[3%] top-[12%] h-[24%] aspect-square", rotate: 8, dur: 7, delay: 1.1 },
  { src: images.photo(18), alt: "Printed mailer box", cls: "left-[34%] top-[1%] h-[21%] aspect-square", rotate: 3, dur: 5.5, delay: 1.3 },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const { hero: heroContent } = useSiteContent();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#eef1ff] lg:h-[calc(100svh-7.4rem)] lg:max-h-[860px] lg:min-h-[540px]">
      {/* One soft wash of brand color */}
      <div className="pointer-events-none absolute -right-10 top-0 h-[640px] w-[640px] rounded-full bg-gradient-to-br from-primary/15 to-secondary/20 blur-3xl" />

      <div className="container-main relative z-10 grid items-center gap-6 pt-8 sm:pt-14 lg:h-full lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[minmax(0,1fr)] lg:gap-8 lg:pt-0">
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary sm:text-[13px]"
          >
            {heroContent.badge}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 font-heading text-[36px] leading-[1.1] text-dark sm:text-[48px] md:text-[56px] lg:text-[clamp(44px,8.2vh,78px)]"
          >
            {heroContent.titleLine1}
            <br />
            <span className="bg-[linear-gradient(100deg,#2757ff_0%,#7a4dff_50%,#f865dc_100%)] bg-clip-text font-body font-extrabold tracking-tight text-transparent">
              {heroContent.titleLine2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-text sm:text-lg lg:mx-0 lg:mt-6"
          >
            {heroContent.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-6 flex items-center justify-center gap-2.5 sm:gap-3 lg:mt-10 lg:justify-start"
          >
            <button
              type="button"
              onClick={() => openQuoteDrawer({ source: "hero" })}
              className="btn-slip group inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_26px_rgba(39,87,255,0.3)] transition-all duration-300 hover:bg-primary/90 whitespace-nowrap max-sm:!px-4 max-sm:!py-3 max-sm:!text-[11px] sm:text-[13px]"
            >
              Get instant quote
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.5} />
            </button>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full border border-dark/15 bg-white px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-dark transition hover:border-primary hover:text-primary whitespace-nowrap max-sm:!px-4 max-sm:!py-3 max-sm:!text-[11px] sm:text-[13px]"
            >
              Explore products
            </Link>
          </motion.div>
        </div>

        {/* Arches */}
        <div className="relative mx-auto mt-4 h-[272px] w-full max-w-[420px] sm:mt-0 sm:h-[340px] sm:max-w-[520px] lg:h-full lg:max-w-none">
          {/* Box photos on top */}
          {boxes.map((b) => (
            <motion.div
              key={b.src}
              initial={{ opacity: 0, scale: 0.7, rotate: b.rotate - 10 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: b.rotate,
                y: reduce ? 0 : [0, -10, 0],
              }}
              transition={{
                opacity: { duration: 0.7, delay: b.delay },
                scale: { duration: 0.7, delay: b.delay },
                rotate: { duration: 0.7, delay: b.delay },
                y: { duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay },
              }}
              className={`absolute z-20 hidden overflow-hidden rounded-[20px] border-[4px] border-white bg-white shadow-[0_20px_50px_rgba(39,87,255,0.25)] sm:block ${b.cls}`}
            >
              <Image src={b.src} alt={b.alt} fill sizes="160px" className="object-cover" />
            </motion.div>
          ))}

          <div className="absolute inset-0 flex items-end justify-center gap-[3%]">
            {arches.map((a) => (
              <motion.div
                key={a.src}
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: a.delay, ease: [0.22, 1, 0.36, 1] }}
                className={`relative translate-y-[4%] ${a.cls}`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-t-[999px] rounded-b-2xl border-[4px] border-white shadow-[0_16px_50px_rgba(39,87,255,0.18)]">
                  <Image
                    src={a.src}
                    alt={a.alt}
                    fill
                    priority
                    sizes="(max-width: 640px) 30vw, 240px"
                    className="object-cover"
                    style={{ objectPosition: a.pos }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
