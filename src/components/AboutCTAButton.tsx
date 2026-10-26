"use client";

import { openQuoteDrawer } from "@/lib/quoteDrawer";
import { ArrowRight } from "lucide-react";

export default function AboutCTAButton({
  label = "Get a free quote",
  variant = "primary",
  source = "about",
  productName,
}: {
  label?: string;
  variant?: "primary" | "light";
  source?: string;
  productName?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-primary text-white shadow-[0_12px_36px_rgba(189,249,6,0.4)] hover:bg-[#8fbf00]"
      : "bg-white text-dark hover:bg-background-field";
  return (
    <button
      type="button"
      onClick={() => openQuoteDrawer({ source, productName })}
      className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold transition ${styles}`}
    >
      {label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
