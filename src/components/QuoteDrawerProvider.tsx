"use client";

import { QUOTE_DRAWER_EVENT, type QuoteDrawerPayload } from "@/lib/quoteDrawer";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Every "get a quote" button on the site calls openQuoteDrawer(). They all lead to the same
 * place now: the instant quote tool on /quote (pre-filled with the product when we know it).
 */
export default function QuoteDrawerProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<QuoteDrawerPayload>).detail ?? {};
      const product = detail.productName;

      if (pathname === "/quote" && !product) {
        document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      router.push(product ? `/quote?product=${encodeURIComponent(product)}` : "/quote");
    };

    window.addEventListener(QUOTE_DRAWER_EVENT, onOpen as EventListener);
    return () => window.removeEventListener(QUOTE_DRAWER_EVENT, onOpen as EventListener);
  }, [pathname, router]);

  return <>{children}</>;
}
