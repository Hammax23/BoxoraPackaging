"use client";

import { QUOTE_DRAWER_EVENT, type QuoteDrawerPayload } from "@/lib/quoteDrawer";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Mail, Phone, Send, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type QuoteFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  product: string;
  notes: string;
};

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15";

export default function QuoteDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<QuoteDrawerPayload>({});
  const [submitted, setSubmitted] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<QuoteFormState>({
    name: "",
    email: "",
    phone: "",
    company: "",
    product: "",
    notes: "",
  });

  const title = useMemo(() => {
    if (context.productName) return `Get a quote for ${context.productName}`;
    return "Get your free quote";
  }, [context.productName]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<QuoteDrawerPayload>).detail ?? {};
      setContext(detail);
      setSubmitted(false);
      setForm((prev) => ({
        ...prev,
        product: detail.productName ?? prev.product,
      }));
      setOpen(true);
      window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener(QUOTE_DRAWER_EVENT, onOpen as EventListener);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(QUOTE_DRAWER_EVENT, onOpen as EventListener);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const close = () => setOpen(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now: UI-only. Hook this to API later.
    setSubmitted(true);
    window.setTimeout(() => {
      close();
    }, 900);
  };

  return (
    <>
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-stretch justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <button
              type="button"
              aria-label="Close quote form"
              className="absolute inset-0 cursor-default bg-black/45"
              onClick={close}
            />

            {/* Drawer */}
            <motion.aside
              className="relative h-full w-full overflow-hidden bg-white shadow-2xl sm:max-w-[520px] sm:border-l sm:border-white/10"
              initial={{ x: 520 }}
              animate={{ x: 0 }}
              exit={{ x: 520 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-b border-border bg-gradient-to-br from-background-field/40 via-white to-white px-5 py-5 sm:px-6 [padding-top:calc(1.25rem+env(safe-area-inset-top))]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="section-label text-primary">Quote</p>
                      <h2 className="mt-2 line-clamp-2 font-heading text-2xl text-dark">{title}</h2>
                      <p className="mt-1 text-sm text-lighter">
                        Quick form — our team replies within 1 business day.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={close}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-white text-dark transition hover:border-primary/25 hover:text-primary"
                      aria-label="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-auto px-5 py-6 sm:px-6 [padding-bottom:calc(1.5rem+env(safe-area-inset-bottom))]">
                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
                        <input
                          ref={firstFieldRef}
                          required
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          placeholder="Full name *"
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
                        <input
                          required
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          placeholder="Work email *"
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
                        <input
                          value={form.phone}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          placeholder="Phone (optional)"
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                      <input
                        value={form.company}
                        onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                        placeholder="Company (optional)"
                        className={inputClass}
                      />
                    </div>

                    <input
                      value={form.product}
                      onChange={(e) => setForm((p) => ({ ...p, product: e.target.value }))}
                      placeholder="Product / packaging type (optional)"
                      className={inputClass}
                    />

                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                      placeholder="Notes (sizes, quantity, finish, deadline...)"
                      rows={5}
                      className={`${inputClass} resize-y`}
                    />

                    <div className="rounded-2xl border border-border bg-background-field/40 px-4 py-3 text-sm text-text">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-dark">What happens next?</span>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
                          Free
                        </span>
                      </div>
                      <p className="mt-1.5 text-sm text-text">
                        We confirm structure, materials, and timelines — then send you a clear quote response.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="btn-slip mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_4px_16px_rgba(39,87,255,0.28)] transition hover:bg-primary/90 hover:shadow-[0_8px_28px_rgba(39,87,255,0.38)]"
                    >
                      {submitted ? (
                        <>
                          Sent <Send className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Send request <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Footer strip */}
                <div className="border-t border-border bg-white px-5 py-4 sm:px-6">
                  <p className="text-xs text-lighter">
                    By submitting, you agree to be contacted about your quote request.
                  </p>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

