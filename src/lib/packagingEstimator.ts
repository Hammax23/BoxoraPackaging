import { INDUSTRY_PLAYBOOK, toIndustryKey } from "@/lib/boxoraIndustries";

export type Fragility = "low" | "medium" | "high";
export type FinishId = "matte" | "gloss" | "soft" | "foil";

export type PackagingFamily =
  | "flexible-pouch"
  | "flexible-bag"
  | "folding-carton"
  | "rigid-box"
  | "mailer"
  | "shipper"
  | "hybrid";

export type CatalogStyle = {
  id: string;
  name: string;
  family: PackagingFamily;
  skuHint: string;
  material: string;
  inserts: string;
  fluteOrFilm: string;
  printReady: string;
  shipClassDefault: string;
  moq: number;
  unitBase: number;
  /** Industries this style commonly wins for */
  industries: string[];
  /** Soft tags for matching logic */
  tags: string[];
  /** Ideal volume range in cubic inches */
  volMin: number;
  volMax: number;
  /** Ideal max weight kg */
  maxWeight: number;
  /** Preferred aspect: tall | wide | cube | flat | any */
  aspect: "tall" | "wide" | "cube" | "flat" | "any";
  fragilityOk: Fragility[];
};

export type RankedStyle = {
  id: string;
  name: string;
  family: PackagingFamily;
  skuHint: string;
  score: number;
  why: string[];
};

export type FitResult = {
  /** Catalog style id — drives Live Preview mesh selection */
  styleId: string;
  family: PackagingFamily;
  boxType: string;
  skuHint: string;
  material: string;
  inserts: string;
  fluteOrFilm: string;
  printReady: string;
  reason: string;
  why: string[];
  confidence: number;
  riskScore: number;
  riskLabel: "Low" | "Moderate" | "Elevated";
  moq: number;
  intL: number;
  intW: number;
  intH: number;
  internalCapacityIn3: number;
  blankAreaIn2: number;
  shipClass: string;
  unitBase: number;
  savingsTips: string[];
  alternatives: RankedStyle[];
  scoredFrom: number;
};

const finishPremium: Record<FinishId, number> = {
  matte: 0,
  gloss: 0.045,
  soft: 0.125,
  foil: 0.185,
};

export function getFinishPremium(id: FinishId) {
  return finishPremium[id];
}

