import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export type CtaContent = { title: string; highlight: string; text: string; button: string };

export default function CtaBand({ content, phone }: { content: CtaContent; phone: string }) {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="container-main">
        <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[16px] bg-dark ring-1 ring-primary/40 px-7 py-10 md:flex-row md:items-center md:px-12 md:py-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative">
            <h2 className="font-heading text-[28px] leading-tight text-white md:text-[38px]">
              {content.title} <span className="text-secondary">{content.highlight}</span>
            </h2>
            <p className="mt-2 text-sm text-white/70 md:text-base">{content.text}</p>
          </div>
          <div className="relative flex flex-wrap gap-3">
            <Link href="/quote" className="btn-slip inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:bg-primary/90">
              {content.button} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
              <Phone className="h-4 w-4" /> {phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
