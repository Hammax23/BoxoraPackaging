"use client";

import { useSiteContent } from "@/components/SiteContentProvider";
import { openQuoteDrawer } from "@/lib/quoteDrawer";
import { Phone } from "lucide-react";
import { usePathname } from "next/navigation";

/** Fixed side tab (quote) and call button, shown on every public page. */
export default function FloatingActions() {
  const { topBar } = useSiteContent();
  if (usePathname().startsWith("/adminpanel")) return null;
  return (
    <>
      <a
        href={`tel:${topBar.phone.replace(/\s/g, "")}`}
        aria-label={`Call ${topBar.phone}`}
        className="fixed bottom-24 left-0 z-40 flex h-12 w-12 items-center justify-center rounded-r-2xl bg-primary text-white shadow-lg transition hover:w-14"
      >
        <Phone className="h-5 w-5" />
      </a>
      <button
        type="button"
        onClick={() => openQuoteDrawer({ source: "side-tab" })}
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 rounded-l-xl bg-dark px-3 py-5 text-[12px] font-bold tracking-wide text-white shadow-lg transition hover:bg-primary [writing-mode:vertical-rl] md:block"
      >
        Request a Quote
      </button>
    </>
  );
}
