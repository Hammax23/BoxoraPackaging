import AnimatedSection from "@/components/ui/AnimatedSection";
import type { StyleView } from "@/lib/queries/pageContent";
import { ArrowRight } from "lucide-react";
import StyleCarousel from "@/components/StyleCarousel";
import Link from "next/link";

type Heading = { title: string; highlight: string; text: string; button: string };

export default function StyleGrid({ styles, heading }: { styles: StyleView[]; heading: Heading }) {
  return (
    <section id="packaging-styles" className="section-padding bg-white">
      <div className="container-main">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-[34px] leading-tight text-dark md:text-[46px]">
            {heading.title} <span className="rounded-lg bg-primary px-2 text-dark [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">{heading.highlight}</span>
          </h2>
          <p className="mt-4 text-base text-text md:text-lg">{heading.text}</p>
        </AnimatedSection>
      </div>

      <StyleCarousel styles={styles} />

      <div className="container-main">
        <div className="mt-10 text-center">
          <Link href="/styles" className="inline-flex items-center gap-2 rounded-full bg-dark px-8 py-3.5 text-sm font-bold text-white transition hover:bg-primary hover:text-dark">
            {heading.button} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
