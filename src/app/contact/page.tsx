import AboutCTAButton from "@/components/AboutCTAButton";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { trendsMegamenu } from "@/lib/data";
import { getSiteContent } from "@/lib/queries/content";
import { buildPageMetadata } from "@/lib/seo";
import { ArrowRight, Clock, Mail, MessageSquareQuote, Phone, PhoneCall } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us",
  description:
    "Questions about custom packaging? Call, email or send us a message and the Boxora team will get back to you within one business day.",
  path: "/contact",
});

const tollFree = trendsMegamenu.cta.phone;

const buildChannels = (topBar: { phone: string; email: string }) => [
  {
    icon: Phone,
    label: "Call us",
    value: topBar.phone,
    href: `tel:${topBar.phone.replace(/\s/g, "")}`,
    hint: "Talk to a packaging specialist",
  },
  {
    icon: PhoneCall,
    label: "Toll free",
    value: tollFree,
    href: `tel:${tollFree.replace(/[^\d+]/g, "")}`,
    hint: "Free expert guidance",
  },
  {
    icon: Mail,
    label: "Email us",
    value: topBar.email,
    href: `mailto:${topBar.email}`,
    hint: "We reply within 1 business day",
  },
];

export default async function ContactPage() {
  const { topBar } = await getSiteContent();
  const channels = buildChannels(topBar);
  return (
    <main>
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#e9eeff] pb-28 pt-12 md:pt-16">
        <div className="pointer-events-none absolute left-1/2 top-[-140px] h-[380px] w-[760px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/15 via-[#9b8cff]/15 to-secondary/20 blur-3xl" />
        <div className="container-main relative z-10 text-center">
          <AnimatedSection>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              Contact
            </span>
            <h1 className="mx-auto mt-5 max-w-3xl font-heading text-[34px] leading-[1.1] text-dark sm:text-[46px] md:text-[54px]">
              We&apos;d love to{" "}
              <span className="whitespace-nowrap bg-[linear-gradient(100deg,#2757ff_0%,#7a4dff_50%,#f865dc_100%)] bg-clip-text font-body font-extrabold tracking-tight text-transparent">
                hear from you
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-text sm:text-lg">
              Questions, ideas or a project in mind? Reach out and a real person from our team will help.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white bg-white px-4 py-2 text-[12px] font-bold text-dark shadow-[0_10px_26px_rgba(39,87,255,0.15)]">
              <Clock className="h-4 w-4 text-primary" /> We reply within 1 business day
            </span>
          </AnimatedSection>
        </div>
      </section>

      {/* Channel cards overlap the hero */}
      <section className="relative z-10 -mt-16">
        <div className="container-main grid gap-5 md:grid-cols-3">
          {channels.map((c, i) => (
            <AnimatedSection key={c.label} delay={i * 0.08}>
              <a
                href={c.href}
                className="group flex h-full items-center gap-5 rounded-[28px] border border-border bg-white p-6 shadow-[0_20px_50px_rgba(8,8,16,0.12)] transition duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_28px_60px_rgba(39,87,255,0.2)]"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white transition group-hover:rotate-6">
                  <c.icon className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                    {c.label}
                  </span>
                  <span className="mt-0.5 block truncate text-lg font-bold text-dark">{c.value}</span>
                  <span className="block text-[13px] text-lighter">{c.hint}</span>
                </span>
              </a>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Form + side */}
      <section className="section-padding bg-white">
        <div className="container-main grid items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-14">
          <AnimatedSection>
            <span className="section-label text-primary">Send a message</span>
            <h2 className="mt-3 font-heading text-[34px] leading-tight text-dark md:text-[44px]">
              Tell us how we can help
            </h2>
            <p className="mt-3 mb-8 text-text">
              Fill in the form and we&apos;ll respond within one business day.
            </p>
            <div className="rounded-[32px] border border-border bg-background-field/40 p-5 sm:p-8">
              <ContactForm />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.12} className="space-y-5 lg:pt-3">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary via-[#4a3df0] to-secondary p-8 text-white">
              <MessageSquareQuote className="h-9 w-9 text-white/80" />
              <h3 className="mt-4 font-heading text-[28px] leading-tight">Need pricing fast?</h3>
              <p className="mt-2 text-white/85">
                Skip the back and forth. Share your dimensions, stock and quantity and get a tailored quote.
              </p>
              <Link
                href="/quote"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-bold text-dark transition hover:bg-background-field"
              >
                Get a free quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-[32px] border border-border bg-white p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background-field text-primary">
                <Clock className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-heading text-2xl text-dark">What happens next?</h3>
              <ol className="mt-4 space-y-3 text-[15px] text-text">
                {[
                  "We read your message and match you with the right specialist.",
                  "You get a personal reply within one business day.",
                  "We keep in touch until your packaging question is solved.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[12px] font-bold text-primary">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-[32px] border border-border bg-white p-8">
              <h3 className="font-heading text-2xl text-dark">Quick answers</h3>
              <p className="mt-2 text-[15px] text-text">
                Minimums, setup fees and turnaround are covered in our FAQs and packaging guides.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-[14px] font-bold">
                <Link href="/faq" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                  Read the FAQs <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/blog" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                  Packaging guides <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-background-field py-16">
        <div className="container-main">
          <AnimatedSection className="text-center">
            <h2 className="mx-auto max-w-2xl font-heading text-[30px] leading-tight text-dark md:text-[40px]">
              Ready to start your packaging project?
            </h2>
            <div className="mt-7 flex justify-center">
              <AboutCTAButton label="Get a free quote" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </main>
  );
}
