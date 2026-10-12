"use client";

import { heroContent } from "@/lib/data";
import { images } from "@/lib/images";
import { motion } from "framer-motion";
import Image from "next/image";

const leftFloats = [
  { src: images.hero.floatLeft[0], top: "8%", left: "2%", w: 130, h: 160, rotate: -6, delay: 0 },
  { src: images.hero.floatLeft[1], top: "32%", left: "0%", w: 110, h: 140, rotate: 4, delay: 0.15 },
  { src: images.hero.floatLeft[2], top: "55%", left: "4%", w: 100, h: 120, rotate: -3, delay: 0.3 },
  { src: images.hero.floatLeft[3], top: "72%", left: "1%", w: 120, h: 150, rotate: 5, delay: 0.45 },
];

const rightFloats = [
  { src: images.hero.floatRight[0], top: "6%", right: "2%", w: 140, h: 170, rotate: 5, delay: 0.1 },
  { src: images.hero.floatRight[1], top: "28%", right: "0%", w: 120, h: 150, rotate: -4, delay: 0.25 },
  { src: images.hero.floatRight[2], top: "52%", right: "3%", w: 110, h: 130, rotate: 3, delay: 0.4 },
  { src: images.hero.floatRight[3], top: "70%", right: "1%", w: 130, h: 160, rotate: -5, delay: 0.55 },
];

export default function Hero() {
  return (
    <section className="hero-section relative min-h-[620px] overflow-hidden md:min-h-[700px] lg:min-h-[780px]">
      {/* Dark gradient background */}
      <div className="hero-glow-left" />
      <div className="hero-glow-right" />

      {/* Floating side images */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {leftFloats.map((item) => (
          <motion.div
            key={item.src}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: item.delay },
              y: { duration: 5 + item.delay * 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{
              top: item.top,
              left: item.left,
              width: item.w,
              height: item.h,
              transform: `rotate(${item.rotate}deg)`,
            }}
          >
            <Image src={item.src} alt="" fill className="object-cover" sizes="140px" />
          </motion.div>
        ))}
        {rightFloats.map((item) => (
          <motion.div
            key={item.src}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: [0, -12, 0] }}
            transition={{
              opacity: { duration: 0.8, delay: item.delay },
              y: { duration: 5.5 + item.delay * 2, repeat: Infinity, ease: "easeInOut" },
            }}
            className="absolute overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{
              top: item.top,
              right: item.right,
              width: item.w,
              height: item.h,
              transform: `rotate(${item.rotate}deg)`,
            }}
          >
            <Image src={item.src} alt="" fill className="object-cover" sizes="140px" />
          </motion.div>
        ))}
      </div>

      {/* Centered content */}
      <div className="container-main relative z-10 flex min-h-[620px] flex-col items-center justify-center px-4 py-16 text-center md:min-h-[700px] lg:min-h-[780px] lg:py-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[12px] font-bold uppercase tracking-[0.22em] text-secondary"
        >
          {heroContent.badge}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="mt-5 max-w-4xl font-heading text-[36px] leading-[1.12] text-white md:text-[52px] lg:text-[62px]"
        >
          {heroContent.titleLine1}
          <br />
          <span className="font-body text-[38px] font-bold text-primary md:text-[54px] lg:text-[64px]">
            {heroContent.titleLine2}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-5 max-w-xl text-base text-white/75 md:text-lg"
        >
          {heroContent.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-9 flex max-w-3xl flex-wrap items-center justify-center gap-3"
        >
          {heroContent.tags.map((tag, i) => (
            <motion.span
              key={tag.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + i * 0.07 }}
              className="inline-block rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] shadow-md md:px-5 md:py-2.5 md:text-xs"
              style={{
                backgroundColor: tag.bg,
                color: tag.color,
                transform: `rotate(${tag.rotate}deg)`,
              }}
            >
              # {tag.label}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