/** Enterprise packaging catalog — scored dynamically, not a fixed if/else list. */
export const PACKAGING_CATALOG: CatalogStyle[] = [
  {
    id: "standup-flat-bottom",
    name: "Stand-Up / Flat Bottom Pouch",
    family: "flexible-pouch",
    skuHint: "PK-SUP",
    material: "Multi-layer barrier laminate · food-contact compliant",
    inserts: "Optional one-way degassing valve",
    fluteOrFilm: "PET/AL/PE or recyclable mono options",
    printReady: "Reverse print + laminate · 150–200 lpi",
    shipClassDefault: "Parcel · standard",
    moq: 1000,
    unitBase: 0.42,
    industries: ["coffee", "food", "petcare", "sweets", "sports"],
    tags: ["powder", "granule", "retail-shelf", "resealable", "barrier"],
    volMin: 8,
    volMax: 450,
    maxWeight: 2.2,
    aspect: "tall",
    fragilityOk: ["low", "medium"],
  },
  {
    id: "standup-pouch",
    name: "Stand-Up Pouch (Doypack)",
    family: "flexible-pouch",
    skuHint: "PK-DOY",
    material: "High-barrier film · FDA / EU food-safe pathway",
    inserts: "Zipper + tear notch",
    fluteOrFilm: "Barrier laminate stack",
    printReady: "Flexo / digital · food-safe inks",
    shipClassDefault: "Parcel · light",
    moq: 1000,
    unitBase: 0.36,
    industries: ["food", "coffee", "petcare", "sweets", "cosmetic"],
    tags: ["powder", "snack", "retail-shelf", "resealable"],
    volMin: 5,
    volMax: 280,
    maxWeight: 1.5,
    aspect: "tall",
    fragilityOk: ["low", "medium"],
  },
  {
    id: "side-gusset-bag",
    name: "Side Gusset / Flat Bottom Bag",
    family: "flexible-bag",
    skuHint: "PK-SGB",
    material: "High-barrier film · food-contact compliant",
    inserts: "Tin-tie / valve / zipper options",
    fluteOrFilm: "Barrier laminate or kraft barrier",
    printReady: "Flexo / gravure · retail graphics",
    shipClassDefault: "Parcel · standard",
    moq: 1000,
    unitBase: 0.4,
    industries: ["coffee", "food", "petcare", "sweets"],
    tags: ["powder", "bulk", "retail-shelf", "barrier"],
    volMin: 40,
    volMax: 900,
    maxWeight: 5,
    aspect: "tall",
    fragilityOk: ["low", "medium"],
  },
  {
    id: "quad-seal-bag",
    name: "Quad-Seal / Block Bottom Bag",
    family: "flexible-bag",
    skuHint: "PK-QSB",
    material: "Multi-layer barrier film · premium shelf presence",
    inserts: "Optional degassing valve + zipper",
    fluteOrFilm: "PET/MET-PET/PE or paper laminate",
    printReady: "High-end reverse print · premium brands",
    shipClassDefault: "Parcel · standard",
    moq: 1500,
    unitBase: 0.48,
    industries: ["coffee", "food", "petcare", "sweets"],
    tags: ["premium", "powder", "retail-shelf", "barrier"],
    volMin: 30,
    volMax: 700,
    maxWeight: 3.5,
    aspect: "tall",
    fragilityOk: ["low", "medium"],
  },
  {
    id: "sachet-stick",
    name: "Sachet / Stick Pack",
    family: "flexible-pouch",
    skuHint: "PK-STK",
    material: "Barrier laminate · portion-control format",
    inserts: "Tear notch · easy-open",
    fluteOrFilm: "PET/AL/PE or mono PE",
    printReady: "Flexo / digital · small-format graphics",
    shipClassDefault: "Parcel · light",
    moq: 5000,
    unitBase: 0.08,
    industries: ["food", "sports", "cosmetic", "sweets", "coffee"],
    tags: ["portion", "sample", "thin", "single-serve"],
    volMin: 0.2,
    volMax: 12,
    maxWeight: 0.08,
    aspect: "tall",
    fragilityOk: ["low"],
  },
  {
    id: "spouted-pouch",
    name: "Spouted Stand-Up Pouch",
    family: "flexible-pouch",
    skuHint: "PK-SPT",
    material: "Liquid-grade barrier laminate",
    inserts: "Spout + cap · optional fitment",
    fluteOrFilm: "PET/NY/PE liquid stack",
    printReady: "Reverse print · retail liquid brands",
    shipClassDefault: "Parcel · standard",
    moq: 2000,
    unitBase: 0.55,
    industries: ["food", "cosmetic", "sports", "sweets"],
    tags: ["liquid", "gel", "resealable", "retail-shelf"],
    volMin: 8,
    volMax: 220,
    maxWeight: 1.2,
    aspect: "tall",
    fragilityOk: ["low", "medium"],
  },
  {
    id: "folding-carton",
    name: "Folding Carton",
    family: "folding-carton",
    skuHint: "BX-CTN",
    material: "18pt SBS / FBB board · aqueous coat",
    inserts: "Paperboard platform / hang-tab optional",
    fluteOrFilm: "SBS carton board",
    printReady: "Offset + specialty finish capable",
    shipClassDefault: "Parcel · light",
    moq: 500,
    unitBase: 0.85,
    industries: ["cosmetic", "retail", "food", "sweets", "tobacco", "toy", "fashion"],
    tags: ["retail-shelf", "solid", "premium-print", "carton"],
    volMin: 8,
    volMax: 500,
    maxWeight: 1.8,
    aspect: "any",
    fragilityOk: ["low", "medium"],
  },
  {
    id: "folding-sleeve",
    name: "Folding Carton + Sleeve",
    family: "folding-carton",
    skuHint: "BX-CTN-SLV",
    material: "18pt SBS board · sleeve wrap",
    inserts: "Paperboard platform",
    fluteOrFilm: "SBS carton board",
    printReady: "Offset + foil / soft-touch capable",
    shipClassDefault: "Parcel · light",
    moq: 500,
    unitBase: 0.95,
    industries: ["cosmetic", "gift", "holiday", "tobacco", "sweets"],
    tags: ["premium", "retail-shelf", "solid", "gift"],
    volMin: 10,
    volMax: 350,
    maxWeight: 1.5,
    aspect: "cube",
    fragilityOk: ["low", "medium"],
  },
  {
    id: "rigid-setup",
    name: "Rigid Setup Box",
    family: "rigid-box",
    skuHint: "BX-RGD",
    material: "2.0–2.5mm greyboard · premium wrap",
    inserts: "EVA / foam cradle",
    fluteOrFilm: "Rigid wrap",
    printReady: "Offset + specialty finish capable",
    shipClassDefault: "Parcel · standard",
    moq: 250,
    unitBase: 2.65,
    industries: ["cosmetic", "gift", "holiday", "electronics", "fashion"],
    tags: ["luxury", "gift", "fragile", "premium"],
    volMin: 15,
    volMax: 800,
    maxWeight: 3,
    aspect: "any",
    fragilityOk: ["medium", "high"],
  },
  {
    id: "rigid-drawer",
    name: "Rigid Drawer / Matchbox Style",
    family: "rigid-box",
    skuHint: "BX-DRW",
    material: "Greyboard + wrap · telescoping drawer",
    inserts: "Foam / flock tray",
    fluteOrFilm: "Rigid wrap",
    printReady: "Premium specialty finishing",
    shipClassDefault: "Parcel · standard",
    moq: 300,
    unitBase: 2.95,
    industries: ["cosmetic", "gift", "holiday", "tobacco", "sweets"],
    tags: ["luxury", "gift", "premium", "unboxing"],
    volMin: 10,
    volMax: 400,
    maxWeight: 2,
    aspect: "wide",
    fragilityOk: ["medium", "high"],
  },
  {
    id: "mailer-box",
    name: "Custom Mailer Box",
    family: "mailer",
    skuHint: "BX-MLR",
    material: "E-flute corrugated · white kraft outer",
    inserts: "Die-cut paperboard nest",
    fluteOrFilm: "E-flute · ~1.5mm",
    printReady: "CMYK digital or offset · full bleed",
    shipClassDefault: "Parcel · standard",
    moq: 500,
    unitBase: 1.28,
    industries: ["ecommerce", "cosmetic", "fashion", "sports", "petcare", "toy"],
    tags: ["ship-direct", "solid", "subscription", "unboxing"],
    volMin: 20,
    volMax: 1200,
    maxWeight: 4,
    aspect: "flat",
    fragilityOk: ["low", "medium", "high"],
  },
  {
    id: "tuck-mailer",
    name: "Tuck-Top Mailer (E-commerce)",
    family: "mailer",
    skuHint: "BX-TML",
    material: "E / B-flute corrugated",
    inserts: "Tissue / kraft void-fill",
    fluteOrFilm: "E or B-flute",
    printReady: "Flexo / digital outer",
    shipClassDefault: "Parcel · standard",
    moq: 500,
    unitBase: 1.15,
    industries: ["ecommerce", "fashion", "petcare", "toy", "sports"],
    tags: ["ship-direct", "subscription", "solid"],
    volMin: 30,
    volMax: 1500,
    maxWeight: 5,
    aspect: "flat",
    fragilityOk: ["low", "medium"],
  },
  {
    id: "corrugated-shipper",
    name: "Heavy-Duty Corrugated Shipper",
    family: "shipper",
    skuHint: "BX-SHIP",
    material: "B-flute kraft corrugated",
    inserts: "Partition / kraft void-fill kit",
    fluteOrFilm: "B-flute · ~3mm",
    printReady: "Flexo 1–4 color or preprint liner",
    shipClassDefault: "Parcel · heavy",
    moq: 500,
    unitBase: 1.55,
    industries: ["ecommerce", "food", "petcare", "automotive", "electronics"],
    tags: ["bulk", "protect", "ship-direct", "solid"],
    volMin: 200,
    volMax: 8000,
    maxWeight: 12,
    aspect: "any",
    fragilityOk: ["low", "medium", "high"],
  },
  {
    id: "double-wall-shipper",
    name: "Double-Wall Shipper",
    family: "shipper",
    skuHint: "BX-DW",
    material: "BC-flute double-wall",
    inserts: "Heavy partition / foam corners",
    fluteOrFilm: "BC double-wall",
    printReady: "Flexo 1–3 color",
    shipClassDefault: "LTL / pallet candidate",
    moq: 250,
    unitBase: 2.4,
    industries: ["ecommerce", "automotive", "electronics", "food"],
    tags: ["heavy", "protect", "bulk", "fragile"],
    volMin: 400,
    volMax: 20000,
    maxWeight: 30,
    aspect: "any",
    fragilityOk: ["medium", "high"],
  },
  {
    id: "pouch-mailer-combo",
    name: "Barrier Pouch + Outer Mailer",
    family: "hybrid",
    skuHint: "PK-PET-COMBO",
    material: "Barrier pouch + optional outer mailer",
    inserts: "Resealable zipper",
    fluteOrFilm: "Barrier film + E-flute mailer",
    printReady: "Digital / flexo on both layers",
    shipClassDefault: "Parcel · standard",
    moq: 750,
    unitBase: 0.72,
    industries: ["petcare", "food", "sports", "ecommerce"],
    tags: ["hybrid", "ship-direct", "barrier", "resealable"],
    volMin: 15,
    volMax: 600,
    maxWeight: 3,
    aspect: "any",
    fragilityOk: ["low", "medium"],
  },
  {
    id: "display-shipper",
    name: "Retail Display Shipper (PDQ)",
    family: "shipper",
    skuHint: "BX-PDQ",
    material: "Corrugated display + tray",
    inserts: "Product nests / frets",
    fluteOrFilm: "B / E flute combo",
    printReady: "High-impact retail graphics",
    shipClassDefault: "Parcel · heavy",
    moq: 500,
    unitBase: 1.9,
    industries: ["food", "cosmetic", "retail", "petcare", "sweets"],
    tags: ["retail-shelf", "display", "bulk"],
    volMin: 150,
    volMax: 4000,
    maxWeight: 10,
    aspect: "wide",
    fragilityOk: ["low", "medium"],
  },
];

