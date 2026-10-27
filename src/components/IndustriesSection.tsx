import AnimatedSection from "@/components/ui/AnimatedSection";
import type { IndustryView } from "@/lib/queries/industries";
import { ArrowRight, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function IndustriesSection({ industries }: { industries: IndustryView[] }) {
  const shown = industries.slice(0, 10);
  if (!shown.length) return null;
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-[34px] leading-tight text-dark md:text-[46px]">
            Packaging for <span className="rounded-lg bg-primary px-2 text-dark [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">every industry</span>
          </h2>
          <p className="mt-4 text-base text-text md:text-lg">
            From food and beverage to beauty and e-commerce, find packaging made for the way your products are sold and shipped.
          </p>
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
          {shown.map((item, i) => (
            <AnimatedSection key={item.slug} delay={(i % 5) * 0.06}>
              <Link
                href={item.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_16px_36px_rgba(189,249,6,0.22)]"
              >
                <div className="relative aspect-square overflow-hidden bg-background-field">
                  {/* unoptimized: admin can paste image URLs from any host */}
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover transition duration-500 group-hover:scale-105" unoptimized />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-heading text-[16px] leading-snug text-dark">{item.name}</h3>
                  <p className="mt-1 line-clamp-2 flex-1 text-[13px] leading-relaxed text-text">{item.sub}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-primary">
                    Explore <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/industries" className="inline-flex items-center gap-2 rounded-full bg-dark px-8 py-3.5 text-sm font-bold text-white transition hover:bg-primary hover:text-dark">
            <LayoutGrid className="h-4 w-4" /> View all industries
          </Link>
        </div>
      </div>
    </section>
  );
}
