import OpenAI from "openai";
import { INDUSTRY_PLAYBOOK, toIndustryKey } from "@/lib/boxoraIndustries";
import {
  PACKAGING_CATALOG,
  runFitEngine,
  type FitResult,
  type Fragility,
  type RankedStyle,
} from "@/lib/packagingEstimator";

export type RecommendInput = {
  length: number;
  width: number;
  height: number;
  weight: number;
  fragility: Fragility;
  industry: string;
  /** Optional specific product target e.g. "Soap Boxes" */
  productLabel?: string;
};

export type RecommendResult = FitResult & {
  source: "ai" | "rules";
};

type AiPick = {
  id: string;
  score: number;
  why: string[];
};

type AiResponse = {
  primary?: AiPick;
  alternatives?: AiPick[];
};

function getClient() {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

function isCatalogId(id: string | undefined): id is string {
  return Boolean(id && PACKAGING_CATALOG.some((c) => c.id === id));
}

function clampScore(score: number | undefined, fallback: number) {
  const n = typeof score === "number" && Number.isFinite(score) ? score : fallback;
  return Math.min(98, Math.max(45, Math.round(n)));
}

function buildSavingsTips(unitBase: number, blankAreaIn2: number, alternatives: RankedStyle[]) {
  const qtyTip =
    unitBase > 2
      ? "Rigid formats: plan for MOQ 250–500 for efficient tooling setup."
      : unitBase < 0.7
        ? "Flexible formats: 2.5k–5k runs are a common production step-up."
        : "Mailer/shipper formats: 1k+ runs are typical for board procurement.";

  return [
    qtyTip,
    blankAreaIn2 > 900
      ? "Reduce outer dimensions by 0.25–0.5\" on non-critical axes to cut blank area."
      : "Dimensions are efficient for material utilization.",
    alternatives[0]
      ? `Also consider ${alternatives[0].name} (score ${alternatives[0].score}) if channel priorities change.`
      : "Current protection level is right-sized for stated fragility.",
  ];
}

function applyCatalogPick(
  base: FitResult,
  pickId: string,
  score: number,
  why: string[],
  alternatives: RankedStyle[],
): FitResult {
  const style = PACKAGING_CATALOG.find((c) => c.id === pickId);
  if (!style) return base;

  const volume = base.intL * base.intW * base.intH;
  let unitBase = style.unitBase + volume * 0.00025 + (base.riskScore / 100) * 0.05;
  if (base.riskLabel === "Elevated") unitBase *= 1.1;

  let inserts = style.inserts;
  if (base.riskLabel === "Elevated") {
    inserts = "Engineered protective insert + corner crush protection";
  }

  const cleanWhy = why.map((w) => w.trim()).filter(Boolean).slice(0, 3);
  const unit = +unitBase.toFixed(3);

  return {
    ...base,
    styleId: style.id,
    family: style.family,
    boxType: style.name,
    skuHint: style.skuHint,
    material: style.material,
    inserts,
    fluteOrFilm: style.fluteOrFilm,
    printReady: style.printReady,
    shipClass: style.shipClassDefault,
    moq: style.moq,
    unitBase: unit,
    confidence: clampScore(score, 85),
    reason: cleanWhy[0] ?? base.reason,
    why: cleanWhy.length > 0 ? cleanWhy : base.why,
    alternatives,
    savingsTips: buildSavingsTips(unit, base.blankAreaIn2, alternatives),
    scoredFrom: PACKAGING_CATALOG.length,
  };
}

function toRanked(pick: AiPick): RankedStyle | null {
  if (!isCatalogId(pick.id)) return null;
  const style = PACKAGING_CATALOG.find((c) => c.id === pick.id)!;
  return {
    id: style.id,
    name: style.name,
    family: style.family,
    skuHint: style.skuHint,
    score: clampScore(pick.score, 70),
    why: (pick.why ?? []).map((w) => w.trim()).filter(Boolean).slice(0, 2),
  };
}

/**
 * AI packaging recommender (gpt-4o-mini) constrained to PACKAGING_CATALOG.
 * Falls back to the local scoring engine if the key is missing or the API fails.
 */
export async function recommendPackagingAI(input: RecommendInput): Promise<RecommendResult> {
  const base = runFitEngine(input);
  const client = getClient();

  if (!client) {
    return { ...base, source: "rules" };
  }

  const catalogLite = PACKAGING_CATALOG.map((c) => ({
    id: c.id,
    name: c.name,
    family: c.family,
    industries: c.industries,
    tags: c.tags,
    volMin: c.volMin,
    volMax: c.volMax,
    maxWeight: c.maxWeight,
    aspect: c.aspect,
    fragilityOk: c.fragilityOk,
  }));

  const volume = input.length * input.width * input.height;
  const industryKey = toIndustryKey(input.industry);
  const playbook = INDUSTRY_PLAYBOOK[industryKey];

  try {
    const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Boxora's senior packaging engineer advising paying brand clients.
Wrong recommendations damage trust — be precise and conservative.

Recommend formats ONLY from the provided catalog ids — never invent ids.

Return strict JSON:
{
  "primary": { "id": "<catalog id>", "score": 0-100, "why": ["...", "...", "..."] },
  "alternatives": [
    { "id": "<catalog id>", "score": 0-100, "why": ["...", "..."] }
  ]
}

Hard rules:
- Exactly 1 primary + 2 or 3 alternatives
- Scores MUST be spread (example: 91, 80, 72, 64) — never clustered at 95–99
- Primary usually 82–93
- Obey the industry playbook prefer/avoid lists when volume & weight allow
- Prefer industry fit, volume window, weight limit, aspect, fragility
- why lines: short, specific, client-friendly (max ~12 words), mention industry when relevant
- Never recommend a flexible pouch for electronics/automotive parts
- Never recommend heavy shippers for small cosmetic / gift retail units when a carton/rigid fits`,
        },
        {
          role: "user",
          content: JSON.stringify({
            product: {
              lengthIn: input.length,
              widthIn: input.width,
              heightIn: input.height,
              weightKg: input.weight,
              volumeIn3: +volume.toFixed(1),
              industry: input.industry,
              productLabel: input.productLabel ?? input.industry,
              industryKey,
              fragility: input.fragility,
            },
            playbook,
            catalog: catalogLite,
          }),
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed: AiResponse;
    try {
      parsed = JSON.parse(raw) as AiResponse;
    } catch {
      console.error("AI packaging recommend: invalid JSON", raw);
      return { ...base, source: "rules" };
    }

    if (!isCatalogId(parsed.primary?.id)) {
      return { ...base, source: "rules" };
    }

    const primaryId = parsed.primary!.id;
    const primaryScore = clampScore(parsed.primary!.score, 88);
    const primaryWhy = parsed.primary!.why ?? [];

    const alts = (parsed.alternatives ?? [])
      .map(toRanked)
      .filter((a): a is RankedStyle => a != null && a.id !== primaryId)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((a, i) => ({
        ...a,
        score: Math.min(a.score, primaryScore - 3 - i * 4),
      }));

    const result = applyCatalogPick(base, primaryId, primaryScore, primaryWhy, alts);
    return { ...result, source: "ai" };
  } catch (err) {
    console.error("AI packaging recommend failed, using rules:", err);
    return { ...base, source: "rules" };
  }
}
