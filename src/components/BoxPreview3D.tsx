"use client";

import type { FinishId } from "@/lib/packagingEstimator";
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  RoundedBox,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  SMAA,
  Vignette,
} from "@react-three/postprocessing";
import { Download } from "lucide-react";
import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";

const finishStyles: Record<
  FinishId,
  {
    label: string;
    board: string;
    secondary: string;
    accent: string;
    roughness: number;
    metalness: number;
    clearcoat: number;
    clearcoatRoughness: number;
    envMapIntensity: number;
    sheen: number;
  }
> = {
  matte: {
    label: "Matte Laminate",
    board: "#3d6bff",
    secondary: "#bdf906",
    accent: "#8fbf00",
    roughness: 0.72,
    metalness: 0.06,
    clearcoat: 0.2,
    clearcoatRoughness: 0.55,
    envMapIntensity: 0.7,
    sheen: 0.2,
  },
  gloss: {
    label: "Gloss Laminate",
    board: "#4a78ff",
    secondary: "#6b90ff",
    accent: "#ffffff",
    roughness: 0.1,
    metalness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.35,
    sheen: 0.45,
  },
  soft: {
    label: "Soft-Touch",
    board: "#6b4fd8",
    secondary: "#8268e4",
    accent: "#4a2fad",
    roughness: 0.9,
    metalness: 0.02,
    clearcoat: 0.05,
    clearcoatRoughness: 0.9,
    envMapIntensity: 0.45,
    sheen: 0.7,
  },
  foil: {
    label: "Foil Accent",
    board: "#035a53",
    secondary: "#3a243f",
    accent: "#d4af37",
    roughness: 0.22,
    metalness: 0.85,
    clearcoat: 0.65,
    clearcoatRoughness: 0.14,
    envMapIntensity: 1.25,
    sheen: 0.2,
  },
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type FinishStyle = (typeof finishStyles)[FinishId];

/** Material colour for the whole model (kraft, white board ...). null = original finish colours. */
const LookContext = createContext<string | null>(null);

function deriveStyle(base: string | null, finish: FinishId): FinishStyle {
  const orig = finishStyles[finish];
  if (!base) return orig;
  const c = new THREE.Color(base);
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  const shade = (dl: number, ds = 0) =>
    new THREE.Color().setHSL(hsl.h, clamp(hsl.s + ds, 0, 1), clamp(hsl.l + dl, 0.04, 0.96)).getStyle();
  const lift = finish === "gloss" ? 0.03 : finish === "soft" ? -0.02 : 0;
  return {
    ...orig,
    board: shade(lift),
    secondary: shade(lift - 0.07),
    accent: finish === "foil" ? "#d4af37" : shade(lift - 0.16),
  };
}

function useStyle(finish: FinishId): FinishStyle {
  const base = useContext(LookContext);
  return useMemo(() => deriveStyle(base, finish), [base, finish]);
}

function toSceneSize(L: number, W: number, H: number): [number, number, number] {
  const diag = Math.sqrt(L * L + W * W + H * H);
  const scale = 2.55 / Math.max(diag, 0.001);
  return [L * scale, H * scale, W * scale];
}

/** High-res paper board maps for close-up / export sharpness */
function createPaperMaps(hex: string) {
  const size = 2048;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 52000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const a = 0.008 + Math.random() * 0.035;
    ctx.fillStyle = Math.random() > 0.52 ? `rgba(255,255,255,${a})` : `rgba(20,12,28,${a})`;
    ctx.fillRect(x, y, Math.random() > 0.65 ? 2 : 1, Math.random() > 0.65 ? 2 : 1);
  }

  ctx.strokeStyle = "rgba(3,90,83,0.028)";
  for (let i = 0; i < 280; i++) {
    const y = Math.random() * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + (Math.random() - 0.5) * 10);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(3,90,83,0.04)";
  ctx.lineWidth = 2;
  for (let x = 128; x < size; x += 160) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 16;
  map.generateMipmaps = true;
  map.minFilter = THREE.LinearMipmapLinearFilter;
  map.magFilter = THREE.LinearFilter;
  map.repeat.set(2.5, 2.5);

  const rSize = 1024;
  const rCanvas = document.createElement("canvas");
  rCanvas.width = rSize;
  rCanvas.height = rSize;
  const rctx = rCanvas.getContext("2d")!;
  rctx.fillStyle = "#b0b0b0";
  rctx.fillRect(0, 0, rSize, rSize);
  for (let i = 0; i < 24000; i++) {
    const g = 110 + Math.floor(Math.random() * 90);
    rctx.fillStyle = `rgb(${g},${g},${g})`;
    rctx.fillRect(Math.random() * rSize, Math.random() * rSize, 2, 2);
  }
  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.anisotropy = 16;
  roughnessMap.generateMipmaps = true;
  roughnessMap.minFilter = THREE.LinearMipmapLinearFilter;
  roughnessMap.repeat.set(2.5, 2.5);

  return { map, roughnessMap };
}

type ExportQuality = "hd" | "2k" | "4k";

const exportTargets: Record<ExportQuality, { label: string; longEdge: number }> = {
  hd: { label: "HD", longEdge: 1920 },
  "2k": { label: "2K", longEdge: 2560 },
  "4k": { label: "4K", longEdge: 3840 },
};

/** Customer branding shown on the printed face of the model. */
export type BrandCustom = { text: string; fontFamily: string; color: string };

type Props = {
  length: number;
  width: number;
  height: number;
  finish: FinishId;
  boxType: string;
  /** Catalog style id from AI / rules engine — preferred over name matching */
  styleId?: string;
  industry?: string;
  brand?: BrandCustom;
  /** Board / material colour (e.g. kraft golden brown). */
  baseColor?: string;
  /** Object URL of the customer's uploaded artwork (image files only). */
  artworkUrl?: string;
};

export type PreviewKind =
  | "doypack"
  | "flat-bottom-pouch"
  | "block-bag"
  | "sachet"
  | "spouted"
  | "folding-carton"
  | "carton-sleeve"
  | "rigid-setup"
  | "rigid-drawer"
  | "mailer"
  | "shipper"
  | "display"
  | "hybrid";

export function resolvePreviewKind(styleId?: string, boxType?: string): PreviewKind {
  const id = (styleId ?? "").toLowerCase();
  if (id === "sachet-stick") return "sachet";
  if (id === "spouted-pouch") return "spouted";
  if (id === "standup-flat-bottom") return "flat-bottom-pouch";
  if (id === "standup-pouch") return "doypack";
  if (id === "side-gusset-bag" || id === "quad-seal-bag") return "block-bag";
  if (id === "pouch-mailer-combo") return "hybrid";
  if (id === "folding-sleeve") return "carton-sleeve";
  if (id === "folding-carton") return "folding-carton";
  if (id === "rigid-setup") return "rigid-setup";
  if (id === "rigid-drawer") return "rigid-drawer";
  if (id === "mailer-box" || id === "tuck-mailer") return "mailer";
  if (id === "corrugated-shipper" || id === "double-wall-shipper") return "shipper";
  if (id === "display-shipper") return "display";

  const lower = (boxType ?? "").toLowerCase();
  if (lower.includes("sachet") || lower.includes("stick")) return "sachet";
  if (lower.includes("spout")) return "spouted";
  if (lower.includes("quad") || lower.includes("gusset") || lower.includes("block bottom")) {
    return "block-bag";
  }
  if (lower.includes("flat bottom") && lower.includes("pouch")) return "flat-bottom-pouch";
  if (lower.includes("pouch") || lower.includes("bag")) return "doypack";
  if (lower.includes("sleeve")) return "carton-sleeve";
  if (lower.includes("folding") || lower.includes("carton")) return "folding-carton";
  if (lower.includes("drawer") || lower.includes("matchbox")) return "rigid-drawer";
  if (lower.includes("rigid") || lower.includes("setup")) return "rigid-setup";
  if (lower.includes("display") || lower.includes("pdq")) return "display";
  if (lower.includes("shipper") || lower.includes("corrugated") || lower.includes("double-wall")) {
    return "shipper";
  }
  if (lower.includes("combo") || lower.includes("hybrid")) return "hybrid";
  if (lower.includes("mailer")) return "mailer";
  return "mailer";
}

