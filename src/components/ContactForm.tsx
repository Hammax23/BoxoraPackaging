"use client";

import { useFormClock } from "@/lib/formClock";
import { ArrowRight, Check, ChevronDown, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";

const topics = ["General question", "Order status", "Custom project", "Partnerships", "Something else"];

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15";

export default function ContactForm() {
  const stamp = useFormClock();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    stamp(fd);
    fd.set("type", "contact");

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      form.reset();
      setSent(true);
      window.setTimeout(() => setSent(false), 8000);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">

      <div className="grid gap-4 sm:grid-cols-2">
        <input required name="name" autoComplete="name" placeholder="Full name *" className={inputClass} />
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Email *"
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="tel" name="phone" autoComplete="tel" placeholder="Phone" className={inputClass} />
        <span className="relative block">
          <select name="topic" defaultValue="" className={`${inputClass} appearance-none pr-10`}>
            <option value="" disabled>
              What can we help with?
            </option>
            {topics.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
        </span>
      </div>
      <textarea required name="message" rows={6} placeholder="Your message *" className={`${inputClass} resize-y`} />

      <button
        type="submit"
        disabled={sending}
        className="btn-slip inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[#4a3df0] py-4 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_4px_16px_rgba(39,87,255,0.28)] transition hover:shadow-[0_8px_28px_rgba(39,87,255,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? (
          <>
            Sending <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Send message <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p role="status" aria-live="polite" className="min-h-[1.5rem] text-center text-sm">
        {sent && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#16a34a]">
            <Check className="h-4 w-4" /> Thanks! We&apos;ll get back to you within 1 business day.
          </span>
        )}
        {error && <span className="font-semibold text-secondary">{error}</span>}
      </p>
    </form>
  );
}
