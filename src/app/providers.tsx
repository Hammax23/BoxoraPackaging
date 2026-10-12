"use client";

import QuoteDrawerProvider from "@/components/QuoteDrawerProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <QuoteDrawerProvider>{children}</QuoteDrawerProvider>;
}