function industryKey(industry: string) {
  return toIndustryKey(industry);
}

function detectAspect(L: number, W: number, H: number): CatalogStyle["aspect"] {
  const dims = [L, W, H].sort((a, b) => a - b);
  const [a, b, c] = dims;
  const ratio = c / Math.max(a, 0.001);
  if (H >= L * 1.15 && H >= W * 1.15) return "tall";
  if (H <= Math.min(L, W) * 0.55) return "flat";
  if (ratio < 1.35) return "cube";
  if (Math.max(L, W) / Math.min(L, W) >= 1.4) return "wide";
  return "any";
}

function productTags(opts: {
  industry: string;
  volume: number;
  weight: number;
  fragility: Fragility;
  aspect: CatalogStyle["aspect"];
  L: number;
  W: number;
  H: number;
}) {
  const tags = new Set<string>();
  const key = industryKey(opts.industry);

  if (key === "coffee" || key === "food" || key === "petcare" || key === "sweets" || key === "sports") {
    tags.add("barrier");
    tags.add("powder");
    tags.add("resealable");
  }
  if (key === "coffee") tags.add("retail-shelf");
  if (key === "cosmetic" || key === "gift" || key === "holiday" || key === "tobacco") {
    tags.add("premium-print");
    tags.add("retail-shelf");
    tags.add("solid");
  }
  if (key === "ecommerce" || key === "fashion" || key === "toy") {
    tags.add("ship-direct");
    tags.add("subscription");
  }
  if (key === "electronics" || key === "automotive") {
    tags.add("protect");
    tags.add("heavy");
    tags.add("ship-direct");
  }
  if (key === "gift" || key === "holiday") {
    tags.add("luxury");
    tags.add("gift");
    tags.add("unboxing");
  }
  if (key === "retail") {
    tags.add("retail-shelf");
    tags.add("display");
    tags.add("premium-print");
  }
  if (key === "ecofriendly") {
    tags.add("barrier");
    tags.add("retail-shelf");
  }

  const label = opts.industry.toLowerCase();
  if (label.includes("liquid") || label.includes("juice")) tags.add("liquid");
  if (key === "sweets") {
    tags.add("retail-shelf");
    tags.add("portion");
  }
  if (key === "sports") {
    tags.add("portion");
    tags.add("single-serve");
    tags.add("barrier");
  }
  if (key === "tobacco") {
    tags.add("premium");
    tags.add("solid");
  }

  if (opts.fragility === "high") {
    tags.add("fragile");
    tags.add("protect");
    tags.add("luxury");
  }
  if (opts.weight > 4) tags.add("heavy");
  if (opts.volume > 1200) tags.add("bulk");
  if (opts.volume < 12 && Math.min(opts.L, opts.W, opts.H) < 1.2) {
    tags.add("portion");
    tags.add("single-serve");
  }
  if (opts.aspect === "tall" && opts.weight <= 2) tags.add("retail-shelf");
  if (key === "food" && opts.H / Math.max(opts.L, opts.W) > 1.2 && opts.weight <= 1.2) {
    tags.add("liquid");
  }
  return tags;
}

