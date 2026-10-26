"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, CornerDownLeft, Search, SearchX, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type Item = { title: string; subtitle: string; href: string; image?: string };
type Group = { type: string; items: Item[] };

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  // Index of each group's first item within the flat list (for keyboard highlighting).
  const starts = useMemo(
    () => groups.map((_, gi) => groups.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0)),
    [groups],
  );

  // Focus and lock scroll while open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = original;
      window.clearTimeout(t);
    };
  }, [open]);

  // Debounced fetch.
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const t = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        const data = (await res.json()) as { groups: Group[] };
        setGroups(data.groups);
        setActive(0);
      } catch {
        // aborted or offline: keep the previous results
      } finally {
        setLoading(false);
      }
    }, query ? 180 : 0);
    return () => {
      controller.abort();
      window.clearTimeout(t);
    };
  }, [query, open]);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      go(flat[active].href);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-start justify-center px-4 pt-[10vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#024540]/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search Boxora"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[680px] overflow-hidden rounded-[20px] border border-white/60 bg-white shadow-[0_40px_120px_rgba(3,90,83,0.45)]"
          >
            <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-primary" />
            <div className="flex items-center gap-3 border-b border-border px-5">
              <Search className="h-5 w-5 shrink-0 text-primary" strokeWidth={2} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search styles, products, guides..."
                aria-label="Search"
                className="h-16 flex-1 bg-transparent text-[17px] text-dark outline-none placeholder:text-lighter"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 items-center gap-1 rounded-lg border border-border px-2 text-[11px] font-bold text-lighter transition hover:border-primary hover:text-primary"
              >
                ESC
              </button>
            </div>

            <div className="max-h-[56vh] overflow-y-auto p-3" aria-busy={loading}>
              {groups.map((group, gi) => (
                <div key={group.type} className="mb-2">
                  <p className="px-3 pb-1.5 pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-lighter">
                    {group.type}
                  </p>
                  {group.items.map((item, ii) => {
                    const i = starts[gi] + ii;
                    const isActive = i === active;
                    return (
                      <Link
                        key={`${group.type}-${item.href}`}
                        href={item.href}
                        onClick={onClose}
                        onMouseEnter={() => setActive(i)}
                        className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition ${
                          isActive ? "bg-background-field" : ""
                        }`}
                      >
                        {item.image ? (
                          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-background-field">
                            <Image src={item.image} alt="" fill className="object-cover" sizes="44px" />
                          </span>
                        ) : (
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <ArrowUpRight className="h-5 w-5" />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className={`block truncate text-[15px] font-bold ${isActive ? "text-primary" : "text-dark"}`}>
                            {item.title}
                          </span>
                          <span className="block truncate text-[13px] text-lighter">{item.subtitle}</span>
                        </span>
                        {isActive && <CornerDownLeft className="h-4 w-4 shrink-0 text-primary" />}
                      </Link>
                    );
                  })}
                </div>
              ))}

              {!loading && groups.length === 0 && query && (
                <div className="px-6 py-12 text-center">
                  <SearchX className="mx-auto h-9 w-9 text-lighter" />
                  <p className="mt-3 font-heading text-xl text-dark">No results for &ldquo;{query}&rdquo;</p>
                  <p className="mt-1 text-sm text-text">Try another word, or ask our team directly.</p>
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                  >
                    Contact us <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border bg-background-field/50 px-5 py-3 text-[11px] font-semibold text-lighter">
              <span className="flex items-center gap-3">
                <span>↑↓ to navigate</span>
                <span>↵ to open</span>
              </span>
              <button type="button" onClick={onClose} className="inline-flex items-center gap-1 hover:text-primary">
                <X className="h-3.5 w-3.5" /> Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
