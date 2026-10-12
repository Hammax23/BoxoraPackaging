"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { images } from "@/lib/images";
import Image from "next/image";
import Link from "next/link";

export default function SpecialOffer() {
  return (
    <section className="section-padding bg-white pt-0">
      <div className="container-main">
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-[40px]">
            <div className="relative min-h-[340px] md:min-h-[380px]">
              <Image
                src={images.specialOffer}
                alt="Special offer"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark/75 via-dark/45 to-transparent" />
              <div className="relative flex h-full min-h-[340px] flex-col justify-center p-8 md:min-h-[380px] md:p-14 lg:max-w-xl">
                <span className="text-sm font-bold uppercase tracking-[0.15em] text-white/80">
                  New to Bocpak?
                </span>
                <h2 className="mt-4 font-heading text-4xl text-white md:text-5xl">
                  Special offer 15% off your first order.
                </h2>
                <p className="mt-4 text-lg text-white/85">
                  Meet your custom packaging experts!
                </p>
                <Link
                  href="#"
                  className="btn-slip mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-primary/90"
                >
                  sign up now
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
