"use client";

import { Check, ExternalLink, Loader2, Truck } from "lucide-react";
import { type FormEvent, useState } from "react";

type Result = {
  reference: string;
  stage: string;
  stages: { key: string; label: string; at: string | null }[];
  updates: { stage: string; message: string; at: string }[];
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  estimatedDelivery: string | null;
  items: { name: string | null; quantity: number | null }[];
};

const field =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";
const day = (d: string) => new Date(d).toLocaleDateString("en-US", { dateStyle: "medium" });

export default function TrackForm({ defaultReference = "" }: { defaultReference?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [r, setR] = useState<Result | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: fd.get("reference"), email: fd.get("email") }),
      });
      const data = (await res.json().catch(() => null)) as ({ ok: boolean; error?: string } & Partial<Result>) | null;
      if (!res.ok || !data?.ok) {
        setR(null);
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setR(data as Result);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const current = r ? r.stages.findIndex((s) => s.key === r.stage) : -1;

  return (
    <div className="mt-8 space-y-6">
      <form onSubmit={submit} className="grid gap-3 rounded-[20px] border border-border bg-white p-6 shadow-sm sm:grid-cols-[1fr_1fr_auto]">
        <input name="reference" required defaultValue={defaultReference} placeholder="Order reference (e.g. BX-12345)" className={field} autoComplete="off" />
        <input name="email" type="email" required placeholder="Email used on the order" className={field} autoComplete="email" />
        <button type="submit" disabled={busy} className="btn-slip inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-dark px-6 text-sm font-bold text-white disabled:opacity-70">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
        </button>
        {error && <p role="alert" className="text-sm font-semibold text-red-600 sm:col-span-3">{error}</p>}
      </form>

      {r && (
        <div className="space-y-6 rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8" aria-live="polite">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-heading text-2xl text-dark">Order {r.reference}</h2>
            {r.estimatedDelivery && <p className="text-sm text-text">Estimated delivery: <strong className="text-dark">{day(r.estimatedDelivery)}</strong></p>}
          </div>
          {r.items.length > 0 && (
            <p className="text-sm text-text">{r.items.map((i) => [i.name, i.quantity ? `× ${i.quantity.toLocaleString()}` : ""].filter(Boolean).join(" ")).join(" · ")}</p>
          )}

          <ol className="grid gap-4 sm:grid-cols-6">
            {r.stages.map((s, i) => {
              const done = i <= current;
              return (
                <li key={s.key} className="flex gap-3 sm:flex-col sm:items-center sm:text-center">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${done ? "border-primary bg-primary text-dark" : "border-border text-lighter"} ${i === current ? "ring-4 ring-primary/30" : ""}`}>
                    {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                  </span>
                  <span>
                    <span className={`block text-sm font-bold ${done ? "text-dark" : "text-lighter"}`}>{s.label}</span>
                    {s.at && <span className="block text-xs text-text">{day(s.at)}</span>}
                  </span>
                </li>
              );
            })}
          </ol>

          {(r.carrier || r.trackingNumber) && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-background-field p-4 text-sm">
              <Truck className="h-5 w-5 text-dark" />
              <span className="text-dark"><strong>{r.carrier || "Carrier"}</strong>{r.trackingNumber ? ` · ${r.trackingNumber}` : ""}</span>
              {r.trackingUrl && (
                <a href={r.trackingUrl} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1.5 font-bold text-dark underline">
                  Track with carrier <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          )}

          {r.updates.length > 0 && (
            <div>
              <h3 className="font-heading text-lg text-dark">Updates</h3>
              <ul className="mt-3 space-y-3">
                {r.updates.map((u, i) => (
                  <li key={i} className="border-l-2 border-primary pl-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-lighter">{day(u.at)}</p>
                    <p className="text-sm text-dark">{u.message}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