function scoreStyle(
  style: CatalogStyle,
  ctx: {
    industry: string;
    volume: number;
    weight: number;
    fragility: Fragility;
    aspect: CatalogStyle["aspect"];
    tags: Set<string>;
    L: number;
    W: number;
    H: number;
  },
): { score: number; why: string[] } {
  let score = 35;
  const why: string[] = [];
  const key = industryKey(ctx.industry);

  // Industry affinity
  if (style.industries.includes(key)) {
    score += 22;
    why.push(`Strong fit for ${ctx.industry} brands`);
  } else if (style.industries.includes("other")) {
    score += 4;
  } else {
    score -= 10;
  }

  // Volume window
  if (ctx.volume >= style.volMin && ctx.volume <= style.volMax) {
    score += 18;
    why.push("Product volume sits in ideal size window");
  } else if (ctx.volume < style.volMin) {
    const gap = (style.volMin - ctx.volume) / style.volMin;
    score -= Math.min(25, gap * 30);
    if (gap > 0.35) why.push("Likely oversized for this product volume");
  } else {
    const gap = (ctx.volume - style.volMax) / style.volMax;
    score -= Math.min(28, gap * 28);
    if (gap > 0.25) why.push("Product volume exceeds typical capacity");
  }

  // Weight
  if (ctx.weight <= style.maxWeight) {
    score += 10;
  } else {
    const over = (ctx.weight - style.maxWeight) / style.maxWeight;
    score -= Math.min(30, over * 35);
    why.push("Weight above recommended limit for this format");
  }

  // Fragility compatibility
  if (style.fragilityOk.includes(ctx.fragility)) {
    score += 12;
    if (ctx.fragility === "high") why.push("Structure supports higher protection needs");
  } else {
    score -= 18;
    why.push("Protection level may be insufficient for stated fragility");
  }

  // Aspect ratio preference
  if (style.aspect === "any" || style.aspect === ctx.aspect) {
    score += 10;
    if (style.aspect === ctx.aspect) why.push(`Geometry matches ${ctx.aspect} product profile`);
  } else if (
    (style.aspect === "tall" && ctx.aspect === "cube") ||
    (style.aspect === "flat" && ctx.aspect === "wide")
  ) {
    score += 2;
  } else {
    score -= 8;
  }

  // Tag overlap
  let tagHits = 0;
  for (const t of style.tags) {
    if (ctx.tags.has(t)) tagHits += 1;
  }
  score += Math.min(16, tagHits * 4);
  if (tagHits >= 2) why.push("Matches product use-case signals (fill type / channel)");

  // Coffee/tea → prefer valve-capable pouches
  if (key === "coffee" && style.id.includes("standup")) {
    score += 8;
    why.push("Coffee/tea lines commonly use stand-up barrier pouches");
  }
  if (key === "coffee" && style.family.startsWith("flexible")) {
    score += 5;
  }

  // Industry playbook boosts / penalties (Boxora category taxonomy)
  const playbook = INDUSTRY_PLAYBOOK[key];
  if (playbook.prefer.includes(style.id)) {
    score += 14;
    if (why.length < 3) why.push(playbook.note.split("—")[0].trim());
  }
  if (playbook.avoid.includes(style.id)) {
    score -= 16;
  }

  // Heavy / large → shippers
  if (ctx.weight > 4 || ctx.volume > 1500) {
    if (style.family === "shipper") {
      score += 14;
      why.push("Heavy/large profile favors corrugated shipper formats");
    }
    if (style.family === "flexible-pouch") score -= 12;
  }

  // Tiny portion → sachet
  if (ctx.volume < 10 && style.id === "sachet-stick") {
    score += 16;
    why.push("Small fill volume maps to portion / stick formats");
  }

  // Luxury cosmetics / gift → rigid
  if ((key === "cosmetic" || key === "gift" || key === "holiday") && ctx.fragility !== "low") {
    if (style.family === "rigid-box") {
      score += 10;
      why.push("Premium / fragile lines often use rigid setup formats");
    }
  }

  // E-commerce → mailers
  if (key === "ecommerce" && (style.family === "mailer" || style.family === "hybrid")) {
    score += 10;
    why.push("Direct-to-consumer shipping favors mailer-ready structures");
  }

  // Electronics / automotive → protective corrugated
  if ((key === "electronics" || key === "automotive") && style.family === "shipper") {
    score += 12;
    why.push("Protective corrugated structure for transit-sensitive goods");
  }

  // Clamp + unique why lines
  score = Math.max(0, Math.min(99, Math.round(score)));
  const uniqueWhy = [...new Set(why)].slice(0, 3);
  if (uniqueWhy.length === 0) uniqueWhy.push("General-purpose packaging candidate");

  return { score, why: uniqueWhy };
}

