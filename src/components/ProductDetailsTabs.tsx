"use client";

import type { Product } from "@/lib/data";
import { Box, FileText, Layers, MessageSquare, Palette, Scan, Star } from "lucide-react";
import { useState } from "react";

type TabId = "additional" | "design" | "description" | "reviews";

const tabs: { id: TabId; label: string }[] = [
  { id: "additional", label: "Additional Information" },
  { id: "design", label: "Design & Artwork" },
  { id: "description", label: "Description" },
  { id: "reviews", label: "Reviews" },
];

const designCards = [
  {
    icon: FileText,
    title: "File formats",
    text: "Upload print-ready PDF, AI or EPS files. High-resolution PNG or JPG also works.",
  },
  {
    icon: Palette,
    title: "Color & resolution",
    text: "Use CMYK color mode and 300 dpi images. Tell us your PMS colors for exact brand matches.",
  },
  {
    icon: Scan,
    title: "Bleed & safe area",
    text: "Add bleed past the cut line and keep key text and logos inside the safe area.",
  },
  {
    icon: Layers,
    title: "Need help with design?",
    text: "Our team can prepare dielines and check your artwork. We send a proof for approval before printing.",
  },
];

const infoCards = [
  {
    icon: Box,
    title: "Box Style",
    text: "RTE — Reverse Tuck End, STE — Straight Tuck End and Tuck Top Auto Bottom styles. All customized styles available.",
  },
  {
    icon: Scan,
    title: "Dimensions",
    text: "Standard size: 1.5 × 1.5 × 4.5 inch. All custom sizes supported for your product fit.",
  },
  {
    icon: FileText,
    title: "Print Color Options",
    text: "CMYK full-color printing, PMS, silver or gold metallic inks.",
  },
  {
    icon: Layers,
    title: "Paper Options",
    text: "18pt, 24pt, 32pt, white kraft, brown kraft & textured linen stock.",
  },
  {
    icon: Box,
    title: "Order Quantity",
    text: "MOQ: No minimums — any quantity between 5 to 50,000 units.",
    fullWidth: true,
  },
];

function InfoCard({
  icon: Icon,
  title,
  text,
  fullWidth,
}: {
  icon: typeof Box;
  title: string;
  text: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-border/60 bg-[#f7f8fa] px-4 py-4 transition hover:border-primary/20 hover:bg-[#f3f5f9] sm:px-5 sm:py-5 md:px-6 md:py-6 ${
        fullWidth ? "col-span-full" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-dark shadow-sm">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
        <div className="min-w-0 space-y-2">
          <h3 className="text-[15px] font-bold text-dark">{title}</h3>
          <p className="text-sm leading-relaxed text-text">{text}</p>
        </div>
      </div>
    </div>
  );
}

function RatingBar({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < filled ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

export default function ProductDetailsTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<TabId>("additional");

  return (
    <section className="mt-10 border-t border-border pt-8 sm:mt-14 sm:pt-10 md:mt-16 md:pt-12">
      {/* Tabs */}
      <div className="-mx-5 overflow-x-auto px-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-5 border-b border-border sm:min-w-0 sm:flex-wrap sm:gap-8 md:gap-10">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 whitespace-nowrap pb-4 text-left text-sm font-semibold transition sm:text-[15px] ${
                  active ? "text-primary" : "text-lighter hover:text-dark"
                }`}
              >
                {tab.label}
                {active && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab panels */}
      <div className="pt-6 sm:pt-8 md:pt-10">
        {activeTab === "additional" && (
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {infoCards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        )}

        {activeTab === "design" && (
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {designCards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </div>
        )}

        {activeTab === "description" && (
          <div className="max-w-3xl space-y-5">
            <p className="text-base leading-relaxed text-text md:text-lg">
              {product.description}
            </p>
            <p className="text-sm leading-relaxed text-text md:text-base">
              Our {product.name.toLowerCase()} is built for brands that need reliable structure,
              premium print quality, and flexible sizing. Whether you are launching a new SKU or
              refreshing retail packaging, we help you match the right board, finish, and print
              method to your product and shipping needs.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Food-safe and retail-ready material options",
                "Custom dielines and structural engineering support",
                "Matte, gloss, soft-touch and foil-ready finishes",
                "Low minimums with volume pricing available",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-[#f7f8fa] px-4 py-3 text-sm text-text"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-[#f7f8fa] px-5 py-5 md:px-6">
              <div className="text-4xl font-bold text-dark">{product.rating.toFixed(1)}</div>
              <div>
                <RatingBar rating={product.rating} />
                <p className="mt-1 text-sm text-lighter">
                  Based on {product.reviews} verified review{Number(product.reviews) === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  name: "Sarah M.",
                  text: "Excellent print quality and the team helped us finalize the right size quickly.",
                },
                {
                  name: "James L.",
                  text: "Professional packaging with a premium feel. Our customers noticed the upgrade immediately.",
                },
              ].map((review) => (
                <article
                  key={review.name}
                  className="rounded-2xl border border-border/60 bg-white px-5 py-5 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-dark">{review.name}</p>
                    <RatingBar rating={5} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-text">{review.text}</p>
                </article>
              ))}
            </div>

            <p className="flex items-center gap-2 text-sm text-lighter">
              <MessageSquare className="h-4 w-4" />
              Reviews are collected after verified production and delivery.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
