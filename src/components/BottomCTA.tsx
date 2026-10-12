"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { Search } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { label: "account", href: "#" },
  { label: "cart", href: "#" },
];

export default function BottomCTA() {
  return (
    <section className="border-t border-border bg-background-field py-16">
      <div className="container-main">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl text-dark md:text-4xl">Search</h2>
            <div className="relative mx-auto mt-6 max-w-lg">
              <input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-full border border-border bg-white px-6 py-4 pr-14 text-dark shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                aria-label="Search"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-bold uppercase tracking-[0.15em] text-text transition hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
