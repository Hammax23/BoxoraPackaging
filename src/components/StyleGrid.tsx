import AnimatedSection from "@/components/ui/AnimatedSection";
import type { StyleView } from "@/lib/queries/pageContent";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Whole rows of 3 only, so there is never a lonely last card (the rest are on /styles). */}
          {styles.slice(0, styles.length >= 3 ? styles.length - (styles.length % 3) : styles.length).map((s, i) => (
            <AnimatedSection key={s.slug} delay={(i % 3) * 0.07}>
              <Link
                href={s.href}
                className="group flex h-full flex-col overflow-hidden rounded-[16px] border-2 border-border bg-white transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_24px_60px_rgba(189,249,6,0.18)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-background-field">
                  <Image src={s.image} alt={s.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-[22px] leading-snug text-dark">{s.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-text">{s.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Customize Now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" strokeWidth={2.5} />
                  </span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/styles" className="inline-flex items-center gap-2 rounded-full bg-dark px-8 py-3.5 text-sm font-bold text-white transition hover:bg-primary">
            {heading.button} <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
