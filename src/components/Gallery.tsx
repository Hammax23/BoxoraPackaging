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

        <div className="mt-10 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
          {images.map((im, i) => (
            <div key={im.image + i} className="relative break-inside-avoid overflow-hidden rounded-2xl bg-white">
              <Image
                src={im.image}
                alt={im.alt || "Custom packaging project"}
                width={768}
                height={i % 3 === 0 ? 960 : 768}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="h-auto w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href={content.href || "/products"} className="inline-flex rounded-full bg-dark px-8 py-3.5 text-sm font-bold text-white transition hover:bg-primary">
            {content.button}
          </Link>
        </div>
      </div>
    </section>
  );
}
