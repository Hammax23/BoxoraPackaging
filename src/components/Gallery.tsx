import AutoCarousel from "@/components/AutoCarousel";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Image from "next/image";
import Link from "next/link";

export type GalleryContent = {
  title: string;
  highlight: string;
  text: string;
  button: string;
  href: string;
  images: { image: string; alt: string }[];
};

export default function Gallery({ content }: { content: GalleryContent }) {
  const images = content.images.filter((i) => i.image);
  if (!images.length) return null;
  return (
    <section className="section-padding bg-background-field">
      <div className="container-main">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-[34px] leading-tight text-dark md:text-[44px]">
            {content.title} <span className="rounded-lg bg-primary px-2 text-dark [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">{content.highlight}</span>
          </h2>
          <p className="mt-4 text-base text-text md:text-lg">{content.text}</p>
        </AnimatedSection>

      </div>

      <AutoCarousel
        label="projects"
        itemClassName="w-[200px] sm:w-[230px] lg:w-[260px]"
        items={images.map((im, i) => (
          <div key={im.image + i} className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
            <Image
              src={im.image}
              alt={im.alt || "Custom packaging project"}
              fill
              sizes="260px"
              className="object-contain p-3 transition duration-500 hover:scale-105"
            />
          </div>
        ))}
      />

      <div className="container-main">
        <div className="mt-6 text-center">
          <Link href={content.href || "/products"} className="inline-flex rounded-full bg-dark px-8 py-3.5 text-sm font-bold text-white transition hover:bg-primary hover:text-dark">
            {content.button}
          </Link>
        </div>
      </div>
    </section>
  );
}
