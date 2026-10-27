"use client";

import { useSiteContent } from "@/components/SiteContentProvider";
import { ChevronRight, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MAX_STYLES = 10;

export default function PackagingStylesMegamenu({ onNavigate }: { onNavigate?: () => void }) {
  const { styles, menus } = useSiteContent();
  const banners = menus.stylesBanners;

  return (
    <div className="mx-auto w-full max-w-[1320px] px-6 py-8 xl:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] xl:gap-10">
        {/* Left — Packaging styles (Industries-style list, but with specs) */}
        <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2 xl:gap-x-14 xl:gap-y-6">
          {styles.slice(0, MAX_STYLES).map((style) => (
            <Link
              key={style.title}
              href={style.href}
              onClick={onNavigate}
              className="group flex items-center gap-4 transition hover:opacity-80"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-background-field xl:h-[60px] xl:w-[60px]">
                <Image src={style.image} alt={style.title} fill className="object-cover" sizes="60px" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[15px] font-bold leading-tight text-dark transition group-hover:text-primary xl:text-base">
                  {style.title}
                </h4>
                <p className="mt-1 text-[13px] leading-snug text-lighter">{style.specs.slice(0, 2).join(" • ")}</p>
              </div>
            </Link>
          ))}
          <div className="sm:col-span-2">
            <Link
              href="/styles"
              onClick={onNavigate}
              className="inline-flex items-center gap-2 rounded-full bg-dark px-6 py-3 text-sm font-bold text-white transition hover:bg-primary hover:text-dark"
            >
              <LayoutGrid className="h-4 w-4" />
              View all styles
            </Link>
          </div>
        </div>

        {/* Right — Promo banners (same as Industries) */}
        <div className="flex flex-col gap-5">
          {banners.map((banner) => (
            <Link
              key={banner.title}
              href={banner.href}
              onClick={onNavigate}
              className="group relative min-h-[160px] overflow-hidden rounded-3xl xl:min-h-[175px]"
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="340px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              <div className="relative flex h-full flex-col justify-between p-6">
                <div>
                  <h3 className="font-heading text-[26px] leading-tight text-white xl:text-[30px]">
                    {banner.title}
                  </h3>
                  {banner.description && (
                    <p className="mt-2 max-w-[220px] text-[13px] leading-relaxed text-white/90">
                      {banner.description}
                    </p>
                  )}
                </div>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-white">
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={3} />
                  Shop now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