/** Dynamic packaging recommendation engine (catalog scoring). */
export function runFitEngine(opts: {
  length: number;
  width: number;
  height: number;
  weight: number;
  fragility: Fragility;
  industry: string;
}): FitResult {
  const L = Math.max(opts.length, 0.1);
  const W = Math.max(opts.width, 0.1);
  const H = Math.max(opts.height, 0.1);
  const weight = Math.max(opts.weight, 0);
  const volume = L * W * H;
  const aspect = detectAspect(L, W, H);
  const tags = productTags({
    industry: opts.industry,
    volume,
    weight,
    fragility: opts.fragility,
    aspect,
    L,
    W,
    H,
  });

  const clearance =
    opts.fragility === "high" ? 0.35 : opts.fragility === "medium" ? 0.22 : 0.12;
  const intL = +(L + clearance * 2).toFixed(2);
  const intW = +(W + clearance * 2).toFixed(2);
  const intH = +(H + clearance * 2).toFixed(2);
  const internalCapacityIn3 = +(intL * intW * intH).toFixed(1);
  const blankAreaIn2 = +((2 * (intL + intW) * (intH + 0.5) + intL * intW * 1.15) / 1).toFixed(0);

  const ranked = PACKAGING_CATALOG.map((style) => {
    const { score, why } = scoreStyle(style, {
      industry: opts.industry,
      volume,
      weight,
      fragility: opts.fragility,
      aspect,
      tags,
      L,
      W,
      H,
    });
    return { style, score, why };
  }).sort((a, b) => b.score - a.score);

  const best = ranked[0];
  const selected = best.style;
  const confidence = Math.min(96, Math.max(62, best.score));

  let unitBase = selected.unitBase + volume * 0.00025 + weight * 0.03;
  let inserts = selected.inserts;

  // Fragility / risk model
  let riskScore = 18 + Math.min(35, weight * 7) + Math.min(22, volume / 90);
  if (opts.fragility === "high") {
    riskScore += 28;
    inserts = "Engineered protective insert + corner crush protection";
    unitBase *= 1.16;
  } else if (opts.fragility === "medium") {
    riskScore += 12;
    if (!inserts.toLowerCase().includes("optional") && selected.family !== "flexible-pouch") {
      inserts = "Cushion pad + snug-fit tray";
    }
    unitBase *= 1.06;
  } else {
    riskScore += 3;
  }

  if (selected.family === "shipper") riskScore -= 8;
  if (selected.family === "rigid-box") riskScore -= 6;
  if (selected.family.startsWith("flexible") && weight > 2) riskScore += 10;

  riskScore = Math.min(98, Math.round(riskScore));
  const riskLabel: FitResult["riskLabel"] =
    riskScore >= 70 ? "Elevated" : riskScore >= 42 ? "Moderate" : "Low";

  const shipClass =
    weight <= 0.5 && volume < 200
      ? "Parcel · light"
      : weight <= 2
        ? selected.shipClassDefault
        : weight <= 5
          ? "Parcel · heavy"
          : "LTL / pallet candidate";

  const reason =
    best.why[0] ??
    (riskLabel === "Elevated"
      ? "Transit damage risk is elevated — structure prioritized for crush + shock protection."
      : "Balanced selection for print quality, packing speed, and shipping profile.");

  const alternatives: RankedStyle[] = ranked.slice(1, 4).map((r) => ({
    id: r.style.id,
    name: r.style.name,
    family: r.style.family,
    skuHint: r.style.skuHint,
    score: r.score,
    why: r.why,
  }));

  const savingsTips = [
    quantityHint(unitBase),
    blankAreaIn2 > 900
      ? "Reduce outer dimensions by 0.25–0.5\" on non-critical axes to cut blank area."
      : "Dimensions are efficient for material utilization.",
    alternatives[0]
      ? `Also consider ${alternatives[0].name} (score ${alternatives[0].score}) if channel priorities change.`
      : "Current protection level is right-sized for stated fragility.",
  ];

  return {
    styleId: selected.id,
    family: selected.family,
    boxType: selected.name,
    skuHint: selected.skuHint,
    material: selected.material,
    inserts,
    fluteOrFilm: selected.fluteOrFilm,
    printReady: selected.printReady,
    reason,
    why: best.why,
    confidence,
    riskScore,
    riskLabel,
    moq: selected.moq,
    intL,
    intW,
    intH,
    internalCapacityIn3,
    blankAreaIn2,
    shipClass,
    unitBase: +unitBase.toFixed(3),
    savingsTips,
    alternatives,
    scoredFrom: PACKAGING_CATALOG.length,
  };
}

