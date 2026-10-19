"use client";

import { useFormClock } from "@/lib/formClock";
import BrandLogo from "@/components/BrandLogo";
import { useIndustries } from "@/components/IndustriesProvider";
import { useSiteContent } from "@/components/SiteContentProvider";
import { images } from "@/lib/images";
import { ArrowUp, ArrowUpRight, Check, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";

const carriers = [
  { src: "/logistics/fedex.svg", alt: "FedEx" },
  { src: "/logistics/usps.svg", alt: "USPS" },
  { src: "/logistics/dhl.svg", alt: "DHL" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group flex w-fit items-center py-1 text-[13.5px] leading-5 text-white/65 sm:text-[14.5px] sm:leading-6 lg:py-0 transition-colors duration-200 hover:text-white"
    >
      <span className="mr-0 h-px w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:mr-1.5 group-hover:w-3" />
      {children}
    </Link>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-3 text-[11px] font-bold uppercase leading-6 tracking-[0.18em] text-white/45 sm:mb-5 sm:text-[12px]">
      {children}
    </h4>
  );
}

export default function Footer() {
  const stamp = useFormClock();
  const industries = useIndustries();
  const { topBar, footer } = useSiteContent();
  const [showTop, setShowTop] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const phoneHref = `tel:${topBar.phone.replace(/\s/g, "")}`;

  const subscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (subscribing) return;
    const fd = new FormData(e.currentTarget);
    stamp(fd);
    fd.set("type", "newsletter");
    fd.set("source", "footer");

    setSubscribing(true);
    setSubscribeError(null);
    try {
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setSubscribeError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubscribed(true);
      setEmail("");
    } catch {
      setSubscribeError("Could not reach the server. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      <footer className="relative overflow-hidden bg-[#080810] text-white">
        {/* Brand hairline + soft glows */}
        <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-primary" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-3xl" />

        <div className="container-main relative z-10">
          {/* One grid: every column starts on the same line */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 py-9 sm:gap-x-8 sm:gap-y-12 sm:py-14 md:py-16 lg:grid-cols-[1.45fr_1fr_1fr_1fr_1.45fr]">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <BrandLogo variant="light" size="md" />
              <p className="mt-5 hidden max-w-xs text-[14.5px] leading-relaxed text-white/60 sm:block">
                Print custom packaging and pouches. Eco-friendly, fully customisable solutions with worldwide
                delivery for your brand.
              </p>
              <ul className="mt-4 flex flex-col gap-2.5 text-[13.5px] sm:mt-6 sm:gap-3 sm:text-[14.5px]">
                <li>
                  <a
                    href={`mailto:${topBar.email}`}
                    className="inline-flex items-center gap-3 text-white/75 transition hover:text-white"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 sm:h-9 sm:w-9">
                      <Mail className="h-4 w-4" />
                    </span>
                    {topBar.email}
                  </a>
                </li>
                <li>
                  <a
                    href={phoneHref}
                    className="inline-flex items-center gap-3 text-white/75 transition hover:text-white"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 sm:h-9 sm:w-9">
                      <Phone className="h-4 w-4" />
                    </span>
                    {topBar.phone}
                  </a>
                </li>
              </ul>
            </div>

            {/* Link columns: titles sit level with the middle of the logo */}
            <nav aria-label="Industries" className="col-span-2 sm:col-span-1 lg:pt-[15px]">
              <ColumnTitle>Industries</ColumnTitle>
              <ul className="grid grid-cols-2 gap-x-6 sm:block sm:space-y-1.5 lg:space-y-3">
                {industries.slice(0, 6).map((i) => (
                  <li key={i.slug}>
                    <FooterLink href={i.href}>{i.name}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Explore" className="lg:pt-[15px]">
              <ColumnTitle>{footer[0].title}</ColumnTitle>
              <ul className="sm:space-y-1.5 lg:space-y-3">
                {footer[0].links.map((l, i) => (
                  <li key={`${l.href}-${i}`}>
                    <FooterLink href={l.href}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Company" className="lg:pt-[15px]">
              <ColumnTitle>{footer[1].title}</ColumnTitle>
              <ul className="sm:space-y-1.5 lg:space-y-3">
                {footer[1].links.map((l, i) => (
                  <li key={`${l.href}-${i}`}>
                    <FooterLink href={l.href}>{l.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Newsletter + carriers */}
            <div className="col-span-2 lg:col-span-1 lg:pt-[15px]">
              <ColumnTitle>Newsletter</ColumnTitle>
              <p className="-mt-1 text-[13px] leading-relaxed text-white/60 sm:text-[14.5px]">
                Packaging ideas and offers in your inbox. No spam.
              </p>

              {subscribed ? (
                <p
                  role="status"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-[14px] font-semibold text-white"
                >
                  <Check className="h-4 w-4 text-secondary" strokeWidth={3} /> Thanks! You&apos;re on the list.
                </p>
              ) : (
                <form onSubmit={subscribe} className="mt-3 flex gap-2 sm:mt-4">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    autoComplete="email"
                    className="h-11 min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.06] px-5 text-[14.5px] text-white outline-none transition placeholder:text-white/40 focus:border-primary focus:bg-white/10"
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    aria-label="Subscribe"
                    className="btn-slip inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary to-[#4a3df0] text-white disabled:opacity-70"
                  >
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2.25} />
                  </button>
                </form>
              )}
              {subscribeError && (
                <p role="alert" className="mt-2 text-[13px] font-semibold text-secondary">
                  {subscribeError}
                </p>
              )}

              <p className="mb-2 mt-5 text-[11px] sm:mb-3 sm:mt-8 sm:text-[12px] font-bold uppercase leading-6 tracking-[0.18em] text-white/45">
                Shipping partners
              </p>
              <div className="flex max-w-[260px] items-center gap-2 sm:max-w-[300px]">
                {carriers.map((c) => (
                  <span
                    key={c.alt}
                    className="flex h-9 min-w-0 flex-1 basis-0 items-center justify-center rounded-xl bg-white px-2.5 sm:h-11 shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.src} alt={c.alt} className="max-h-5 w-full object-contain sm:max-h-7" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-4 sm:flex-row sm:gap-4 sm:py-6">
            <p className="text-[12.5px] text-white/50 sm:text-[13.5px]">© {new Date().getFullYear()} Boxora. All rights reserved.</p>
            <Image
              src={images.payment}
              alt="Accepted payment methods"
              width={300}
              height={24}
              className="h-5 w-auto opacity-80 sm:h-6"
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
