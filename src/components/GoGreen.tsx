"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { images } from "@/lib/images";
import Image from "next/image";

const promises = [
  {
    title: "The Bocpak Promise",
    text: "We guarantee the highest quality products and customer experience with every order!",
  },
  {
    title: "Extensive Option Library",
    text: "Access over 50+ options that you can utilize to create your very own unique box experience.",
  },
];

export default function GoGreen() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
          <AnimatedSection>
            <span className="section-label text-primary">eco-conscious businesses</span>
            <h2 className="mt-3 font-heading text-[34px] leading-tight text-dark md:text-[44px]">
              Go green with custom eco-friendly packaging
            </h2>
            <p className="mt-4 text-lg text-text">
              Packaging is the first impression your brand makes on a customer.
            </p>
            <div className="mt-8 space-y-4">
              {promises.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-border bg-background-field p-6"
                >
                  <h3 className="font-heading text-2xl text-dark">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text">{item.text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection
            delay={0.12}
            className="relative min-h-[300px] overflow-hidden rounded-[40px] lg:h-full lg:min-h-0"
          >
            <Image
              src={images.goGreen}
              alt="Eco packaging"
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
