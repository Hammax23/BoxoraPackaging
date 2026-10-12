"use client";

import {
  checkProductSizeFit,
  getTypicalProductSize,
  isKnownProductOrIndustry,
  resolveIndustryLine,
} from "@/lib/boxoraIndustries";
import BoxPreview3D from "@/components/BoxPreview3D";
import IndustryCombobox from "@/components/IndustryCombobox";
import AnimatedSection from "@/components/ui/AnimatedSection";
import {
  makeQuoteRef,
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
  Sparkles,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";

const fieldClass =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15";

const finishes = [
  { id: "matte" as const, label: "Matte Laminate" },
  { id: "gloss" as const, label: "Gloss Laminate" },
  { id: "soft" as const, label: "Soft-Touch" },
  { id: "foil" as const, label: "Foil Accent" },
];

const quantities = [500, 1000, 2500, 5000, 10000, 25000];

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

export default function InstantQuote() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [quoteRef, setQuoteRef] = useState("");
  const [calcFlash, setCalcFlash] = useState(false);
  const [isComputing, setIsComputing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFit, setAiFit] = useState<(FitResult & { source?: "ai" | "rules" }) | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const [length, setLength] = useState("8");
  const [width, setWidth] = useState("5");
  const [height, setHeight] = useState("3");
  const [weight, setWeight] = useState("0.8");
  const [industry, setIndustry] = useState("Cosmetic Boxes");
  const fragility: Fragility = "medium";
  const [quantity, setQuantity] = useState(1000);
  const [finish, setFinish] = useState<FinishId>("matte");

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

  const fit = aiFit ?? localFit;

  // Live recalc pulse when model inputs change
  useEffect(() => {
    if (step !== 2) return;
    setIsComputing(true);
    setCalcFlash(true);
    const t1 = setTimeout(() => setIsComputing(false), 280);
    const t2 = setTimeout(() => setCalcFlash(false), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [quantity, finish, fit.skuHint, fit.moq, step]);

  // Specs changed → clear cached AI result so next preview re-runs
  useEffect(() => {
    setAiFit(null);
    setAiNotice(null);
  }, [l, w, h, wt, industry, fragility]);

  const canGoStep2 = l > 0 && w > 0 && h > 0 && isKnownProductOrIndustry(industry);
  const sizeFit = useMemo(
    () => checkProductSizeFit(industry, l, w, h, wt),
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
    setIsComputing(true);
    setAiNotice(null);
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
        setAiFit(data);
        if (data.source === "rules") {
          setAiNotice("AI temporarily unavailable — showing catalog scoring instead.");
        }
      } else {
        setAiFit({ ...localFit, source: "rules" });
        setAiNotice("Could not reach AI — showing catalog scoring instead.");
      }
      setStep(2);
    } catch {
      setAiFit({ ...localFit, source: "rules" });
      setAiNotice("Could not reach AI — showing catalog scoring instead.");
      setStep(2);
    } finally {
      setAiLoading(false);
      setIsComputing(false);
    }
  };

  const handleExactQuote = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ref = makeQuoteRef();
    setQuoteRef(ref);
    setSubmitted(true);
  };

  return (
    <section id="quote" className="section-padding bg-background-field !pb-10 md:!pb-14">
      <div className="container-main">
        <div className="grid gap-10 lg:grid-cols-[minmax(240px,340px)_1fr] lg:items-start lg:gap-10 xl:gap-12">
          <AnimatedSection>
            <span className="section-label text-primary">Instant packaging check</span>
            <h2 className="mt-4 font-heading text-[34px] leading-tight text-dark md:text-[42px] lg:text-[46px]">
              See how your product fits
            </h2>
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
            <div className="overflow-hidden rounded-[28px] border border-border/80 bg-white shadow-[0_20px_60px_rgba(30,16,35,0.06)] md:rounded-[32px]">
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

                    <div>
                      <label className="mb-1.5 block text-[13px] font-semibold text-dark">
                        Product / industry line <span className="text-secondary">*</span>
                      </label>
                      <IndustryCombobox value={industry} onChange={setIndustry} />
                    </div>

                    {/* Live preview strip even on step 1 */}
                    <div className="rounded-2xl border border-dashed border-primary/25 bg-primary/[0.03] p-4">
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
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] transition ${
                            isComputing || calcFlash
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border bg-white text-lighter"
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
                              onClick={() => setQuantity(q)}
                              className={`rounded-full px-3.5 py-2 text-[12px] font-bold transition ${
                                quantity === q
                                  ? "bg-primary text-white"
                                  : "border border-border bg-white text-text hover:border-primary/30"
                              }`}
                            >
                              {q.toLocaleString()}
                            </button>
                          ))}
                        </div>
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
                      <p className="mt-2 text-[12px] text-lighter">
                        Your quote response will include final pricing.
                      </p>
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
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-primary/90"
                      >
                        Submit Quote Request
                        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                      </button>
                    </div>
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
