"use client";

import { useFormClock } from "@/lib/formClock";
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";

const units = ["Inches", "Centimeters", "Millimeters"];

const inputClass =
  "w-full min-h-[52px] rounded-2xl border border-border bg-white px-5 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-4 focus:ring-primary/20";

type Props = {
  /** Saved with the request so you can tell where it came from, e.g. "product:slug" or "quote-page". */
  source: string;
  productName?: string;
  productSlug?: string;
  industry?: string;
};

export default function QuoteForm({ source, productName, productSlug, industry }: Props) {
  const stamp = useFormClock();
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    length: "",
    width: "",
    depth: "",
    unit: "",
    quantity: "",
    message: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof typeof data) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setData((d) => ({ ...d, [key]: e.target.value }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const fd = new FormData();
    stamp(fd);
    fd.set("type", "quote");
    fd.set("source", source);
    fd.set("name", data.name);
    fd.set("email", data.email);
    fd.set("phone", data.phone);
    fd.set("zip", data.zip);
    fd.set("length", data.length);
    fd.set("width", data.width);
    fd.set("height", data.depth);
    fd.set("unit", data.unit);
    fd.set("quantity", data.quantity);
    fd.set("notes", data.message);
    if (productName) fd.set("productName", productName);
    if (productSlug) fd.set("productSlug", productSlug);
    if (industry) fd.set("industry", industry);
    for (const f of files) fd.append("files", f);

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !json?.ok) {
        setError(json?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const hasSize = Boolean(data.length || data.width || data.depth);

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input type="text" name="name" autoComplete="name" placeholder="Name *" required value={data.name} onChange={set("name")} className={inputClass} />
        <input type="email" name="email" autoComplete="email" placeholder="Email *" required value={data.email} onChange={set("email")} className={inputClass} />
        <input type="tel" name="phone" autoComplete="tel" placeholder="Phone Number *" required value={data.phone} onChange={set("phone")} className={inputClass} />
        <input type="text" name="zip" autoComplete="postal-code" placeholder="Zip Code" value={data.zip} onChange={set("zip")} className={inputClass} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(
          [
            ["Length", "length"],
            ["Width", "width"],
            ["Depth", "depth"],
          ] as const
        ).map(([label, key]) => (
          <input key={key} type="number" inputMode="decimal" min="0" step="any" placeholder={label} aria-label={label} value={data[key]} onChange={set(key)} className={inputClass} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <select
            aria-label="Unit"
            required={hasSize}
            value={data.unit}
            onChange={set("unit")}
            className={`${inputClass} cursor-pointer appearance-none pr-12 ${data.unit ? "" : "text-dark"}`}
          >
            <option value="">Unit</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-dark" />
        </div>
        <input type="number" inputMode="numeric" min="1" step="1" placeholder="Quantity *" aria-label="Quantity" required value={data.quantity} onChange={set("quantity")} className={inputClass} />
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-dark">Upload Artwork</span>
        <input
          type="file"
          multiple
          accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.svg,.zip"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 5))}
          className={`${inputClass} cursor-pointer !p-2 file:mr-3 file:cursor-pointer file:rounded-xl file:border-0 file:bg-background-field file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-dark`}
        />
      </label>

      <textarea placeholder="Tell us more about your product." rows={4} value={data.message} onChange={set("message")} className={`${inputClass} resize-y`} />

      <button
        type="submit"
        disabled={sending || sent}
        className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-dark px-8 py-4 text-base font-bold text-white transition hover:bg-dark/90 disabled:cursor-not-allowed disabled:opacity-80"
      >
        {sending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> Sending…
          </>
        ) : sent ? (
          "Request sent"
        ) : (
          <>
            Get Quote <ArrowRight className="h-5 w-5" strokeWidth={2} />
          </>
        )}
      </button>
      <p className="text-center text-sm text-text">
        <span className="text-secondary">*</span> Required.
      </p>
      <p role="status" aria-live="polite" className={sent || error ? "text-center text-sm font-semibold" : "sr-only"}>
        {sent && <span className="text-[#16a34a]">Thanks! Our team will get back to you with your quote within 1 business day.</span>}
        {error && <span className="text-secondary">{error}</span>}
      </p>
    </form>
  );
}
