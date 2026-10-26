import AnimatedSection from "@/components/ui/AnimatedSection";

export type BrandsContent = { title: string; text: string; logos: { name: string; logo: string }[] };

export default function Brands({ content }: { content: BrandsContent }) {
  const logos = content.logos.filter((l) => l.logo);
  if (!logos.length) return null;
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-[30px] leading-tight text-dark md:text-[40px]">{content.title}</h2>
          <p className="mt-3 text-base text-text">{content.text}</p>
        </AnimatedSection>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((l) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={l.logo} src={l.logo} alt={l.name || "Brand logo"} className="h-12 w-auto max-w-[150px] object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0" />
          ))}
        </div>
      </div>
    </section>
  );
}
