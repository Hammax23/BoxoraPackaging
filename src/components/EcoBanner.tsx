"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { images } from "@/lib/images";
import Image from "next/image";

const tags = ["Plastic Free", "Compostable", "biodegradable"];

export default function EcoBanner() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="grid items-center gap-10 overflow-hidden rounded-[40px] bg-background-field lg:grid-cols-2">
          <AnimatedSection className="p-8 md:p-12 lg:p-14">
            <span className="section-label text-primary">ECO-FRIENDLY PACKAGING</span>
            <h2 className="mt-4 font-heading text-[34px] leading-tight text-dark md:text-[44px]">
              Eco-Friendly! Your brand comes first.
            </h2>
            <p className="mt-4 text-lg text-text">
              Design & order personalized packaging in minutes!
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-primary/20 bg-white px-5 py-2 text-sm font-semibold text-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-9">
              <Button href="#">see all shop</Button>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="relative min-h-[320px] lg:min-h-full">
            <Image
              src={images.ecoBanner}
              alt="Eco-friendly packaging"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
