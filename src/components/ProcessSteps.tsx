import AnimatedSection from "@/components/ui/AnimatedSection";
import { Calculator, LayoutGrid, PencilRuler, Truck } from "lucide-react";

const steps = [
  { icon: LayoutGrid, title: "Choose Your Style", text: "Pick the pouch, box or bag that suits your product, then set size, material and finish." },
  { icon: Calculator, title: "Get an Instant Quote", text: "Enter your quantity and see pricing right away, with no waiting on a sales call." },
  { icon: PencilRuler, title: "Approve Your Design", text: "Share your artwork, review the proof with our team and sign off when it looks right." },
  { icon: Truck, title: "Production & Delivery", text: "We print, quality-check and ship your order, and you can track it every step of the way." },
];

export default function ProcessSteps() {
  return (
    <section className="section-padding bg-background-field">
      <div className="container-main">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-[34px] leading-tight text-dark md:text-[46px]">
            From idea to <span className="rounded-lg bg-primary px-2 text-dark [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">doorstep</span> in 4 steps
          </h2>
          <p className="mt-4 text-base text-text md:text-lg">A simple, transparent process so you always know what happens next.</p>
        </AnimatedSection>

        <ol className="relative mt-14 grid gap-10 lg:grid-cols-4 lg:gap-6">
          {/* Connecting line: horizontal on desktop, vertical on mobile */}
          <span aria-hidden className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary lg:left-[12.5%] lg:right-[12.5%] lg:top-[27px] lg:bottom-auto lg:h-0.5 lg:w-auto lg:bg-gradient-to-r" />

          {steps.map((s, i) => (
            <li key={s.title} className="flex">
              <AnimatedSection delay={i * 0.1} className="relative flex w-full gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xl font-bold text-dark shadow-[0_0_0_6px_var(--color-background-field),0_10px_24px_rgba(189,249,6,0.45)]">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-2xl border border-border bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_16px_36px_rgba(189,249,6,0.22)] lg:mt-6">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-dark text-[#bdf906]">
                    <s.icon className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <h3 className="font-heading text-[19px] leading-snug text-dark">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text">{s.text}</p>
                </div>
              </AnimatedSection>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
