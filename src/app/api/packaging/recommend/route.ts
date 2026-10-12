import { recommendPackagingAI } from "@/lib/aiPackagingRecommend";
import type { Fragility } from "@/lib/packagingEstimator";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      length?: number;
      width?: number;
      height?: number;
      weight?: number;
      fragility?: Fragility;
      industry?: string;
      productLabel?: string;
    };

    const length = Number(body.length) || 0;
    const width = Number(body.width) || 0;
    const height = Number(body.height) || 0;
    const weight = Number(body.weight) || 0;
    const industry = String(body.industry ?? "Other").trim() || "Other";
    const productLabel = String(body.productLabel ?? industry).trim() || industry;
    const fragility: Fragility =
      body.fragility === "low" || body.fragility === "high" || body.fragility === "medium"
        ? body.fragility
        : "medium";

    if (length <= 0 || width <= 0 || height <= 0) {
      return NextResponse.json(
        { error: "Valid length, width, and height are required." },
        { status: 400 },
      );
    }

    if (length > 120 || width > 120 || height > 120 || weight > 100) {
      return NextResponse.json(
        { error: "Dimensions or weight are outside supported range." },
        { status: 400 },
      );
    }

    const result = await recommendPackagingAI({
      length,
      width,
      height,
      weight,
      industry,
      productLabel,
      fragility,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json({ error: "Recommendation failed." }, { status: 500 });
  }
}
