"use client";

import {
  BOXORA_INDUSTRIES,
  BOXORA_PRODUCT_TARGETS,
  allSelectableLabels,
  industryHint,
  resolveIndustryLine,
  suggestIndustriesLocal,
  type IndustrySuggestion,
} from "@/lib/boxoraIndustries";
import { Check, ChevronDown, Loader2, Search, Sparkles, X } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function IndustryCombobox({ value, onChange, className = "" }: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  // Richer AI matches, kept together with the text they were computed for.
  const [ai, setAi] = useState<{
    q: string;
    suggestions: IndustrySuggestion[];
    source: "local" | "ai";
  } | null>(null);

  // Keep the text box in sync when the parent changes the value (adjust state during render).
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setQuery(value);
  }

  const localSuggestions = useMemo(() => suggestIndustriesLocal(query, 8), [query]);
  const aiFresh = ai && ai.q === query.trim() ? ai : null;
  const suggestions = aiFresh ? aiFresh.suggestions : localSuggestions;
  const source = aiFresh ? aiFresh.source : "local";

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (q.length < 2) return;

    const localTop = suggestIndustriesLocal(q, 1)[0];
    // Always ask AI for richer product mapping when query is free-text / medium confidence
    const needsAi = !localTop || localTop.score < 88;

    if (!needsAi) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/packaging/industry-suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
          signal: controller.signal,
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          suggestions?: IndustrySuggestion[];
          source?: "local" | "ai";
        };
        if (data.suggestions?.length) {
          setAi({ q, suggestions: data.suggestions, source: data.source ?? "local" });
          setActiveIdx(0);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    }, 420);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, open]);

  const select = (label: string) => {
    onChange(label);
    setQuery(label);
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.max(suggestions.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = suggestions[activeIdx];
      if (pick) select(pick.label);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const mappedIndustry = value ? resolveIndustryLine(value) : null;
  const hint = value ? industryHint(value) : null;

  return (
    <div ref={rootRef} className={`relative max-w-md ${className}`}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open ? `${listId}-opt-${activeIdx}` : undefined}
          value={query}
          placeholder="Type product — e.g. soap boxes, lipstick, coffee bags…"
          autoComplete="off"
          onFocus={() => {
            setOpen(true);
            setActiveIdx(0);
          }}
          onChange={(e) => {
            const next = e.target.value;
            setQuery(next);
            setActiveIdx(0);
            setOpen(true);
            if (allSelectableLabels().includes(next)) onChange(next);
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-16 text-sm text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : query ? (
            <button
              type="button"
              aria-label="Clear"
              onClick={() => {
                setQuery("");
                onChange("");
                setOpen(true);
                inputRef.current?.focus();
              }}
              className="rounded-md p-2.5 text-lighter transition hover:bg-background-field hover:text-dark"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
          <ChevronDown className="h-4 w-4 text-lighter" />
        </div>
      </div>

      {open && (
        <div
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1.5 max-h-80 w-full overflow-auto rounded-xl border border-border bg-white py-1.5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)]"
        >
          <div className="flex items-center justify-between gap-2 px-3 pb-1.5 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-lighter">
              {source === "ai" ? "AI product matches" : "Products & industries"}
            </p>
            {source === "ai" ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                GPT assist
              </span>
            ) : null}
          </div>

          {suggestions.length === 0 ? (
            <p className="px-3 py-3 text-sm text-lighter">
              No match — try “soap”, “lipstick”, “coffee bag”, “mailer”…
            </p>
          ) : (
            suggestions.map((row, idx) => {
              const active = idx === activeIdx;
              const selected = row.label === value;
              return (
                <button
                  key={`${row.kind}-${row.label}`}
                  id={`${listId}-opt-${idx}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => select(row.label)}
                  className={`flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition ${
                    active ? "bg-primary/8" : "hover:bg-background-field"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                      selected ? "bg-primary text-white" : "border border-border"
                    }`}
                  >
                    {selected ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-dark">{row.label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] ${
                          row.kind === "product"
                            ? "bg-primary/10 text-primary"
                            : "bg-background-field text-lighter"
                        }`}
                      >
                        {row.kind === "product" ? "Product" : "Industry"}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-lighter">
                      {row.reason}
                      {row.source === "ai" ? " · AI" : ""}
                    </span>
                  </span>
                </button>
              );
            })
          )}

          <div className="mt-1 border-t border-border/80 px-3 pb-1 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-lighter">
              Browse products by industry
            </p>
          </div>
          <div className="max-h-48 space-y-2 overflow-auto px-1 pb-2">
            {BOXORA_INDUSTRIES.map((ind) => {
              const products = BOXORA_PRODUCT_TARGETS.filter((p) => p.industry === ind);
              if (products.length === 0) return null;
              return (
                <div key={`grp-${ind}`}>
                  <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary/80">
                    {ind} · {products.length}
                  </p>
                  {products.map((p) => (
                    <button
                      key={`prod-${p.label}`}
                      type="button"
                      onClick={() => select(p.label)}
                      className={`w-full rounded-lg px-2.5 py-1 text-left text-[12px] transition hover:bg-background-field ${
                        p.label === value ? "font-semibold text-primary" : "text-text"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="mt-1 border-t border-border/80 px-3 pb-1 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-lighter">
              Industry lines
            </p>
          </div>
          <div className="px-1 pb-1">
            {BOXORA_INDUSTRIES.map((name) => (
              <button
                key={`all-${name}`}
                type="button"
                onClick={() => select(name)}
                className={`w-full rounded-lg px-2.5 py-1.5 text-left text-[13px] transition hover:bg-background-field ${
                  name === value ? "font-semibold text-primary" : "text-text"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {hint && value ? (
        <p className="mt-2 text-[12px] leading-relaxed text-lighter">
          <span className="font-semibold text-dark">
            {mappedIndustry && mappedIndustry !== value ? `${mappedIndustry} · ` : ""}
            Packaging focus:{" "}
          </span>
          {hint}
        </p>
      ) : (
        <p className="mt-2 text-[12px] text-lighter">
          {BOXORA_PRODUCT_TARGETS.length}+ products across all industries — type any product name
          (soap, mascara, coffee bag, shoe…).
        </p>
      )}
    </div>
  );
}
