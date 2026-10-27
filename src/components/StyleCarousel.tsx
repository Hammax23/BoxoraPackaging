"use client";

import AutoCarousel from "@/components/AutoCarousel";
import type { StyleView } from "@/lib/queries/pageContent";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function StyleCarousel({ styles }: { styles: StyleView[] }) {
  const items = styles.map((s) => (
    <Link
      key={s.slug}
      href={s.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_16px_36px_rgba(189,249,6,0.22)]"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-background-field">
        <Image src={s.image} alt={s.title} fill sizes="260px" className="object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-[17px] leading-snug text-dark">{s.title}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-text">{s.description}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary">
          Customize Now <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  ));
  return <AutoCarousel items={items} itemClassName="w-[220px] sm:w-[240px] lg:w-[260px]" label="styles" />;
}