function isFlexiblePreview(kind: PreviewKind) {
  return (
    kind === "doypack" ||
    kind === "flat-bottom-pouch" ||
    kind === "block-bag" ||
    kind === "sachet" ||
    kind === "spouted" ||
    kind === "hybrid"
  );
}

function SoftKeyLights() {
  return (
    <group>
      {/* Soft key — wrap highlights around the carton */}
      <spotLight
        position={[3.4, 5.2, 2.8]}
        angle={0.48}
        penumbra={1}
        intensity={1.15}
        color="#ffffff"
        castShadow={false}
      />
      {/* Cool fill from camera-left */}
      <spotLight
        position={[-3.2, 3.8, 2.2]}
        angle={0.7}
        penumbra={1}
        intensity={0.55}
        color="#dbe7ff"
      />
      {/* Warm rim for edge separation (depth) */}
      <spotLight
        position={[0.2, 4.2, -3.4]}
        angle={0.5}
        penumbra={0.95}
        intensity={0.7}
        color="#fff4e8"
      />
      {/* Bounce from light floor */}
      <pointLight position={[0, -0.35, 1.4]} intensity={0.35} color="#ffffff" />
      <pointLight position={[-1.2, 1.2, -1.6]} intensity={0.2} color="#b8c9ff" />
    </group>
  );
}

