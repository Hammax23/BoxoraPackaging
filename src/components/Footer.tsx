"use client";

import BrandLogo from "@/components/BrandLogo";
import { footerLinks } from "@/lib/data";
import { images } from "@/lib/images";
import { ArrowUp, Globe, Mail, Share2, Rss } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <footer className="bg-dark text-white">
        <div className="container-main grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand + Social */}
          <div className="space-y-5">
            <BrandLogo variant="light" size="md" />
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              Print custom packaging and pouches. Eco-friendly, fully customisable
              solutions with worldwide delivery for your brand.
            </p>
            <div className="flex gap-2.5">
              {[Share2, Globe, Rss, Mail].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-primary hover:bg-primary"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.12em]">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-white/70 transition hover:text-primary">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Our Logistics Partners */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.12em]">
              Our Logistics Partners
            </h4>
            <div className="flex items-center gap-6">
              <img src="/logistics/fedex.svg" alt="FedEx" className="h-12 w-auto md:h-14" />
              <img src="/logistics/usps.svg" alt="USPS" className="h-12 w-auto md:h-14" />
              <img src="/logistics/dhl.svg" alt="DHL" className="h-14 w-auto md:h-[4.5rem]" />
            </div>
          </div>
        </div>

        {/* Newsletter row */}
        <div className="border-t border-white/10">
          <div className="container-main py-8">
            <div className="mx-auto max-w-xl text-center">
              <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.12em]">Newsletter</h4>
              <p className="mb-4 text-sm text-white/70">Get updates and offers in your inbox.</p>
              <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/45 focus:border-primary focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="btn-slip shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wide text-white"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="container-main flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
            <p className="text-sm text-white/55">
              © {new Date().getFullYear()} Boxora. All rights reserved.
            </p>
            <Image
              src={images.payment}
              alt="Payment methods"
              width={300}
              height={24}
              className="h-6 w-auto opacity-90"
            />
          </div>
        </div>
      </footer>

      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </>
  );
}
