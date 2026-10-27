"use client";

import StarRating from "@/components/ui/StarRating";
import type { Product } from "@/lib/data";
import { ArrowRight, Grid2X2, LayoutGrid, List, PackageSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Sort = "default" | "price-asc" | "price-desc" | "rating";

const priceOf = (p: Product) => p.salePrice ?? p.price ?? 0;

function Price({ p }: { p: Product }) {
  if (!priceOf(p)) return <span className="text-sm font-semibold text-lighter">Request a quote</span>;
  return p.salePrice ? (
    <div className="flex items-center gap-2">
      {p.discount && <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{p.discount}</span>}
      <span className="text-[15px] font-bold text-primary">${p.salePrice.toFixed(2)}</span>
      <span className="text-[13px] text-lighter line-through">${(p.price ?? 0).toFixed(2)}</span>
    </div>
  ) : (
    <span className="text-[15px] font-bold text-dark">From ${(p.price ?? 0).toFixed(2)}</span>
  );
}

export default function CategoryResults({ products, industry }: { products: Product[]; industry: string }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<Sort>("default");

  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === "price-asc") list.sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === "price-desc") list.sort((a, b) => priceOf(b) - priceOf(a));
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, sort]);

  const viewBtn = (active: boolean) =>
    `rounded-lg p-2 transition ${active ? "bg-background-field text-dark" : "text-lighter hover:bg-background-field hover:text-dark"}`;

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-lighter">
          Showing <span className="font-bold text-dark">{products.length}</span> {products.length === 1 ? "result" : "results"}
        </p>
        {products.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Grid view" aria-pressed={view === "grid"} onClick={() => setView("grid")} className={viewBtn(view === "grid")}>
                <Grid2X2 className="h-5 w-5" />
              </button>
              <button type="button" aria-label="List view" aria-pressed={view === "list"} onClick={() => setView("list")} className={viewBtn(view === "list")}>
                <List className="h-5 w-5" />
              </button>
            </div>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 rounded-full border border-border bg-white px-4 text-sm font-semibold text-text outline-none focus:border-primary"
            >
              <option value="default">Default sorting</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-[24px] border border-dashed border-border bg-background-field/40 px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-dark text-[#bdf906]">
            <PackageSearch className="h-7 w-7" strokeWidth={2} />
          </span>
          <h2 className="mt-5 font-heading text-[24px] leading-tight text-dark">Custom {industry.toLowerCase()} packaging, made for you</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text">
            {`We don't have ready-made ${industry.toLowerCase()} products listed yet, but we make this packaging to order. Tell us what you need and we'll send a quote.`}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/quote" className="inline-flex items-center gap-2 rounded-full bg-dark px-6 py-3 text-sm font-bold text-white transition hover:bg-primary hover:text-dark">
              Get a free quote <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <Link href="/products" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-sm font-bold text-dark transition hover:border-primary">
              <LayoutGrid className="h-4 w-4" /> Browse all products
            </Link>
          </div>
        </div>
      ) : (
        <div className={view === "grid" ? "mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3" : "mt-6 space-y-4"}>
          {sorted.map((p) => (
            <article
              key={p.slug}
              className={`group relative overflow-hidden rounded-[22px] border border-border bg-white transition hover:-translate-y-1 hover:border-primary hover:shadow-[0_20px_55px_rgba(189,249,6,0.16)] ${
                view === "list" ? "flex flex-col sm:flex-row" : ""
              }`}
            >
              <Link href={`/products/${p.slug}`} aria-label={`View ${p.name}`} className={`relative block bg-background-field/50 p-4 ${view === "list" ? "sm:w-[220px] sm:shrink-0" : ""}`}>
                <div className="relative mx-auto aspect-square max-w-[260px]">
                  <Image src={p.image} alt={p.name} fill className="object-contain p-2 transition duration-500 group-hover:scale-105" sizes="260px" />
                </div>
                {p.onSale && <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase text-dark">Sale</span>}
              </Link>

              <div className="flex flex-1 flex-col space-y-2 p-5">
                <h3 className="font-heading text-[18px] leading-snug text-dark">
                  <Link href={`/products/${p.slug}`} className="transition hover:text-primary">
                    {p.name}
                  </Link>
                </h3>
                <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-text">{p.description}</p>
                <Price p={p} />
                <StarRating rating={p.rating} reviews={p.reviews} />
                <Link href={`/products/${p.slug}`} className="inline-flex items-center gap-1.5 pt-1 text-[13px] font-bold uppercase tracking-[0.08em] text-primary">
                  View specs &amp; order
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" strokeWidth={2.5} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
