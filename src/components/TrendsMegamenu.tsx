import { trendsMegamenu } from "@/lib/data";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TrendsMegamenu({ onNavigate }: { onNavigate?: () => void }) {
  const { title, items, cta, viewAll } = trendsMegamenu;

  return (
    <div className="mx-auto w-full max-w-[1320px] px-6 py-8 xl:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] xl:gap-10">
        {/* Left — trend items + bottom button */}
        <div>
          <h3 className="font-heading text-[26px] leading-tight text-dark xl:text-[30px]">
            {title}
          </h3>

          <div className="mt-5 space-y-4">
            {items.slice(0, 3).map((item) => (
              <Link
                key={item.title}
                href={item.href}
                onClick={onNavigate}
                className="group flex items-center gap-4 rounded-3xl border border-border bg-white p-5 transition hover:bg-background-field"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-background-field xl:h-[60px] xl:w-[60px]">
                  <Image src={item.image} alt={item.title} fill className="object-cover" sizes="60px" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[15px] font-bold leading-tight text-dark transition group-hover:text-primary xl:text-base">
                    {item.title}
                  </h4>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-text">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-lighter transition group-hover:text-primary" />
              </Link>
            ))}
          </div>

          <div className="mt-6 flex justify-center lg:justify-end">
            <Link
              href={viewAll.href}
              onClick={onNavigate}
              className="btn-slip inline-flex items-center justify-center rounded-full bg-primary px-10 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-primary/90"
            >
              {viewAll.label}
            </Link>
          </div>
        </div>

        {/* Right — help card */}
        <div className="overflow-hidden rounded-3xl bg-primary">
          <div className="flex h-full flex-col items-center justify-center px-7 py-8 text-center text-white">
            <h4 className="font-heading text-[26px] leading-tight">{cta.title}</h4>
            <p className="mt-4 text-[13px] leading-relaxed text-white/90">{cta.description}</p>

            <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.12em] text-white/85">
              {cta.phoneLabel}
            </p>
            <a
              href={`tel:${cta.phone.replace(/[^\d+]/g, "")}`}
              className="mt-2 block font-heading text-2xl text-white transition hover:opacity-80"
            >
              {cta.phone}
            </a>

            <Link
              href={cta.buttonHref}
              onClick={onNavigate}
              className="mt-7 inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-primary transition hover:bg-white/95"
            >
              {cta.buttonLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

