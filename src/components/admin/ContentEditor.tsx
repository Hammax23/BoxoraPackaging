"use client";

import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { useState, useTransition } from "react";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
type Obj = { [k: string]: Json };

const input =
  "w-full min-h-[44px] rounded-xl border border-border bg-white px-3.5 py-2.5 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";
const small = "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-text transition hover:border-primary hover:text-primary disabled:opacity-40";

const isImageKey = (k: string) => /image|photo|src/i.test(k);
const isLong = (k: string, v: string) => v.length > 70 || v.includes("\n") || /^(text|description|answer|overview|subtitle)$/i.test(k);
const label = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

/** Blank copy of a value with the same shape, used for "Add item". */
function blank(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)]));
  return "";
}

function ImageInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const upload = async (file: File) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as { url?: string } | null;
      if (data?.url) onChange(data.url);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex gap-2">
      <input className={input} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Image URL or upload" />
      <label className={`${small} w-auto shrink-0 cursor-pointer px-3 text-xs font-bold`}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </label>
    </div>
  );
}

function Field({ k, v, onChange, selects }: { k: string; v: Json; onChange: (v: Json) => void; selects: Record<string, string[]> }) {
  if (typeof v === "string") {
    if (selects[k]) {
      const opts = selects[k].includes(v) ? selects[k] : [v, ...selects[k]];
      return (
        <select className={input} value={v} onChange={(e) => onChange(e.target.value)}>
          {opts.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
    }
    if (isImageKey(k)) return <ImageInput value={v} onChange={onChange} />;
    if (isLong(k, v)) return <textarea className={input} rows={3} value={v} onChange={(e) => onChange(e.target.value)} />;
    return <input className={input} value={v} onChange={(e) => onChange(e.target.value)} />;
  }
  if (typeof v === "number") return <input className={input} type="number" value={v} onChange={(e) => onChange(Number(e.target.value))} />;
  if (typeof v === "boolean") return <input type="checkbox" checked={v} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5" />;
  return <Node k={k} v={v} onChange={onChange} selects={selects} />;
}

function Node({ k, v, onChange, selects }: { k: string; v: Json; onChange: (v: Json) => void; selects: Record<string, string[]> }) {
  if (Array.isArray(v)) {
    const template = blank(v[0] ?? "");
    const set = (next: Json[]) => onChange(next);
    const move = (i: number, d: number) => {
      const next = [...v];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      set(next);
    };
    return (
      <div className="space-y-3">
        {v.map((item, i) => (
          <div key={i} className="rounded-2xl border border-border bg-background-field/60 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-lighter">#{i + 1}</span>
              <div className="flex gap-1.5">
                <button type="button" className={small} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
                <button type="button" className={small} disabled={i === v.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" className={`${small} hover:!border-red-400 hover:!text-red-500`} onClick={() => set(v.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <Field k={k} v={item} onChange={(nv) => set(v.map((x, j) => (j === i ? nv : x)))} selects={selects} />
          </div>
        ))}
        <button type="button" onClick={() => set([...v, template])} className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-primary/50 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/5">
          <Plus className="h-3.5 w-3.5" /> Add item
        </button>
      </div>
    );
  }
  const o = v as Obj;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(o).map(([key, val]) => {
        const wide = typeof val === "object" || (typeof val === "string" && (isLong(key, val) || isImageKey(key)));
        return (
          <label key={key} className={`block ${wide ? "sm:col-span-2" : ""}`}>
            <span className="mb-1 block text-xs font-semibold text-text">{label(key)}</span>
            <Field k={key} v={val} onChange={(nv) => onChange({ ...o, [key]: nv })} selects={selects} />
          </label>
        );
      })}
    </div>
  );
}

export default function ContentEditor({
  sectionKey,
  initial,
  selects = {},
  save,
}: {
  sectionKey: string;
  initial: Json;
  selects?: Record<string, string[]>;
  save: (key: string, json: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [value, setValue] = useState<Json>(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-5">
      <Node k="" v={value} onChange={setValue} selects={selects} />
      <div className="sticky bottom-3 flex items-center gap-3 rounded-2xl border border-border bg-white/95 p-3 shadow-lg backdrop-blur">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await save(sectionKey, JSON.stringify(value));
              setMsg({ ok: r.ok, text: r.ok ? "Saved. The site is updated." : (r.error ?? "Could not save.") });
            })
          }
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-white disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
        </button>
        {msg && <span className={`text-sm font-medium ${msg.ok ? "text-green-600" : "text-red-600"}`}>{msg.text}</span>}
      </div>
    </div>
  );
}