/** Canvas print face so clients see a real packaging mockup, not a blank blue slab. */
function createPrintFaceMap(opts: {
  hex: string;
  accent: string;
  finishLabel: string;
  title: string;
  sizeLabel: string;
  brand?: BrandCustom;
}) {
  const w = 1024;
  const h = 1280;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createLinearGradient(0, 0, w * 0.2, h);
  grad.addColorStop(0, opts.hex);
  grad.addColorStop(1, opts.accent);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle film grain
  for (let i = 0; i < 18000; i++) {
    const a = 0.015 + Math.random() * 0.03;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
  }

  // Safe print area
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.setLineDash([14, 10]);
  ctx.lineWidth = 3;
  ctx.strokeRect(72, 110, w - 144, h - 260);
  ctx.setLineDash([]);

  // Brand block
  ctx.fillStyle = "rgba(255,255,255,0.14)";
  roundRect(ctx, 120, 220, w - 240, 280, 28);
  ctx.fill();

  const brandText = opts.brand?.text.trim() ? opts.brand.text.trim().slice(0, 40) : "YOUR BRAND";
  const brandFamily = opts.brand?.fontFamily ?? "Figtree, Arial, sans-serif";
  ctx.fillStyle = opts.brand?.color ?? "#ffffff";
  // Shrink to fit the brand block so long names never overflow.
  let brandSize = opts.brand?.text.trim() ? 64 : 42;
  ctx.font = `700 ${brandSize}px ${brandFamily}`;
  while (ctx.measureText(brandText).width > w - 320 && brandSize > 22) {
    brandSize -= 2;
    ctx.font = `700 ${brandSize}px ${brandFamily}`;
  }
  ctx.fillText(brandText, 160, 300);
  ctx.font = "600 28px Figtree, Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(opts.title.slice(0, 28), 160, 350);
  ctx.font = "500 24px Figtree, Arial, sans-serif";
  ctx.fillText(opts.sizeLabel, 160, 395);
  ctx.fillText(opts.finishLabel, 160, 435);

  // Decorative product mark
  ctx.beginPath();
  ctx.arc(w / 2, 720, 90, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 26px Figtree, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("BOXORA", w / 2, 728);
  ctx.textAlign = "left";

  // Bottom info strip
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(0, h - 120, w, 120);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "600 22px Figtree, Arial, sans-serif";
  ctx.fillText("Print-ready mockup · Replace with your artwork", 120, h - 55);

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 16;
  map.needsUpdate = true;
  return map;
}

/**
 * Clean print face for a customer's own design: board colour + their artwork and/or text,
 * drawn at the exact aspect ratio of the panel it is applied to (no stretching).
 */
function createCustomFaceMap(opts: {
  aspect: number;
  baseHex: string;
  accent: string;
  artwork: HTMLImageElement | null;
  brand?: BrandCustom;
  margin?: number;
}) {
  const w = 1024;
  const h = Math.round(clamp(w / Math.max(0.2, opts.aspect), 256, 2048));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Transparent background: the design is printed straight onto the board colour of the model.
  ctx.clearRect(0, 0, w, h);

  const m = (opts.margin ?? 0.04) * Math.min(w, h);
  const hasText = !!opts.brand?.text.trim();
  const textZone = hasText ? (opts.artwork ? h * 0.2 : h) : 0;
  const artBox = { x: m, y: m, w: w - m * 2, h: (opts.artwork && hasText ? h - textZone : h) - m * 2 };

  if (opts.artwork) {
    const iw = opts.artwork.naturalWidth || 512;
    const ih = opts.artwork.naturalHeight || 512;
    const k = Math.min(artBox.w / iw, artBox.h / ih);
    const dw = iw * k;
    const dh = ih * k;
    ctx.drawImage(opts.artwork, artBox.x + (artBox.w - dw) / 2, artBox.y + (artBox.h - dh) / 2, dw, dh);
  }

  if (hasText && opts.brand) {
    const text = opts.brand.text.trim().slice(0, 40);
    const family = opts.brand.fontFamily;
    const zoneTop = opts.artwork ? h - textZone : 0;
    const zoneH = opts.artwork ? textZone : h;
    let size = Math.min(zoneH * 0.62, w * 0.16);
    ctx.font = `700 ${size}px ${family}`;
    while (ctx.measureText(text).width > w - m * 2 && size > 18) {
      size -= 2;
      ctx.font = `700 ${size}px ${family}`;
    }
    ctx.fillStyle = opts.brand.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, w / 2, zoneTop + zoneH / 2);
  }

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 16;
  map.userData.custom = true;
  map.needsUpdate = true;
  return map;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** True stand-up / doypack silhouette — thin film pouch, not a glossy carton block. */
function createDoypackShape(faceW: number, faceH: number) {
  const hw = faceW / 2;
  const hh = faceH / 2;
  const topW = hw * 0.9;
  const midW = hw * 1.02;
  const botW = hw * 0.98;
  const shape = new THREE.Shape();

  // Clockwise silhouette: flat sealed top → soft sides → stand-up base
  shape.moveTo(-topW, hh);
  shape.lineTo(topW, hh);
  shape.quadraticCurveTo(midW * 1.04, hh * 0.55, midW, 0);
  shape.quadraticCurveTo(botW * 1.06, -hh * 0.55, botW * 0.92, -hh);
  shape.quadraticCurveTo(0, -hh * 1.06, -botW * 0.92, -hh);
  shape.quadraticCurveTo(-botW * 1.06, -hh * 0.55, -midW, 0);
  shape.quadraticCurveTo(-midW * 1.04, hh * 0.55, -topW, hh);
  return shape;
}

function StandUpPouchMesh({
  size,
  finish,
  boardProps,
  dims,
  variant = "doypack",
  industryLabel,
  brand,
}: {
  size: [number, number, number];
  finish: FinishId;
  boardProps: Record<string, unknown>;
  dims: { L: number; W: number; H: number };
  variant?: Extract<PreviewKind, "doypack" | "flat-bottom-pouch" | "block-bag" | "sachet" | "spouted" | "hybrid">;
  industryLabel?: string;
  brand?: BrandCustom;
}) {
  const style = useStyle(finish);
  const [l, h, w] = size;

  const isSachet = variant === "sachet";
  const isSpouted = variant === "spouted";
  const isBlock = variant === "block-bag";
  const isFlat = variant === "flat-bottom-pouch";

  // Retail doypack: tall face, shallow film depth (must not read as a box).
  const faceW = isSachet
    ? clamp(Math.min(l, w) * 0.55, 0.35, 0.85)
    : clamp(Math.max(l, w) * (isBlock ? 1.0 : 1.05), 0.95, 2.2);
  const faceH = isSachet
    ? clamp(Math.max(h * 2.1, faceW * 2.4), 1.6, 2.8)
    : clamp(Math.max(h * 1.55, faceW * (isBlock ? 1.15 : 1.35)), 1.45, 3.0);
  const depth = isSachet
    ? 0.06
    : isBlock
      ? clamp(Math.min(w * 0.42, faceW * 0.28), 0.18, 0.38)
      : clamp(Math.min(w * 0.28, faceW * 0.16), 0.1, 0.22);

  const title =
    variant === "sachet"
      ? "Sachet / Stick"
      : variant === "spouted"
        ? "Spouted Pouch"
        : variant === "block-bag"
          ? "Block Bottom Bag"
          : variant === "flat-bottom-pouch"
            ? "Flat Bottom Pouch"
            : variant === "hybrid"
              ? "Pouch + Mailer"
              : "Stand-Up Pouch";

  const printMap = useMemo(() => {
    if (typeof document === "undefined") return null;
    return createPrintFaceMap({
      hex: style.board,
      accent: style.secondary,
      finishLabel: style.label,
      title,
      sizeLabel: `${dims.L}" × ${dims.W}" × ${dims.H}"${industryLabel ? ` · ${industryLabel}` : ""}`,
      brand,
    });
  }, [style.board, style.secondary, style.label, title, dims.L, dims.W, dims.H, industryLabel, brand]);

  const pouchGeom = useMemo(() => {
    const shape = isSachet
      ? (() => {
          const shape = new THREE.Shape();
          const hw = faceW / 2;
          const hh = faceH / 2;
          shape.moveTo(-hw * 0.85, hh);
          shape.lineTo(hw * 0.85, hh);
          shape.lineTo(hw, -hh);
          shape.lineTo(-hw, -hh);
          shape.closePath();
          return shape;
        })()
      : isBlock
        ? (() => {
            const shape = new THREE.Shape();
            const hw = faceW / 2;
            const hh = faceH / 2;
            const r = Math.min(0.06, hw * 0.08);
            shape.moveTo(-hw + r, hh);
            shape.lineTo(hw - r, hh);
            shape.quadraticCurveTo(hw, hh, hw, hh - r);
            shape.lineTo(hw, -hh + r);
            shape.quadraticCurveTo(hw, -hh, hw - r, -hh);
            shape.lineTo(-hw + r, -hh);
            shape.quadraticCurveTo(-hw, -hh, -hw, -hh + r);
            shape.lineTo(-hw, hh - r);
            shape.quadraticCurveTo(-hw, hh, -hw + r, hh);
            return shape;
          })()
        : createDoypackShape(faceW, faceH);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: !isSachet,
      bevelThickness: Math.min(0.028, depth * 0.35),
      bevelSize: Math.min(0.03, faceW * 0.025),
      bevelSegments: 3,
      curveSegments: 28,
    });
    geom.center();
    geom.computeVertexNormals();
    return geom;
  }, [faceW, faceH, depth, isSachet, isBlock]);

  const gussetGeom = useMemo(() => {
    const geom = new THREE.CircleGeometry(1, 64);
    geom.rotateX(-Math.PI / 2);
    return geom;
  }, []);

  useEffect(() => {
    return () => {
      printMap?.dispose();
      pouchGeom.dispose();
      gussetGeom.dispose();
    };
  }, [printMap, pouchGeom, gussetGeom]);

  const filmMat = {
    color: style.board,
    map: (boardProps.map as THREE.Texture | undefined) ?? undefined,
    roughnessMap: (boardProps.roughnessMap as THREE.Texture | undefined) ?? undefined,
    roughness: Math.max(0.22, style.roughness * 0.85),
    metalness: Math.min(0.12, style.metalness),
    clearcoat: finish === "gloss" ? 0.85 : style.clearcoat * 0.55,
    clearcoatRoughness: finish === "gloss" ? 0.12 : Math.max(0.35, style.clearcoatRoughness),
    envMapIntensity: style.envMapIntensity * 0.85,
    sheen: 0.35,
    sheenColor: new THREE.Color("#ffffff"),
    sheenRoughness: 0.55,
    side: THREE.DoubleSide,
  };

  const zipperY = faceH * (isSachet ? 0.28 : 0.34);
  const sealY = faceH * (isSachet ? 0.4 : 0.43);

  return (
    <group>
      <mesh geometry={pouchGeom} castShadow receiveShadow>
        <meshPhysicalMaterial {...filmMat} />
      </mesh>

      <mesh position={[0, isSachet ? 0 : -faceH * 0.04, depth / 2 + 0.006]} castShadow>
        <planeGeometry args={[faceW * (isSachet ? 0.7 : 0.72), faceH * (isSachet ? 0.7 : 0.58)]} />
        <meshPhysicalMaterial
          color="#ffffff"
          map={printMap ?? undefined}
          roughness={Math.max(0.32, style.roughness - 0.08)}
          metalness={0.05}
          clearcoat={finish === "gloss" ? 0.9 : 0.25}
          clearcoatRoughness={finish === "gloss" ? 0.1 : 0.45}
          envMapIntensity={style.envMapIntensity}
          transparent
          opacity={0.98}
        />
      </mesh>

      <mesh position={[0, sealY, 0]} castShadow>
        <boxGeometry args={[faceW * 0.88, 0.055, depth * 0.72]} />
        <meshPhysicalMaterial
          color={finish === "foil" ? "#2a2030" : style.accent}
          roughness={0.55}
          metalness={0.08}
        />
      </mesh>

      {!isSachet && (
        <>
          <mesh position={[0, zipperY, depth * 0.15]} castShadow>
            <boxGeometry args={[faceW * 0.78, 0.048, depth * 0.55]} />
            <meshPhysicalMaterial
              color={finish === "foil" ? "#035a53" : "#e9e7cc"}
              roughness={0.28}
              metalness={0.22}
              clearcoat={0.5}
            />
          </mesh>
          <mesh position={[0, zipperY, depth * 0.28]}>
            <boxGeometry args={[faceW * 0.72, 0.012, 0.01]} />
            <meshBasicMaterial color="#6b7280" />
          </mesh>
        </>
      )}

      <mesh position={[faceW * 0.42, faceH * 0.38, 0]}>
        <boxGeometry args={[0.035, 0.014, depth * 0.5]} />
        <meshBasicMaterial color="#111827" transparent opacity={0.45} />
      </mesh>

      {!isSachet && (
        <mesh
          geometry={gussetGeom}
          position={[0, -faceH * 0.48, 0]}
          scale={[faceW * (isFlat || isBlock ? 0.44 : 0.38), 1, depth * (isBlock ? 1.1 : 1.55)]}
          receiveShadow
          castShadow
        >
          <meshPhysicalMaterial
            color={style.secondary}
            roughness={0.82}
            metalness={0.04}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {!isSachet && (
        <mesh position={[0, -faceH * 0.08, depth * 0.08]} scale={[0.92, 0.78, 0.55]} castShadow>
          <sphereGeometry args={[Math.min(faceW, faceH) * 0.26, 36, 24]} />
          <meshPhysicalMaterial
            color={style.secondary}
            roughness={0.65}
            metalness={0.04}
            transparent
            opacity={0.16}
            depthWrite={false}
          />
        </mesh>
      )}

      {!isSachet && !isSpouted && (
        <mesh
          position={[faceW * 0.22, faceH * 0.08, depth / 2 + 0.012]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.038, 0.038, 0.012, 24]} />
          <meshPhysicalMaterial color="#d7dde8" roughness={0.22} metalness={0.55} />
        </mesh>
      )}

      {isSpouted && (
        <group position={[0, faceH * 0.42, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.055, 0.07, 0.12, 24]} />
            <meshPhysicalMaterial color="#e8edf5" roughness={0.25} metalness={0.35} clearcoat={0.6} />
          </mesh>
          <mesh position={[0, 0.09, 0]} castShadow>
            <cylinderGeometry args={[0.078, 0.078, 0.045, 24]} />
            <meshPhysicalMaterial color={style.accent} roughness={0.3} metalness={0.2} />
          </mesh>
        </group>
      )}

      {variant === "hybrid" && (
        <RoundedBox
          args={[faceW * 1.35, faceH * 0.55, depth * 3.2]}
          radius={0.04}
          smoothness={4}
          position={[0, -faceH * 0.15, -depth * 1.6]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial color="#f4f6fa" roughness={0.7} metalness={0.05} />
        </RoundedBox>
      )}

      {finish === "gloss" && (
        <mesh position={[-faceW * 0.18, 0.02, depth / 2 + 0.008]} rotation={[0, 0, -0.14]}>
          <planeGeometry args={[faceW * 0.1, faceH * 0.45]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.14} />
        </mesh>
      )}

      {finish === "foil" && (
        <mesh position={[0, -faceH * 0.2, depth / 2 + 0.008]}>
          <planeGeometry args={[faceW * 0.48, 0.032]} />
          <meshPhysicalMaterial color="#d4af37" roughness={0.12} metalness={1} envMapIntensity={2} />
        </mesh>
      )}
    </group>
  );
}

/** Determines box style from boxType string */
type BoxStyle = "folding-carton" | "rigid-setup" | "mailer" | "shipper";

function getBoxStyle(boxType: string | undefined): BoxStyle {
  if (!boxType) return "mailer";
  const lower = boxType.toLowerCase();
  if (lower.includes("folding") || lower.includes("carton")) return "folding-carton";
  if (lower.includes("rigid") || lower.includes("setup")) return "rigid-setup";
  if (lower.includes("shipper") || lower.includes("corrugated")) return "shipper";
  return "mailer";
}

/** Folding Carton - single-piece tuck-end box (like a cereal box / cosmetic box) */
function FoldingCartonMesh({
  size,
  finish,
  boardProps,
  hasSleeve,
  lidOpen,
  paper,
  printMap,
  sideMap,
  topMap,
}: {
  size: [number, number, number];
  finish: FinishId;
  boardProps: Record<string, unknown>;
  hasSleeve: boolean;
  lidOpen: number;
  paper: { map: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } | null;
  printMap: THREE.CanvasTexture | null;
  sideMap?: THREE.CanvasTexture | null;
  topMap?: THREE.CanvasTexture | null;
}) {
  const style = useStyle(finish);
  const [l, h, w] = size;
  const wall = 0.022;
  const edge = Math.min(0.028, Math.min(l, w, h) * 0.04);
  const tuckRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (tuckRef.current) {
      const target = -lidOpen * (Math.PI * 0.5);
      tuckRef.current.rotation.x += (target - tuckRef.current.rotation.x) * 0.12;
    }
  });

  return (
    <group>
      {/* Main carton body - single piece */}
      <RoundedBox args={[l, h, w]} radius={edge} smoothness={6} castShadow receiveShadow>
        <meshPhysicalMaterial {...boardProps} />
      </RoundedBox>

      {/* Top face */}
      <mesh position={[0, h / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[l * 0.98, w * 0.98]} />
        <meshPhysicalMaterial
          color={style.secondary}
          map={paper?.map}
          roughnessMap={paper?.roughnessMap}
          roughness={style.roughness}
          metalness={style.metalness}
          clearcoat={style.clearcoat}
          clearcoatRoughness={style.clearcoatRoughness}
          envMapIntensity={style.envMapIntensity}
        />
      </mesh>

      {/* Top tuck flap (hinged at back) */}
      <group ref={tuckRef} position={[0, h / 2, -w / 2 + wall]}>
        <mesh position={[0, wall, w * 0.35]} castShadow>
          <boxGeometry args={[l * 0.94, wall * 0.8, w * 0.65]} />
          <meshPhysicalMaterial {...boardProps} />
        </mesh>
        {/* Tuck tab */}
        <mesh position={[0, wall * 1.5, w * 0.62]} castShadow>
          <boxGeometry args={[l * 0.7, h * 0.12, wall]} />
          <meshPhysicalMaterial {...boardProps} />
        </mesh>
      </group>

      {/* Score line on top edge (front) */}
      <mesh position={[0, h / 2 + 0.003, w / 2 - wall * 2]}>
        <planeGeometry args={[l * 0.92, 0.004]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.12} />
      </mesh>

      {/* Interior visible when open */}
      {lidOpen > 0.15 && (
        <mesh position={[0, h * 0.1, 0]}>
          <boxGeometry args={[l - wall * 4, h * 0.85, w - wall * 4]} />
          <meshPhysicalMaterial
            color="#f5f2ea"
            roughness={0.95}
            metalness={0}
            transparent
            opacity={0.25 + lidOpen * 0.5}
          />
        </mesh>
      )}

      {/* Front panel brand area */}
      <mesh position={[0, h * 0.05, w / 2 + 0.003]} castShadow>
        <planeGeometry args={[l * 0.72, h * 0.58]} />
        <meshPhysicalMaterial
          color={printMap ? "#ffffff" : finish === "gloss" ? "#8fbf00" : style.accent}
          map={printMap ?? undefined}
          transparent={printMap?.userData?.custom === true}
          roughness={finish === "foil" ? 0.18 : 0.4}
          metalness={finish === "foil" ? 1 : 0.08}
          clearcoat={finish === "gloss" ? 1 : 0.25}
          envMapIntensity={1.05}
        />
      </mesh>

      {/* Customer design on the other faces */}
      {sideMap && (
        <>
          <mesh position={[0, h * 0.05, -w / 2 - 0.003]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[l * 0.72, h * 0.58]} />
            <meshPhysicalMaterial color="#ffffff" map={printMap ?? undefined}
          transparent={printMap?.userData?.custom === true} roughness={0.5} clearcoat={0.2} />
          </mesh>
          <mesh position={[l / 2 + 0.003, h * 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[w * 0.72, h * 0.58]} />
            <meshPhysicalMaterial color="#ffffff" map={sideMap} transparent roughness={0.5} clearcoat={0.2} />
          </mesh>
          <mesh position={[-l / 2 - 0.003, h * 0.05, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[w * 0.72, h * 0.58]} />
            <meshPhysicalMaterial color="#ffffff" map={sideMap} transparent roughness={0.5} clearcoat={0.2} />
          </mesh>
        </>
      )}
      {topMap && (
        <mesh position={[0, h / 2 + 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[l * 0.9, w * 0.9]} />
          <meshPhysicalMaterial color="#ffffff" map={topMap} transparent roughness={0.5} clearcoat={0.2} />
        </mesh>
      )}

      {finish === "gloss" && (
        <mesh position={[-l * 0.18, 0.04, w / 2 + 0.006]} rotation={[0, 0, -0.22]}>
          <planeGeometry args={[l * 0.12, h * 0.65]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
      )}

      {finish === "foil" && (
        <mesh position={[0, -h * 0.32, w / 2 + 0.005]}>
          <planeGeometry args={[l * 0.5, 0.035]} />
          <meshPhysicalMaterial color="#d4af37" roughness={0.12} metalness={1} envMapIntensity={2} />
        </mesh>
      )}

      {/* Sleeve wrap around the carton */}
      {hasSleeve && (
        <group>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[l * 1.025, h * 0.32, w * 1.025]} />
            <meshPhysicalMaterial
              color={finish === "foil" ? "#035a53" : style.accent}
              roughness={Math.max(0.4, style.roughness - 0.15)}
              metalness={finish === "foil" ? 0.7 : 0.1}
              clearcoat={style.clearcoat}
              transparent
              opacity={0.92}
              envMapIntensity={style.envMapIntensity}
            />
          </mesh>
          {/* Sleeve brand line */}
          <mesh position={[0, 0, w / 2 + 0.016]}>
            <planeGeometry args={[l * 0.55, 0.02]} />
            <meshPhysicalMaterial
              color={finish === "foil" ? "#d4af37" : "#ffffff"}
              roughness={0.2}
              metalness={finish === "foil" ? 1 : 0.1}
              envMapIntensity={1.5}
            />
          </mesh>
        </group>
      )}

      {/* Edge highlight */}
      <mesh position={[l / 2 + 0.001, 0, 0]}>
        <boxGeometry args={[0.005, h * 0.94, w * 0.94]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

/** Rigid Setup Box - two-piece luxury box (base + separate lid) */
function RigidSetupMesh({
  size,
  finish,
  boardProps,
  lidOpen,
  paper,
  printMap,
}: {
  size: [number, number, number];
  finish: FinishId;
  boardProps: Record<string, unknown>;
  lidOpen: number;
  paper: { map: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } | null;
  printMap: THREE.CanvasTexture | null;
}) {
  const style = useStyle(finish);
  const [l, h, w] = size;
  const wall = 0.04;
  const edge = Math.min(0.025, Math.min(l, w, h) * 0.035);
  const baseH = h * 0.62;
  const lidH = h * 0.42;
  const lidRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (lidRef.current) {
      const target = lidOpen * (baseH + 0.15);
      lidRef.current.position.y += (target - lidRef.current.position.y + lidH / 2 + baseH / 2 - 0.01) * 0.1;
    }
  });

  return (
    <group>
      {/* Base */}
      <group position={[0, -h / 2 + baseH / 2, 0]}>
        <RoundedBox args={[l, baseH, w]} radius={edge} smoothness={6} castShadow receiveShadow>
          <meshPhysicalMaterial {...boardProps} />
        </RoundedBox>
        {/* Inner cavity */}
        <mesh position={[0, wall, 0]}>
          <boxGeometry args={[l - wall * 3, baseH - wall * 2, w - wall * 3]} />
          <meshPhysicalMaterial
            color="#f8f5ee"
            roughness={0.92}
            metalness={0}
            transparent
            opacity={lidOpen > 0.1 ? 0.45 + lidOpen * 0.4 : 0.2}
          />
        </mesh>
      </group>

      {/* Lid (lifts up) */}
      <mesh
        ref={lidRef}
        position={[0, baseH / 2 + lidH / 2 - h / 2 - 0.01 + lidOpen * (baseH + 0.15), 0]}
        castShadow
        receiveShadow
      >
        <RoundedBox args={[l * 1.025, lidH, w * 1.025]} radius={edge} smoothness={6}>
          <meshPhysicalMaterial {...boardProps} />
        </RoundedBox>
      </mesh>

      {/* Lid top detail */}
      <mesh
        position={[0, baseH / 2 + lidH - h / 2 + 0.003 + lidOpen * (baseH + 0.15), 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[l * 0.95, w * 0.95]} />
        <meshPhysicalMaterial
          color={style.secondary}
          map={paper?.map}
          roughnessMap={paper?.roughnessMap}
          roughness={style.roughness}
          metalness={style.metalness}
          clearcoat={style.clearcoat}
          envMapIntensity={style.envMapIntensity}
        />
      </mesh>

      {/* Brand emboss on lid */}
      <mesh position={[0, baseH / 2 + lidH - h / 2 + 0.005 + lidOpen * (baseH + 0.15), 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[l * 0.55, w * 0.4]} />
        <meshPhysicalMaterial
          color={printMap ? "#ffffff" : finish === "foil" ? "#d4af37" : style.accent}
          map={printMap ?? undefined}
          transparent={printMap?.userData?.custom === true}
          roughness={finish === "foil" ? 0.15 : 0.45}
          metalness={finish === "foil" ? 1 : 0.12}
          clearcoat={finish === "gloss" ? 1 : 0.3}
          envMapIntensity={1.15}
        />
      </mesh>

      {/* Base front panel */}
      <mesh position={[0, -h / 2 + baseH * 0.45, w / 2 + 0.003]} castShadow>
        <planeGeometry args={[l * 0.7, baseH * 0.6]} />
        <meshPhysicalMaterial
          color={style.accent}
          roughness={finish === "foil" ? 0.2 : 0.45}
          metalness={finish === "foil" ? 0.8 : 0.1}
          clearcoat={finish === "gloss" ? 1 : 0.2}
          envMapIntensity={1}
        />
      </mesh>

      {finish === "gloss" && (
        <mesh position={[-l * 0.22, -h / 2 + baseH * 0.5, w / 2 + 0.006]} rotation={[0, 0, -0.25]}>
          <planeGeometry args={[l * 0.1, baseH * 0.7]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.14} />
        </mesh>
      )}
    </group>
  );
}

/** Mailer Box - tuck-front e-commerce style */
function MailerBoxMesh({
  size,
  finish,
  boardProps,
  lidOpen,
  paper,
  printMap,
}: {
  size: [number, number, number];
  finish: FinishId;
  boardProps: Record<string, unknown>;
  lidOpen: number;
  paper: { map: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } | null;
  printMap: THREE.CanvasTexture | null;
}) {
  const style = useStyle(finish);
  const [l, h, w] = size;
  const wall = 0.03;
  const edge = Math.min(0.03, Math.min(l, w, h) * 0.045);
  const lidRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (lidRef.current) {
      const target = -lidOpen * (Math.PI * 0.55);
      lidRef.current.rotation.x += (target - lidRef.current.rotation.x) * 0.12;
    }
  });

  return (
    <group>
      {/* Base tray */}
      <RoundedBox args={[l, h * 0.65, w]} radius={edge} smoothness={6} castShadow receiveShadow position={[0, -h * 0.175, 0]}>
        <meshPhysicalMaterial {...boardProps} />
      </RoundedBox>

      {/* Hinged lid (flips from back) */}
      <group ref={lidRef} position={[0, h * 0.15, -w / 2 + wall]}>
        <RoundedBox args={[l * 0.98, wall * 1.2, w * 0.96]} radius={edge * 0.5} smoothness={4} castShadow position={[0, wall * 0.6, w * 0.48]}>
          <meshPhysicalMaterial {...boardProps} />
        </RoundedBox>
        {/* Front flap */}
        <mesh position={[0, -h * 0.08, w * 0.92]} castShadow>
          <boxGeometry args={[l * 0.92, h * 0.28, wall]} />
          <meshPhysicalMaterial {...boardProps} />
        </mesh>
        {/* Tuck tab */}
        <mesh position={[0, -h * 0.22, w * 0.9]} castShadow>
          <boxGeometry args={[l * 0.7, h * 0.08, wall * 0.8]} />
          <meshPhysicalMaterial
            color={style.secondary}
            roughness={style.roughness}
            metalness={style.metalness}
            clearcoat={style.clearcoat * 0.5}
          />
        </mesh>
      </group>

      {/* Interior */}
      {lidOpen > 0.12 && (
        <mesh position={[0, -h * 0.1, 0]}>
          <boxGeometry args={[l - wall * 4, h * 0.5, w - wall * 4]} />
          <meshPhysicalMaterial
            color="#e8dfd0"
            roughness={0.88}
            metalness={0}
            transparent
            opacity={0.3 + lidOpen * 0.45}
          />
        </mesh>
      )}

      {/* Top surface */}
      <mesh position={[0, h * 0.15 + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[l * 0.96, w * 0.96]} />
        <meshPhysicalMaterial
          color={style.secondary}
          map={paper?.map}
          roughnessMap={paper?.roughnessMap}
          roughness={style.roughness}
          metalness={style.metalness}
          clearcoat={style.clearcoat}
          envMapIntensity={style.envMapIntensity}
        />
      </mesh>

      {/* Front brand panel */}
      <mesh position={[0, -h * 0.1, w / 2 + 0.003]} castShadow>
        <planeGeometry args={[l * 0.7, h * 0.48]} />
        <meshPhysicalMaterial
          color={printMap ? "#ffffff" : finish === "gloss" ? "#8fbf00" : style.accent}
          map={printMap ?? undefined}
          transparent={printMap?.userData?.custom === true}
          roughness={finish === "foil" ? 0.18 : 0.4}
          metalness={finish === "foil" ? 1 : 0.1}
          clearcoat={finish === "gloss" ? 1 : 0.25}
          envMapIntensity={1.05}
        />
      </mesh>

      {finish === "gloss" && (
        <mesh position={[-l * 0.18, -h * 0.08, w / 2 + 0.006]} rotation={[0, 0, -0.22]}>
          <planeGeometry args={[l * 0.1, h * 0.5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.14} />
        </mesh>
      )}

      {finish === "foil" && (
        <mesh position={[0, -h * 0.28, w / 2 + 0.005]}>
          <planeGeometry args={[l * 0.48, 0.03]} />
          <meshPhysicalMaterial color="#d4af37" roughness={0.12} metalness={1} envMapIntensity={2} />
        </mesh>
      )}

      {/* Edge catch */}
      <mesh position={[l / 2 + 0.001, -h * 0.1, 0]}>
        <boxGeometry args={[0.005, h * 0.6, w * 0.94]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function PhotorealCarton({
  size,
  finish,
  previewKind,
  lidOpen,
  boxType,
  dims,
  industry,
  brand,
  artworkUrl,
}: {
  size: [number, number, number];
  finish: FinishId;
  previewKind: PreviewKind;
  lidOpen: number;
  boxType: string;
  dims: { L: number; W: number; H: number };
  industry?: string;
  brand?: BrandCustom;
  artworkUrl?: string;
}) {
  const style = useStyle(finish);
  const group = useRef<THREE.Group>(null);
  const flexible = isFlexiblePreview(previewKind);

  const look = useContext(LookContext);

  // Load the customer's artwork (async, so state is only set from the load callback).
  const [artState, setArtState] = useState<{ url: string; img: HTMLImageElement } | null>(null);
  useEffect(() => {
    if (!artworkUrl) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setArtState({ url: artworkUrl, img });
    };
    img.src = artworkUrl;
    return () => {
      cancelled = true;
    };
  }, [artworkUrl]);
  const artwork = artworkUrl && artState?.url === artworkUrl ? artState.img : null;
  const customized = !!artwork || !!brand;

  const paper = useMemo(() => {
    if (typeof document === "undefined") return null;
    // Kraft look for shippers (unless a material colour was chosen)
    if (!look && (previewKind === "shipper" || previewKind === "display")) {
      return createPaperMaps("#c4a574");
    }
    return createPaperMaps(style.board);
  }, [style.board, previewKind, look]);

  // Panel aspect ratios used by each model, so artwork is never stretched.
  const [bl, bh, bw] = size;
  const frontAspect =
    previewKind === "folding-carton" || previewKind === "carton-sleeve"
      ? (bl * 0.72) / (bh * 0.58)
      : previewKind === "rigid-setup" || previewKind === "rigid-drawer"
        ? (bl * 0.55) / (bw * 0.4)
        : (bl * 0.7) / (bh * 0.48);
  const sideAspect = (bw * 0.72) / (bh * 0.58);
  const topAspect = bl / bw;
  const hasExtraFaces = previewKind === "folding-carton" || previewKind === "carton-sleeve";

  const boxPrint = useMemo(() => {
    if (typeof document === "undefined" || flexible) return null;
    if (customized) {
      return createCustomFaceMap({
        aspect: frontAspect,
        baseHex: style.board,
        accent: style.secondary,
        artwork,
        brand,
      });
    }
    return createPrintFaceMap({
      hex: !look && (previewKind === "shipper" || previewKind === "display") ? "#c4a574" : style.board,
      accent: style.secondary,
      finishLabel: style.label,
      title: boxType.split("+")[0].trim().slice(0, 28),
      sizeLabel: `${dims.L}" × ${dims.W}" × ${dims.H}"${industry ? ` · ${industry}` : ""}`,
      brand,
    });
  }, [style.board, style.secondary, style.label, boxType, dims, flexible, industry, previewKind, brand, customized, frontAspect, artwork, look]);

  const sideMap = useMemo(() => {
    if (typeof document === "undefined" || flexible || !customized || !hasExtraFaces) return null;
    return createCustomFaceMap({
      aspect: sideAspect,
      baseHex: style.board,
      accent: style.secondary,
      artwork,
      brand,
      margin: 0.14,
    });
  }, [flexible, customized, hasExtraFaces, sideAspect, style.board, style.secondary, artwork, brand]);

  const topMap = useMemo(() => {
    if (typeof document === "undefined" || flexible || !customized || !hasExtraFaces) return null;
    return createCustomFaceMap({
      aspect: topAspect,
      baseHex: style.board,
      accent: style.secondary,
      artwork,
      brand,
      margin: 0.12,
    });
  }, [flexible, customized, hasExtraFaces, topAspect, style.board, style.secondary, artwork, brand]);

  useEffect(() => {
    return () => {
      paper?.map.dispose();
      paper?.roughnessMap.dispose();
      boxPrint?.dispose();
    };
  }, [paper, boxPrint]);

  useEffect(() => () => sideMap?.dispose(), [sideMap]);
  useEffect(() => () => topMap?.dispose(), [topMap]);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.012;
    }
  });

  const boardColor =
    !look && (previewKind === "shipper" || previewKind === "display") ? "#c4a574" : style.board;

  const boardProps = useMemo(
    () => ({
      color: boardColor,
      map: paper?.map,
      roughnessMap: paper?.roughnessMap,
      roughness: previewKind === "shipper" ? 0.85 : style.roughness,
      metalness: previewKind === "shipper" ? 0.02 : style.metalness,
      clearcoat: previewKind === "shipper" ? 0.08 : style.clearcoat,
      clearcoatRoughness: style.clearcoatRoughness,
      envMapIntensity: style.envMapIntensity,
      sheen: style.sheen,
      sheenColor: new THREE.Color("#ffffff"),
      sheenRoughness: finish === "soft" ? 0.85 : 0.4,
      reflectivity: 0.55,
      ior: 1.45,
    }),
    [style, paper, finish, boardColor, previewKind],
  );

  if (flexible) {
    return (
      <group ref={group}>
        <StandUpPouchMesh
          size={size}
          finish={finish}
          boardProps={boardProps}
          dims={dims}
          variant={previewKind as "doypack" | "flat-bottom-pouch" | "block-bag" | "sachet" | "spouted" | "hybrid"}
          industryLabel={industry}
          brand={brand}
        />
      </group>
    );
  }

  return (
    <group ref={group}>
      {(previewKind === "folding-carton" || previewKind === "carton-sleeve") && (
        <FoldingCartonMesh
          size={size}
          finish={finish}
          boardProps={boardProps}
          hasSleeve={previewKind === "carton-sleeve"}
          lidOpen={lidOpen}
          paper={paper}
          printMap={boxPrint}
          sideMap={sideMap}
          topMap={topMap}
        />
      )}
      {previewKind === "rigid-setup" && (
        <RigidSetupMesh
          size={size}
          finish={finish}
          boardProps={boardProps}
          lidOpen={lidOpen}
          paper={paper}
          printMap={boxPrint}
        />
      )}
      {previewKind === "rigid-drawer" && (
        <RigidSetupMesh
          size={size}
          finish={finish}
          boardProps={boardProps}
          lidOpen={lidOpen}
          paper={paper}
          printMap={boxPrint}
        />
      )}
      {(previewKind === "mailer" || previewKind === "shipper" || previewKind === "display") && (
        <MailerBoxMesh
          size={size}
          finish={finish}
          boardProps={boardProps}
          lidOpen={lidOpen}
          paper={paper}
          printMap={boxPrint}
        />
      )}
    </group>
  );
}

function CameraFramer({
  size,
  isFlexible,
}: {
  size: [number, number, number];
  isFlexible: boolean;
}) {
  const { camera } = useThree();
  const controls = useThree((s) => s.controls) as unknown as
    | { target: THREE.Vector3; update: () => void }
    | undefined;

  useEffect(() => {
    const [l, h, w] = size;
    const span = Math.sqrt(l * l + w * w + h * h);
    const dist = Math.max(3.2, span * (isFlexible ? 1.7 : 1.9));
    if (isFlexible) {
      camera.position.set(dist * 0.42, Math.max(1.15, h * 0.32 + 0.95), dist * 1.15);
    } else {
      camera.position.set(dist * 0.95, Math.max(1.35, h * 0.6 + 1.1), dist * 0.82);
    }
    camera.updateProjectionMatrix();
    if (controls?.target) {
      controls.target.set(0, Math.max(0.2, h * (isFlexible ? 0.18 : 0.25)), 0);
      controls.update();
    }
  }, [camera, controls, size, isFlexible]);

  return null;
}

function StudioEffects({ finish }: { finish: FinishId }) {
  const bloom = finish === "gloss" || finish === "foil" ? 0.18 : 0.06;
  return (
    <EffectComposer multisampling={8}>
      <SMAA />
      <Bloom luminanceThreshold={0.88} intensity={bloom} mipmapBlur luminanceSmoothing={0.2} />
      {/* Soft edge falloff — light studio, not dark tunnel */}
      <Vignette offset={0.35} darkness={0.18} />
    </EffectComposer>
  );
}

function CaptureBridge({
  captureRef,
}: {
  captureRef: MutableRefObject<((quality: ExportQuality) => Promise<void>) | null>;
}) {
  const { gl, scene, camera, size } = useThree();

  useEffect(() => {
    captureRef.current = async (quality: ExportQuality) => {
      const longEdge = exportTargets[quality].longEdge;
      const aspect = Math.max(size.width / Math.max(size.height, 1), 0.5);
      const exportW = aspect >= 1 ? longEdge : Math.round(longEdge * aspect);
      const exportH = aspect >= 1 ? Math.round(longEdge / aspect) : longEdge;

      const prevSize = new THREE.Vector2();
      gl.getSize(prevSize);
      const prevPixelRatio = gl.getPixelRatio();
      const prevTone = gl.toneMappingExposure;

      // Full-resolution still: freeze orbit, bump pixel budget, then restore.
      gl.setPixelRatio(1);
      gl.setSize(exportW, exportH, false);
      gl.toneMappingExposure = prevTone;
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = exportW / exportH;
        camera.updateProjectionMatrix();
      }

      // Multi-sample accumulate for cleaner stills
      for (let i = 0; i < 3; i++) {
        gl.render(scene, camera);
      }

      const dataUrl = gl.domElement.toDataURL("image/png");

      gl.setPixelRatio(prevPixelRatio);
      gl.setSize(prevSize.x, prevSize.y, false);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = prevSize.x / Math.max(prevSize.y, 1);
        camera.updateProjectionMatrix();
      }
      gl.render(scene, camera);

      const link = document.createElement("a");
      link.download = `boxora-mockup-${quality}-${exportW}x${exportH}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    };

    return () => {
      captureRef.current = null;
    };
  }, [gl, scene, camera, size, captureRef]);

  return null;
}

function Scene({
  length,
  width,
  height,
  finish,
  boxType,
  styleId,
  industry,
  brand,
  baseColor,
  artworkUrl,
  autoRotate,
  lidOpen,
  captureRef,
}: Props & {
  autoRotate: boolean;
  lidOpen: number;
  captureRef: MutableRefObject<((quality: ExportQuality) => Promise<void>) | null>;
}) {
  const L = clamp(length || 1, 0.5, 48);
  const W = clamp(width || 1, 0.5, 48);
  const H = clamp(height || 1, 0.5, 48);
  const previewKind = resolvePreviewKind(styleId, boxType);
  const flexible = isFlexiblePreview(previewKind);

  const size = useMemo(() => toSceneSize(L, W, H), [L, W, H]);
  const dims = useMemo(() => ({ L, W, H }), [L, W, H]);
  const [, h] = size;
  const stageY = -1.15;
  const boxLift = flexible ? stageY + 1.15 : stageY + h / 2 + 0.2;

  return (
    <LookContext.Provider value={baseColor ?? null}>
      {/* Bright product-studio backdrop */}
      <color attach="background" args={["#e9e7cc"]} />
      <fog attach="fog" args={["#e8edf5", 9, 20]} />

      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#ffffff", "#c5d0e8", 0.85]} />

      <directionalLight
        position={[4.8, 9.2, 3.6]}
        intensity={1.55}
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.00012}
        shadow-normalBias={0.02}
      >
        <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 0.5, 24]} />
      </directionalLight>
      <directionalLight position={[-3.8, 4.2, -2.2]} intensity={0.45} color="#8aa4ff" />
      <directionalLight position={[1.5, 2.8, 4.5]} intensity={0.28} color="#fff8f0" />
      <SoftKeyLights />

      <Environment preset="apartment" environmentIntensity={0.85} />

      <group position={[0, boxLift, 0]}>
        <PhotorealCarton
          size={size}
          finish={finish}
          previewKind={previewKind}
          lidOpen={flexible ? 0 : lidOpen}
          boxType={boxType}
          dims={dims}
          industry={industry}
          brand={brand}
          artworkUrl={artworkUrl}
        />
      </group>

      {/* Soft grounded shadow — depth without a black void */}
      <ContactShadows
        position={[0, stageY + 0.001, 0]}
        opacity={0.55}
        scale={12}
        blur={3.4}
        far={6}
        color="#1e293b"
      />

      {/* Light pedestal / stage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, stageY - 0.012, 0]} receiveShadow>
        <circleGeometry args={[4.4, 96]} />
        <meshStandardMaterial color="#f7f9fc" roughness={0.88} metalness={0.04} />
      </mesh>
      {/* Soft radial halo under product */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, stageY - 0.005, 0]}>
        <ringGeometry args={[1.15, 2.55, 96]} />
        <meshBasicMaterial color="#bdf906" transparent opacity={0.07} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, stageY - 0.004, 0]}>
        <ringGeometry args={[2.65, 2.82, 96]} />
        <meshBasicMaterial color="#bdf906" transparent opacity={0.14} />
      </mesh>

      <CameraFramer size={size} isFlexible={flexible} />
      <CaptureBridge captureRef={captureRef} />
      <StudioEffects finish={finish} />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minDistance={2.5}
        maxDistance={8.5}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate={autoRotate}
        autoRotateSpeed={0.65}
        dampingFactor={0.065}
        enableDamping
        target={[0, Math.max(0.25, h * 0.25), 0]}
      />
    </LookContext.Provider>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/90 px-5 py-4 shadow-lg backdrop-blur">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#bdf906]/30 border-t-[#bdf906]" />
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#bdf906]">
          Rendering studio
        </p>
      </div>
    </Html>
  );
}

export default function BoxPreview3D({
  length,
  width,
  height,
  finish,
  boxType,
  styleId,
  industry,
  brand,
  baseColor,
  artworkUrl,
}: Props) {
  const style = finishStyles[finish];
  const [autoRotate, setAutoRotate] = useState(true);
  const [lidOpen, setLidOpen] = useState(0);
  const [exporting, setExporting] = useState(false);
  const captureRef = useRef<((quality: ExportQuality) => Promise<void>) | null>(null);

  const L = clamp(length || 1, 0.5, 48);
  const W = clamp(width || 1, 0.5, 48);
  const H = clamp(height || 1, 0.5, 48);
  const previewKind = resolvePreviewKind(styleId, boxType);
  const flexible = isFlexiblePreview(previewKind);

  const exportPng = async () => {
    setExporting(true);
    setAutoRotate(false);
    try {
      await new Promise((r) => window.setTimeout(r, 120));
      await captureRef.current?.("4k");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-[#f5f7fb] via-[#e9e7cc] to-[#e4eaf4] shadow-[0_18px_50px_-28px_rgba(15,23,42,0.35)]"
      onPointerDown={() => setAutoRotate(false)}
      onPointerUp={() => setAutoRotate(true)}
      onPointerLeave={() => setAutoRotate(true)}
    >
      {/* Soft studio atmosphere wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,rgba(189,249,6,0.09),transparent_58%),radial-gradient(ellipse_at_80%_90%,rgba(255,255,255,0.7),transparent_45%)]"
      />

      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-3 p-4 md:p-5">
        <div className="pointer-events-none min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary/70">
            Live packaging mockup
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-dark" title={boxType}>
            {boxType}
          </p>
          <p className="mt-0.5 text-[11px] text-lighter">
            Drag to rotate · scroll to zoom
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span className="rounded-full border border-border bg-white/90 px-3 py-1 text-[11px] font-bold text-dark shadow-sm backdrop-blur">
            {style.label}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={exportPng}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/95 px-3 py-1.5 text-[11px] font-bold text-dark shadow-sm backdrop-blur transition hover:border-primary/30 hover:text-primary disabled:opacity-60"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2.5} />
              {exporting ? "Rendering 4K…" : "Export PNG"}
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-[400px] w-full cursor-grab active:cursor-grabbing md:h-[460px]">
        <Canvas
          shadows
          dpr={[1, 2.5]}
          camera={{ position: [3.15, 1.95, 3.55], fov: 30, near: 0.05, far: 50 }}
          gl={{
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.12,
          }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFShadowMap;
            gl.outputColorSpace = THREE.SRGBColorSpace;
          }}
        >
          <Suspense fallback={<Loader />}>
            <Scene
              length={length}
              width={width}
              height={height}
              finish={finish}
              boxType={boxType}
              styleId={styleId}
              industry={industry}
              brand={brand}
              baseColor={baseColor}
              artworkUrl={artworkUrl}
              autoRotate={autoRotate}
              lidOpen={lidOpen}
              captureRef={captureRef}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border/80 bg-white/80 px-3 py-2.5 backdrop-blur">
        {!flexible ? (
          <div className="flex min-w-[180px] flex-1 items-center gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-lighter">
              Lid
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={lidOpen}
              onChange={(e) => setLidOpen(Number(e.target.value))}
              className="h-1.5 w-full max-w-[180px] cursor-pointer appearance-none rounded-full bg-background-field accent-primary"
            />
            <span className="w-10 text-right text-[11px] font-bold text-dark">
              {Math.round(lidOpen * 100)}%
            </span>
          </div>
        ) : (
          <span className="text-[11px] font-semibold text-lighter">
            {previewKind === "sachet"
              ? "Sachet / stick pack · tear-notch seal"
              : previewKind === "spouted"
                ? "Spouted pouch · cap + fitment"
                : previewKind === "block-bag"
                  ? "Block / gusset bag · retail shelf base"
                  : previewKind === "hybrid"
                    ? "Barrier pouch + outer mailer combo"
                    : "Stand-up pouch · zipper + valve detail"}
          </span>
        )}

        <div className="grid grid-cols-3 gap-2">
          {[
            ["L", L],
            ["W", W],
            ["H", H],
          ].map(([k, v]) => (
            <div
              key={k as string}
              className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-center shadow-sm"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-primary">{k}</p>
              <p className="text-[12px] font-bold text-dark">{(v as number).toFixed(1)}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