function quantityHint(unitBase: number) {
  if (unitBase > 2) return "Rigid formats: plan for MOQ 250–500 for efficient tooling setup.";
  if (unitBase < 0.7) return "Flexible formats: 2.5k–5k runs are a common production step-up.";
  return "Mailer/shipper formats: 1k+ runs are typical for board procurement.";
}

export function computeEstimate(opts: {
  unitBase: number;
  qty: number;
  finish: FinishId;
  blankAreaIn2: number;
  moq: number;
}) {
  const qty = Math.max(opts.qty, 1);
  const volumeDiscount =
    qty >= 25000 ? 0.72 : qty >= 10000 ? 0.78 : qty >= 5000 ? 0.84 : qty >= 2500 ? 0.9 : qty >= 1000 ? 0.95 : 1;

  const finishMult = 1 + getFinishPremium(opts.finish);
  const complexity = 1 + Math.min(0.12, opts.blankAreaIn2 / 12000);
  const unit = opts.unitBase * finishMult * volumeDiscount * complexity;
  const setup = Math.max(85, opts.blankAreaIn2 * 0.04) + (opts.finish === "foil" ? 120 : 45);
  const low = unit * qty * 0.93 + setup * 0.85;
  const high = unit * qty * 1.11 + setup * 1.15;
  const belowMoq = qty < opts.moq;

  return {
    unit: +unit.toFixed(3),
    setup: +setup.toFixed(0),
    low: +low.toFixed(0),
    high: +high.toFixed(0),
    volumeDiscountPct: Math.round((1 - volumeDiscount) * 100),
    belowMoq,
    effectiveMoq: opts.moq,
  };
}

export function timelineForQty(qty: number) {
  if (qty >= 10000) return [0, 2, 8, 13] as const;
  if (qty >= 5000) return [0, 2, 6, 11] as const;
  if (qty >= 2500) return [0, 1, 5, 9] as const;
  return [0, 1, 4, 7] as const;
}

export function makeQuoteRef() {
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BXQ-${stamp}-${rand}`;
}
