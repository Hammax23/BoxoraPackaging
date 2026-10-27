import QuoteForm from "@/components/QuoteForm";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { Check, Clock, Palette, Truck } from "lucide-react";

const points = [
  { icon: Palette, title: "Free design support", text: "Our team helps get your artwork print-ready." },
  { icon: Clock, title: "Fast turnaround", text: "A tailored quote back within 1 business day." },
  { icon: Truck, title: "Free shipping", text: "Delivered to your door, with order tracking." },
];

export default function QuoteSection({ source, industry, asPage = false, joinNext = false }: { source: string; industry?: string; asPage?: boolean; joinNext?: boolean }) {
  const Heading = asPage ? "h1" : "h2";
  return (
    <section id="quote" className={`section-padding bg-background-field ${joinNext ? "!pb-0" : ""}`}>
      <div className="container-main grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14 xl:gap-20">
        <AnimatedSection>
          <Heading className="font-heading text-[34px] leading-tight text-dark md:text-[46px]">
            Get a free <span className="rounded-lg bg-primary px-2 text-dark [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">packaging quote</span>
          </Heading>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-text md:text-lg">
            Tell us what you need, from size and quantity to artwork, and our team will get back to you with a tailored quote.
          </p>

          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p.title} className="flex items-start gap-4 rounded-2xl border border-border bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dark text-[#bdf906]">
                  <p.icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <div>
                  <h3 className="font-heading text-[16px] leading-snug text-dark">{p.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-text">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-dark">
            <Check className="h-4 w-4" strokeWidth={3} /> No obligation. Only name, email, phone and quantity are required.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="rounded-[28px] bg-white p-6 shadow-[0_12px_40px_rgba(3,90,83,0.08)] sm:p-9">
          <QuoteForm source={source} industry={industry} />
        </AnimatedSection>
      </div>
    </section>
  );
}
