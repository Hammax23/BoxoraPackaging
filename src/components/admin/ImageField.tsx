"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

/**
 * Image input for admin forms: paste a URL or upload a file. Renders a normal
 * <input name=...> so it works inside plain server-action forms.
 */
export default function ImageField({
  name,
  defaultValue = "",
  placeholder = "Image URL or upload a file",
  required = false,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !data?.url) {
        setError(data?.error ?? "Upload failed.");
        return;
      }
      setValue(data.url);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-stretch gap-2">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background-field/60">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = "0.2")} />
          ) : (
            <ImagePlus className="h-5 w-5 text-lighter" />
          )}
        </div>
        <input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          placeholder={placeholder}
          className="min-h-[48px] min-w-0 flex-1 rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-white px-4 text-xs font-bold uppercase tracking-[0.06em] text-dark transition hover:border-primary hover:text-primary disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {busy ? "Uploading" : "Upload"}
        </button>
        {value && (
          <button
            type="button"
            aria-label="Clear image"
            onClick={() => setValue("")}
            className="flex w-10 shrink-0 items-center justify-center rounded-xl border border-border text-lighter transition hover:border-secondary hover:text-secondary"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="sr-only"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
      {error && (
        <p role="alert" className="text-[13px] font-semibold text-secondary">
          {error}
        </p>
      )}
    </div>
  );
}
