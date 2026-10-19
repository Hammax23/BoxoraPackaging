"use client";

import { useFormClock } from "@/lib/formClock";
import {
  checkProductSizeFit,
  getTypicalProductSize,
  isKnownProductOrIndustry,
  resolveIndustryLine,
} from "@/lib/boxoraIndustries";
import type { BrandCustom } from "@/components/BoxPreview3D";
import dynamic from "next/dynamic";

// three.js is heavy: load it only in the browser, after the page is interactive.
const BoxPreview3D = dynamic(() => import("@/components/BoxPreview3D"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-background-field" aria-hidden="true" />,
});
import IndustryCombobox from "@/components/IndustryCombobox";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  runFitEngine,
  type FinishId,
  type FitResult,
  type Fragility,
} from "@/lib/packagingEstimator";
import {
  Activity,
  ArrowRight,
  Box,
  CheckCircle2,
  Gauge,
  Loader2,
  Package,
  Ruler,
  ShieldCheck,
  FileText,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { type DragEvent, type FormEvent, useEffect, useMemo, useRef, useState } from "react";

const fieldClass =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15";

const finishes = [
  { id: "matte" as const, label: "Matte Laminate" },
  { id: "gloss" as const, label: "Gloss Laminate" },
  { id: "soft" as const, label: "Soft-Touch" },
  { id: "foil" as const, label: "Foil Accent" },
];

const quantities = [500, 1000, 2500, 5000, 10000, 25000];

/** One clean font and a dark brown ink that reads well on kraft board. */
const BRAND_FONT = "Figtree, Arial, Helvetica, sans-serif";
const BRAND_COLOR = "#3b2412";

/** Kraft board golden brown, so the 3D model looks like the real material. */
const KRAFT = "#b8864b";

const IMAGE_EXT = /\.(png|jpe?g|svg)$/i;

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_EXT = ["pdf", "ai", "eps", "png", "jpg", "jpeg", "svg", "zip"];

const formatBytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`;

const steps = [
  { id: 1, label: "Your Product", icon: Ruler },
  { id: 2, label: "Box Preview", icon: Package },
  { id: 3, label: "Get Quote", icon: ShieldCheck },
] as const;

function Metric({
  label,
  value,
  hint,
  bar,
}: {
  label: string;
  value: string;
  hint?: string;
  bar?: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-white px-3 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-lighter">{label}</p>
      <p className="mt-1 text-sm font-bold text-dark">{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] leading-snug text-lighter">{hint}</p> : null}
      {typeof bar === "number" ? (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background-field">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${Math.max(0, Math.min(100, bar))}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function fitScoreLabel(confidence: number) {
  if (confidence >= 90) return "Excellent match";
  if (confidence >= 80) return "Strong match";
  if (confidence >= 70) return "Good match";
  return "Needs review";
}

function riskPlainLabel(label: FitResult["riskLabel"]) {
  if (label === "Elevated") return "Needs extra care";
  if (label === "Moderate") return "Normal shipping";
  return "Easy to ship";
}

export default function InstantQuote({
  defaultIndustry,
  asPage = false,
}: {
  /** Pre-selects the product / industry line when it is one we recognise. */
  defaultIndustry?: string;
  /** Render the heading as the page's h1 (used on /quote). */
  asPage?: boolean;
}) {
  const stamp = useFormClock();
  const Heading = asPage ? "h1" : "h2";
  const [step, setStep] = useState(1);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
  const cardRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [quoteRef, setQuoteRef] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  // The AI result is stored together with the specs it was computed for, so changing the
  // specs automatically makes it stale (no effect needed to clear it).
  const [aiState, setAiState] = useState<{
    key: string;
    fit: FitResult & { source?: "ai" | "rules" };
    notice: string | null;
  } | null>(null);

  const [length, setLength] = useState("0");
  const [width, setWidth] = useState("0");
  const [height, setHeight] = useState("0");
  const [weight, setWeight] = useState("0");
  const [industry, setIndustry] = useState(
    defaultIndustry && isKnownProductOrIndustry(defaultIndustry) ? defaultIndustry : "",
  );
  const fragility: Fragility = "medium";
  const [quantity, setQuantity] = useState(1000);
  const [customMode, setCustomMode] = useState(false);
  const [customQty, setCustomQty] = useState("");
  const [finish, setFinish] = useState<FinishId>("matte");

  // Customisation
  const [brandText, setBrandText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const brand = useMemo<BrandCustom | undefined>(
    () => (brandText.trim() ? { text: brandText, fontFamily: BRAND_FONT, color: BRAND_COLOR } : undefined),
    [brandText],
  );

  // First image file becomes the design printed on the 3D box.
  const artworkFile = files.find((f) => IMAGE_EXT.test(f.name)) ?? null;
  const artworkUrl = useMemo(
    () => (artworkFile ? URL.createObjectURL(artworkFile) : undefined),
    [artworkFile],
  );
  useEffect(
    () => () => {
      if (artworkUrl) URL.revokeObjectURL(artworkUrl);
    },
    [artworkUrl],
  );

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const next = [...files];
    let error: string | null = null;
    for (const f of Array.from(incoming)) {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ACCEPTED_EXT.includes(ext)) {
        error = `"${f.name}" isn't a supported file type.`;
      } else if (f.size > MAX_FILE_BYTES) {
        error = `"${f.name}" is over 10 MB.`;
      } else if (next.length >= MAX_FILES) {
        error = `You can add up to ${MAX_FILES} files.`;
      } else if (!next.some((x) => x.name === f.name && x.size === f.size)) {
        next.push(f);
      }
    }
    setFiles(next);
    setFileError(error);
  };

  // Moving to another step (or finishing) brings the top of the form back into view.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Wait for the new step to lay out first, otherwise a shorter page clamps the scroll part-way.
    const id = window.setTimeout(() => {
      const card = cardRef.current;
      if (!card) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const top = Math.max(0, card.getBoundingClientRect().top + window.scrollY - 96);
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    }, 80);
    return () => window.clearTimeout(id);
  }, [step, submitted]);

  const onDropFiles = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const l = Number(length) || 0;
  const w = Number(width) || 0;
  const h = Number(height) || 0;
  const wt = Number(weight) || 0;

  const industryLine = resolveIndustryLine(industry || "Cosmetic Boxes");

  const localFit = useMemo(
    () =>
      runFitEngine({
        length: l,
        width: w,
        height: h,
        weight: wt,
        fragility,
        industry: industryLine,
      }),
    [l, w, h, wt, fragility, industryLine],
  );

  const specKey = `${l}|${w}|${h}|${wt}|${industry}|${fragility}`;
  const aiFit = aiState && aiState.key === specKey ? aiState.fit : null;
  const aiNotice = aiState && aiState.key === specKey ? aiState.notice : null;
  const isComputing = aiLoading;
  const fit = aiFit ?? localFit;
  // Re-keying this value restarts the small "recalculated" pulse animation.
  const pulseKey = `${quantity}-${finish}-${fit.skuHint}-${fit.moq}`;

  const canGoStep2 = l > 0 && w > 0 && h > 0 && isKnownProductOrIndustry(industry);
  const sizeFit = useMemo(
    () => (industry && l > 0 && w > 0 && h > 0 ? checkProductSizeFit(industry, l, w, h, wt) : null),
    [industry, l, w, h, wt],
  );
  const typicalSize = getTypicalProductSize(industry);

  const applyTypicalSize = () => {
    if (!typicalSize) return;
    setLength(String(typicalSize.length));
    setWidth(String(typicalSize.width));
    setHeight(String(typicalSize.height));
    setWeight(String(typicalSize.weight));
  };

  const riskColor =
    fit.riskLabel === "Elevated"
      ? "text-secondary"
      : fit.riskLabel === "Moderate"
        ? "text-amber-600"
        : "text-emerald-600";

  const runAiPreview = async () => {
    if (!canGoStep2 || aiLoading) return;
    setAiLoading(true);
    const key = specKey;
    try {
      const res = await fetch("/api/packaging/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          length: l,
          width: w,
          height: h,
          weight: wt,
          industry: industryLine,
          productLabel: industry,
          fragility,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as FitResult & { source?: "ai" | "rules" };
        setAiState({
          key,
          fit: data,
          notice: data.source === "rules" ? "AI temporarily unavailable — showing catalog scoring instead." : null,
        });
      } else {
        setAiState({
          key,
          fit: { ...localFit, source: "rules" },
          notice: "Could not reach AI — showing catalog scoring instead.",
        });
      }
      setStep(2);
    } catch {
      setAiState({
        key,
        fit: { ...localFit, source: "rules" },
        notice: "Could not reach AI — showing catalog scoring instead.",
      });
      setStep(2);
    } finally {
      setAiLoading(false);
    }
  };

  const handleExactQuote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    // Contact fields come from the form itself; the rest is the customer's model + choices.
    const fd = new FormData(e.currentTarget);
    stamp(fd);
    fd.set("type", "quote");
    fd.set("source", "instant-quote");
    fd.set("productName", defaultIndustry && !isKnownProductOrIndustry(defaultIndustry) ? defaultIndustry : industry);
    fd.set("industry", industry);
    fd.set("boxType", fit.boxType);
    fd.set("moq", String(fit.moq));
    fd.set("risk", String(fit.riskLabel));
    fd.set("quantity", String(quantity));
    fd.set("length", String(l));
    fd.set("width", String(w));
    fd.set("height", String(h));
    fd.set("weight", String(wt));
    fd.set("finish", finishes.find((f) => f.id === finish)?.label ?? finish);
    fd.set("material", "Kraft board");
    fd.set("brandText", brandText.trim());
    for (const f of files) fd.append("files", f);

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; reference?: string; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setSubmitError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      if (!data.reference) {
        setSubmitError("We could not confirm your request. Please try again.");
        return;
      }
      setQuoteRef(data.reference);
      setSubmitted(true);
    } catch {
      setSubmitError("Could not reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="quote" className="section-padding bg-background-field">
      <div className="container-main">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(240px,340px)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:gap-12">
          <AnimatedSection>
            <span className="section-label text-primary">Instant packaging check</span>
            <Heading className="mt-4 font-heading text-[34px] leading-tight text-dark md:text-[42px] lg:text-[46px]">
              See how your product fits
            </Heading>
            <p className="mt-3 text-base leading-relaxed text-text md:text-lg">
              Enter your size, pick a finish, and get an AI packaging recommendation with a live
              preview. Final pricing comes only in your quote response.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Recommended box style for your product",
                "Clear size check — not a confusing calculator",
                "Quantity & finish saved with your request",
                "Pricing only after specialist review",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-text">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.25} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <div ref={cardRef} className="scroll-mt-24 overflow-hidden rounded-[28px] border border-border/80 bg-white shadow-[0_20px_60px_rgba(30,16,35,0.06)] md:rounded-[32px]">
              <div className="border-b border-border bg-background-field/50 px-5 py-4 md:px-7">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  {steps.map((s, i) => {
                    const Icon = s.icon;
                    const active = step === s.id;
                    const done = step > s.id;
                    return (
                      <div key={s.id} className="flex items-center gap-2 md:gap-3">
                        <div
                          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] ${
                            active
                              ? "bg-primary text-white"
                              : done
                                ? "bg-primary/10 text-primary"
                                : "bg-white text-lighter"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                          <span className="hidden sm:inline">{s.label}</span>
                          <span className="sm:hidden">{s.id}</span>
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`h-px w-4 md:w-8 ${done ? "bg-primary/40" : "bg-border"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 md:p-7 lg:p-8">
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-heading text-2xl text-dark">Product specifications</h3>
                      <p className="mt-1 text-sm text-lighter">
                        Enter product dimensions in inches and weight in kilograms.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {(
                        [
                          ["Length (in)", length, setLength],
                          ["Width (in)", width, setWidth],
                          ["Height (in)", height, setHeight],
                          ["Weight (kg)", weight, setWeight],
                        ] as const
                      ).map(([label, value, setter], idx) => (
                        <div key={label}>
                          <label className="mb-1.5 block text-[13px] font-semibold text-dark">
                            {label} {idx < 3 && <span className="text-secondary">*</span>}
                          </label>
                          <input
                            type="number"
                            min={idx === 3 ? 0 : 0.1}
                            step="0.1"
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            className={fieldClass}
                          />
                        </div>
                      ))}
                    </div>

                    {sizeFit && sizeFit.status !== "ok" ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                        <p className="font-semibold text-amber-900">Size check for {industry}</p>
                        <p className="mt-1 leading-relaxed text-amber-900/90">{sizeFit.message}</p>
                        {typicalSize ? (
                          <button
                            type="button"
                            onClick={applyTypicalSize}
                            className="mt-2.5 inline-flex items-center rounded-full border border-amber-300 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-amber-900 transition hover:border-amber-400"
                          >
                            Use typical size {typicalSize.length}×{typicalSize.width}×
                            {typicalSize.height}&quot; · {typicalSize.weight} kg
                          </button>
                        ) : null}
                      </div>
                    ) : sizeFit?.status === "ok" ? (
                      <p className="text-[12px] text-emerald-700">{sizeFit.message}</p>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2 md:items-start">
                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold text-dark">
                        Product / industry line <span className="text-secondary">*</span>
                      </label>
                      <IndustryCombobox value={industry} onChange={setIndustry} />
                    </div>

                    <div>
                      <label htmlFor="brand-text" className="mb-1.5 block text-[13px] font-semibold text-dark">
                        Text on box <span className="font-normal text-lighter">(optional)</span>
                      </label>
                      <input
                        id="brand-text"
                        value={brandText}
                        onChange={(e) => setBrandText(e.target.value)}
                        maxLength={40}
                        className={fieldClass}
                        placeholder="e.g. Luna Skincare"
                      />
                      <p className="mt-1 text-[12px] text-lighter">Shown on the live 3D box in the next step.</p>
                    </div>
                    </div>

                    <div>
                      <p className="mb-1 text-[12px] font-semibold text-dark">
                        Upload your design <span className="font-normal text-lighter">(optional)</span>
                      </p>
                      <label
                        htmlFor="design-upload"
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDropFiles}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-3 py-2 transition ${
                          dragging
                            ? "border-primary bg-primary/5"
                            : "border-border bg-background-field/50 hover:border-primary/40"
                        }`}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Upload className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className="block text-[13px] font-semibold text-dark">
                            Drop artwork or <span className="text-primary underline">browse</span>
                          </span>
                          <span className="block text-[11px] text-lighter">
                            PDF, AI, EPS, PNG, JPG, SVG, ZIP · max {MAX_FILES} files · 10 MB each
                          </span>
                        </span>
                      </label>
                      <input
                        id="design-upload"
                        type="file"
                        multiple
                        accept={ACCEPTED_EXT.map((e) => `.${e}`).join(",")}
                        className="sr-only"
                        onChange={(e) => {
                          addFiles(e.target.files);
                          e.target.value = "";
                        }}
                      />
                      {fileError && (
                        <p role="alert" className="mt-2 text-[13px] font-semibold text-secondary">
                          {fileError}
                        </p>
                      )}
                      {files.length > 0 && !artworkFile && (
                        <p className="mt-2 text-[12px] text-lighter">
                          Your files are attached for our team. The live 3D box shows PNG, JPG or SVG designs.
                        </p>
                      )}
                      {artworkFile && (
                        <p className="mt-2 text-[12px] font-semibold text-primary">
                          “{artworkFile.name}” will be shown on your 3D box in the next step.
                        </p>
                      )}
                      {files.length > 0 && (
                        <ul className="mt-2 space-y-1.5">
                          {files.map((f) => (
                            <li
                              key={`${f.name}-${f.size}`}
                              className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5"
                            >
                              <FileText className="h-4 w-4 shrink-0 text-primary" />
                              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-dark">
                                {f.name}
                              </span>
                              <span className="shrink-0 text-[12px] text-lighter">{formatBytes(f.size)}</span>
                              <button
                                type="button"
                                aria-label={`Remove ${f.name}`}
                                onClick={() => setFiles((prev) => prev.filter((x) => x !== f))}
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-lighter transition hover:bg-background-field hover:text-dark"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Live preview strip even on step 1 */}
                    <div className="rounded-2xl border border-dashed border-primary/25 bg-primary/[0.03] p-4">
                      {!canGoStep2 ? (
                        <p className="flex items-center gap-1.5 text-sm text-text">
                          <Activity className="h-4 w-4 text-primary" />
                          Choose a product and enter its size to see your box preview.
                        </p>
                      ) : (
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-dark">
                          <Activity className="h-4 w-4 text-primary" />
                          Model preview
                        </span>
                        <span className="text-text">{fit.boxType}</span>
                        <span className="text-lighter">·</span>
                        <span className="text-text">
                          From {fit.moq.toLocaleString()} pcs
                        </span>
                        <span className="text-lighter">·</span>
                        <span className={riskColor}>{riskPlainLabel(fit.riskLabel)}</span>
                      </div>
                      )}
                    </div>

                    <div className="flex justify-end border-t border-border pt-5">
                      <button
                        type="button"
                        disabled={!canGoStep2 || aiLoading}
                        onClick={runAiPreview}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {aiLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                            AI analyzing…
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                            Run my box preview
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-heading text-2xl text-dark">Your packaging preview</h3>
                        <p className="mt-1 text-sm text-lighter">
                          {l}&quot; × {w}&quot; × {h}&quot; · {wt} kg · {industry}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] ${
                            aiFit?.source === "ai"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-border bg-white text-lighter"
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {aiFit?.source === "ai" ? "AI recommendation" : "Catalog scoring"}
                        </div>
                        <div
                          key={pulseKey}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] transition ${
                            isComputing
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "animate-[pulse_0.7s_ease-out_1] border-border bg-white text-lighter"
                          }`}
                        >
                          <Gauge className="h-3.5 w-3.5" />
                          {isComputing ? "Updating…" : "Up to date"}
                        </div>
                      </div>
                    </div>

                    {aiNotice ? (
                      <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                        {aiNotice}
                      </p>
                    ) : null}

                    {sizeFit && sizeFit.status !== "ok" ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
                        <p className="font-semibold">Size may not match a single {industry}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-amber-900/90">
                          {sizeFit.message}
                        </p>
                        {typicalSize ? (
                          <button
                            type="button"
                            onClick={() => {
                              applyTypicalSize();
                              setStep(1);
                            }}
                            className="mt-2 text-[12px] font-bold text-primary underline-offset-2 hover:underline"
                          >
                            Fix size → use typical {typicalSize.length}×{typicalSize.width}×
                            {typicalSize.height}&quot;
                          </button>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <Metric
                        label="Box style"
                        value={fit.boxType}
                        hint="Best match for your product"
                      />
                      <Metric
                        label="Inside size"
                        value={`${fit.intL} × ${fit.intW} × ${fit.intH} in`}
                        hint="Length × width × height inside"
                      />
                      <Metric
                        label="Your product"
                        value={`${l} × ${w} × ${h} in`}
                        hint="Size you entered"
                      />
                      <Metric
                        label="Fit match"
                        value={fitScoreLabel(fit.confidence)}
                        hint={`${fit.confidence}% confidence`}
                        bar={fit.confidence}
                      />
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-border bg-background-field p-5">
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                              <Box className="h-5 w-5 text-primary" strokeWidth={2} />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                                What we recommend
                              </p>
                              <h4 className="mt-1 font-heading text-xl text-dark">{fit.boxType}</h4>
                              <p className="mt-1 text-[11px] font-semibold text-lighter">
                                Scored from {fit.scoredFrom} packaging formats · SKU {fit.skuHint}
                                {aiFit?.source === "ai" ? " · GPT-4o-mini" : ""}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            {fit.why.map((line) => (
                              <div key={line} className="flex items-start gap-2 text-sm text-text">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.25} />
                                <span>{line}</span>
                              </div>
                            ))}
                          </div>

                          <dl className="mt-5 space-y-3 border-t border-border/80 pt-4 text-sm">
                            <div>
                              <dt className="font-semibold text-dark">Made from</dt>
                              <dd className="mt-0.5 text-text">{fit.material}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-dark">Board / film type</dt>
                              <dd className="mt-0.5 text-text">{fit.fluteOrFilm}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-dark">Product protection</dt>
                              <dd className="mt-0.5 text-text">{fit.inserts}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-dark">Printing</dt>
                              <dd className="mt-0.5 text-text">{fit.printReady}</dd>
                            </div>
                            <div>
                              <dt className="font-semibold text-dark">Shipping style</dt>
                              <dd className="mt-0.5 text-text">{fit.shipClass}</dd>
                            </div>
                          </dl>

                          {fit.alternatives.length > 0 && (
                            <div className="mt-5 border-t border-border/80 pt-4">
                              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-lighter">
                                Strong alternatives
                              </p>
                              <div className="mt-3 space-y-2">
                                {fit.alternatives.map((alt) => (
                                  <div
                                    key={alt.id}
                                    className="rounded-xl border border-border bg-white px-3 py-2.5"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-sm font-semibold text-dark">{alt.name}</p>
                                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                        {alt.score}/100
                                      </span>
                                    </div>
                                    {alt.why[0] ? (
                                      <p className="mt-1 text-[11px] leading-snug text-lighter">{alt.why[0]}</p>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>

                      <div>
                        <BoxPreview3D
                          length={l}
                          width={w}
                          height={h}
                          finish={finish}
                          boxType={fit.boxType}
                          styleId={fit.styleId}
                          industry={industry}
                          brand={brand}
                          baseColor={KRAFT}
                          artworkUrl={artworkUrl}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-[13px] font-semibold text-dark">
                          How many do you need?
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {quantities.map((q) => (
                            <button
                              key={q}
                              type="button"
                              onClick={() => {
                                setQuantity(q);
                                setCustomMode(false);
                              }}
                              className={`rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                                !customMode && quantity === q
                                  ? "bg-primary text-white"
                                  : "border border-border bg-white text-text hover:border-primary/30"
                              }`}
                            >
                              {q.toLocaleString()}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setCustomMode(true);
                              setCustomQty(String(quantity));
                            }}
                            className={`rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                              customMode
                                ? "bg-primary text-white"
                                : "border border-dashed border-primary/40 bg-white text-primary hover:border-primary"
                            }`}
                          >
                            Custom
                          </button>
                        </div>
                        {customMode && (
                          <div className="mt-3">
                            <input
                              type="number"
                              inputMode="numeric"
                              min={1}
                              max={10000000}
                              step={1}
                              autoFocus
                              value={customQty}
                              onChange={(e) => {
                                const v = e.target.value;
                                setCustomQty(v);
                                const n = Math.floor(Number(v));
                                if (n >= 1) setQuantity(Math.min(n, 10_000_000));
                              }}
                              placeholder="Enter your quantity, e.g. 3,500"
                              aria-label="Custom quantity"
                              className={fieldClass}
                            />
                            <p className="mt-1.5 text-[12px] text-lighter">Any amount from 1 up to 10,000,000 pieces.</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="mb-2 block text-[13px] font-semibold text-dark">
                          Finish look
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {finishes.map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setFinish(f.id)}
                              className={`rounded-xl border px-3 py-2.5 text-left text-[12px] font-semibold transition ${
                                finish === f.id
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-border text-text hover:border-primary/30"
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm font-semibold text-text transition hover:text-primary"
                      >
                        ← Adjust specs
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-primary/90"
                      >
                        Request Exact Quote
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && !submitted && (
                  <form onSubmit={handleExactQuote} className="space-y-5">
                    <div>
                      <h3 className="font-heading text-2xl text-dark">Exact quote request</h3>
                      <p className="mt-1 text-sm text-lighter">
                        Specialist response within 1 business day with locked commercial terms.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-border bg-background-field p-4 text-sm text-text">
                      <div className="font-semibold text-dark">{fit.boxType}</div>
                      <div className="mt-1">
                        {quantity.toLocaleString()} units ·{" "}
                        {finishes.find((f) => f.id === finish)?.label} ·{" "}
                        {riskPlainLabel(fit.riskLabel)} · from {fit.moq.toLocaleString()} pcs
                      </div>
                      <p className="mt-2 text-[13px]">
                        {brandText.trim() ? `Text on box: “${brandText.trim()}”` : "No text on box"}
                      </p>
                      {files.length > 0 && (
                        <p className="mt-2 text-[13px]">
                          Design files: {files.map((f) => f.name).join(", ")}
                        </p>
                      )}
                      <p className="mt-2 text-[12px] text-lighter">
                        Your quote response will include final pricing.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[13px] font-semibold text-dark">Needed by</label>
                        <input
                          name="neededBy"
                          type="date"
                          min={today}
                          className={`${fieldClass} cursor-pointer`}
                          onClick={(e) => {
                            // Open the calendar from anywhere in the field, not just the small icon.
                            try {
                              e.currentTarget.showPicker();
                            } catch {
                              /* older browsers: the native control still works */
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-semibold text-dark">
                          Ship to (city / ZIP / country)
                        </label>
                        <input name="shipTo" type="text" className={fieldClass} placeholder="e.g. Brooklyn, NY 11201, USA" />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[13px] font-semibold text-dark">
                          Full name <span className="text-secondary">*</span>
                        </label>
                        <input required name="name" type="text" className={fieldClass} placeholder="Jane Cooper" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-semibold text-dark">
                          Work email <span className="text-secondary">*</span>
                        </label>
                        <input
                          required
                          name="email"
                          type="email"
                          className={fieldClass}
                          placeholder="jane@company.com"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-semibold text-dark">
                          Company
                        </label>
                        <input name="company" type="text" className={fieldClass} placeholder="Brand / company" />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[13px] font-semibold text-dark">
                          Phone
                        </label>
                        <input name="phone" type="tel" className={fieldClass} placeholder="+1 (...)" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold text-dark">
                        Notes / artwork status
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        defaultValue={
                          defaultIndustry && !isKnownProductOrIndustry(defaultIndustry)
                            ? `Interested in: ${defaultIndustry}. `
                            : undefined
                        }
                        className={`${fieldClass} resize-y`}
                        placeholder="Print colors, finish preferences, ship-by date, artwork readiness..."
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-sm font-semibold text-text transition hover:text-primary"
                      >
                        ← Back to live model
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {submitting ? (
                          <>
                            Sending <Loader2 className="h-4 w-4 animate-spin" />
                          </>
                        ) : (
                          <>
                            Submit Quote Request
                            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                          </>
                        )}
                      </button>
                    </div>
                    {submitError && (
                      <p role="alert" className="text-sm font-semibold text-secondary">
                        {submitError}
                      </p>
                    )}
                  </form>
                )}

                {step === 3 && submitted && (
                  <div className="flex flex-col items-center py-8 text-center md:py-12">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-7 w-7 text-primary" strokeWidth={2} />
                    </div>
                    <h3 className="mt-5 font-heading text-2xl text-dark md:text-3xl">
                      Quote ticket opened
                    </h3>
                    <p className="mt-3 rounded-full border border-border bg-background-field px-4 py-2 font-mono text-sm font-bold text-primary">
                      {quoteRef}
                    </p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-text md:text-base">
                      Your packaging specialist will attach commercial pricing to this reference,
                      including board/film confirmation and freight options.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setQuoteRef("");
                        setStep(1);
                      }}
                      className="mt-7 text-sm font-bold uppercase tracking-[0.08em] text-primary transition hover:opacity-80"
                    >
                      Start another model
                    </button>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
