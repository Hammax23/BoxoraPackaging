"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef } from "react";

const SPEED = 40; // px per second, cards move right to left
const COPIES = 3; // rendered three times so the loop is seamless in both directions

/** Endless auto-scrolling carousel with arrows. Pass the cards as `items`; each is wrapped to a fixed width. */
export default function AutoCarousel({ items, itemClassName, label }: { items: ReactNode[]; itemClassName: string; label: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const nudge = useRef<{ from: number; to: number; start: number } | null>(null);

  // Keep the position inside the middle copy so it can scroll forever either way.
  const wrap = useCallback(() => {
    const el = scroller.current;
    if (!el) return 0;
    const unit = el.scrollWidth / COPIES;
    if (el.scrollLeft < unit) el.scrollLeft += unit;
    else if (el.scrollLeft >= unit * 2) el.scrollLeft -= unit;
    return unit;
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth / COPIES;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let last = performance.now();
    let pos = el.scrollLeft;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (nudge.current) {
        const n = nudge.current;
        const t = Math.min((now - n.start) / 500, 1);
        el.scrollLeft = n.from + (n.to - n.from) * (1 - Math.pow(1 - t, 3));
        pos = el.scrollLeft;
        if (t >= 1) nudge.current = null;
      } else if (paused.current || reduced) {
        pos = el.scrollLeft;
      } else {
        pos += SPEED * dt;
        el.scrollLeft = pos;
        const before = el.scrollLeft;
        wrap();
        if (el.scrollLeft !== before) pos = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [wrap]);

  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    wrap();
    const card = (el.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? 260;
    const from = nudge.current?.to ?? el.scrollLeft;
    nudge.current = { from: el.scrollLeft, to: from + dir * (card + 20), start: performance.now() };
  };

  const btn =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-dark shadow-[0_6px_20px_rgba(0,0,0,0.12)] transition hover:border-primary hover:bg-primary focus-visible:outline-2 focus-visible:outline-primary sm:flex";

  return (
    <div
      className="relative mt-10"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <button type="button" aria-label={`Previous ${label}`} onClick={() => step(-1)} className={`${btn} left-3 lg:left-6`}>
        <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
      </button>
      <button type="button" aria-label={`Next ${label}`} onClick={() => step(1)} className={`${btn} right-3 lg:right-6`}>
        <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
      </button>

      <div
        ref={scroller}
        className="flex gap-5 overflow-x-auto py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]"
        onTouchStart={() => (paused.current = true)}
        onTouchEnd={() => setTimeout(() => (paused.current = false), 1500)}
      >
        {Array.from({ length: COPIES }, (_, copy) =>
          items.map((item, i) => (
            <div
              key={`${copy}-${i}`}
              aria-hidden={copy !== 1}
              inert={copy !== 1}
              className={`shrink-0 ${itemClassName}`}
            >
              {item}
            </div>
          )),
        )}
      </div>
    </div>
  );
}
