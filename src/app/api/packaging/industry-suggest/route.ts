import {
  BOXORA_INDUSTRIES,
  BOXORA_PRODUCT_TARGETS,
  suggestIndustriesLocal,
  type BoxoraIndustry,
  type IndustrySuggestion,
} from "@/lib/boxoraIndustries";
import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getClient() {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

const PRODUCT_LABELS = BOXORA_PRODUCT_TARGETS.map((p) => p.label);

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { query?: string };
    const query = String(body.query ?? "").trim().slice(0, 80);

    if (query.length < 2) {
      return NextResponse.json({
        suggestions: suggestIndustriesLocal("", 8),
        source: "local" as const,
      });
    }

    const local = suggestIndustriesLocal(query, 6);
    const strongLocal = local.length > 0 && local[0].score >= 78;

    if (strongLocal || !getClient()) {
      return NextResponse.json({
        suggestions: local,
        source: "local" as const,
      });
    }

    try {
      const client = getClient()!;
      const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
      const completion = await client.chat.completions.create({
        model,
        temperature: 0,
        max_tokens: 280,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You map free-text product descriptions to Boxora packaging targets.
Prefer specific PRODUCT labels when possible (e.g. "Soap Boxes"), otherwise INDUSTRY lines.

Return JSON:
{ "matches": [ { "label": "<exact name>", "kind": "product"|"industry", "reason": "<max 10 words>" } ] }

Allowed product labels:
${PRODUCT_LABELS.join(" | ")}

Allowed industry labels:
${BOXORA_INDUSTRIES.join(" | ")}

Rules:
- Use ONLY exact names from the lists above
- Return 1–4 matches, best first
- Prefer product over industry when the query names a SKU/product (soap, lipstick, coffee bag…)
- Never invent names`,
          },
          {
            role: "user",
            content: JSON.stringify({
              query,
              localHints: local.map((s) => ({ label: s.label, kind: s.kind })),
            }),
          },
        ],
      });

      const raw = completion.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as {
        matches?: { label?: string; kind?: string; reason?: string }[];
      };

      const aiRows: IndustrySuggestion[] = [];
      for (const m of parsed.matches ?? []) {
        const label = m.label?.trim();
        if (!label) continue;

        const product = BOXORA_PRODUCT_TARGETS.find((p) => p.label === label);
        if (product) {
          aiRows.push({
            label: product.label,
            industry: product.industry,
            score: 92 - aiRows.length * 5,
            reason: (m.reason ?? `Product target · ${product.industry}`).slice(0, 80),
            source: "ai",
            kind: "product",
          });
          continue;
        }

        if ((BOXORA_INDUSTRIES as readonly string[]).includes(label)) {
          aiRows.push({
            label,
            industry: label as BoxoraIndustry,
            score: 86 - aiRows.length * 5,
            reason: (m.reason ?? "Industry line").slice(0, 80),
            source: "ai",
            kind: "industry",
          });
        }
      }

      const seen = new Set<string>();
      const merged: IndustrySuggestion[] = [];
      for (const row of [...aiRows, ...local]) {
        if (seen.has(row.label)) continue;
        seen.add(row.label);
        merged.push(row);
        if (merged.length >= 8) break;
      }

      return NextResponse.json({
        suggestions: merged.length > 0 ? merged : local,
        source: aiRows.length > 0 ? ("ai" as const) : ("local" as const),
      });
    } catch (err) {
      console.error("Industry AI suggest failed:", err);
      return NextResponse.json({ suggestions: local, source: "local" as const });
    }
  } catch (error) {
    console.error("Industry suggest API error:", error);
    return NextResponse.json({ error: "Suggestion failed." }, { status: 500 });
  }
}
