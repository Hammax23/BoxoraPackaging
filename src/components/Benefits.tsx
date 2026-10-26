import AnimatedSection from "@/components/ui/AnimatedSection";
import Image from "next/image";

export type BenefitsContent = {
  title: string;
  intro: string;
  items: { label: string; text: string }[];
  images: { image: string }[];
};

export default function Benefits({ content }: { content: BenefitsContent }) {
  const images = content.images.filter((i) => i.image).slice(0, 3);
  return (
    <section className="section-padding bg-white">
      <div className="container-main grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <AnimatedSection>
          <h2 className="font-heading text-[30px] leading-tight text-dark md:text-[40px]">{content.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-text">{content.intro}</p>
          <ul className="mt-6 space-y-4">
            {content.items.map((b) => (
              <li key={b.label} className="text-[15px] leading-relaxed text-text">
                <strong className="text-dark">{b.label}:</strong> {b.text}
              </li>
            ))}
          </ul>
        </AnimatedSection>

        {images.length > 0 && (
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {images.map((im, i) => (
                <div key={im.image} className={`relative overflow-hidden rounded-3xl bg-background-field ${i === 0 ? "row-span-2 min-h-[320px]" : "aspect-[4/3]"}`}>
                  <Image src={im.image} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
