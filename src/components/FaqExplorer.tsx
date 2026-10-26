"use client";

import type { FaqView } from "@/lib/queries/content";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Search, SearchX, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function FaqExplorer({ faqs }: { faqs: FaqView[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs
      .map((f, index) => ({ ...f, index }))
      .filter((f) => !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  }, [faqs, query]);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const allOpen = results.length > 0 && results.every((r) => open.has(r.index));
  const toggleAll = () => setOpen(allOpen ? new Set() : new Set(results.map((r) => r.index)));

  return (
    <div>
      <div className="relative mx-auto max-w-2xl">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-lighter" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions, e.g. minimum order, samples, shipping"
          aria-label="Search frequently asked questions"
          className="[&::-webkit-search-cancel-button]:hidden w-full rounded-full border border-border bg-white py-4 pl-14 pr-12 text-[16px] text-dark shadow-[0_12px_40px_rgba(3,90,83,0.1)] outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-lighter transition hover:bg-background-field hover:text-dark"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl items-center justify-between text-sm">
        <p className="font-semibold text-lighter" role="status" aria-live="polite">
          {query ? `${results.length} of ${faqs.length} questions` : `${faqs.length} questions`}
        </p>
        {results.length > 1 && (
          <button
            type="button"
            onClick={toggleAll}
            className="font-bold text-primary transition hover:underline"
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        )}
      </div>

      <div className="mx-auto mt-4 max-w-3xl space-y-3">
        {results.map((faq, n) => {
          const isOpen = open.has(faq.index);
          return (
            <div
              key={faq.index}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? "border-primary/25 bg-background-field/50 shadow-[0_8px_30px_rgba(189,249,6,0.08)]"
                  : "border-border bg-white hover:border-primary/20"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(faq.index)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-4 px-5 py-5 text-left md:px-6 md:py-6"
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold transition ${
                    isOpen ? "bg-primary text-white" : "bg-background-field text-primary"
                  }`}
                >
                  {String(n + 1).padStart(2, "0")}
                </span>
                <span
                  className={`flex-1 font-heading text-[17px] leading-snug transition-colors md:text-[19px] ${
                    isOpen ? "text-primary" : "text-dark"
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen ? "border-primary bg-primary text-white" : "border-border bg-white text-dark"
                  }`}
                >
                  {isOpen ? <Minus className="h-4 w-4" strokeWidth={2.5} /> : <Plus className="h-4 w-4" strokeWidth={2.5} />}
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
                    <p className="border-t border-border/60 px-5 pb-6 pt-4 text-[15px] leading-relaxed text-text md:pl-[4.5rem] md:pr-8">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {results.length === 0 && (
          <div className="rounded-[20px] border border-dashed border-border bg-background-field/40 px-6 py-14 text-center">
            <SearchX className="mx-auto h-10 w-10 text-lighter" />
            <h3 className="mt-4 font-heading text-2xl text-dark">No matches for &ldquo;{query}&rdquo;</h3>
            <p className="mt-2 text-text">Try a different word, or ask us directly below.</p>
          </div>
        )}
      </div>
    </div>
  );
}
