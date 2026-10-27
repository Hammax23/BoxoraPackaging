import Benefits, { type BenefitsContent } from "@/components/Benefits";
import Brands, { type BrandsContent } from "@/components/Brands";
import CtaBand, { type CtaContent } from "@/components/CtaBand";
import FAQs, { type FaqHeading } from "@/components/FAQs";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import IndustriesSection from "@/components/IndustriesSection";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import QuoteSection from "@/components/QuoteSection";
import ProcessSteps from "@/components/ProcessSteps";
import StyleGrid from "@/components/StyleGrid";
import Testimonials, { type ReviewsContent } from "@/components/Testimonials";
import { getFaqs, getSiteContent, getSiteSetting, getTestimonials } from "@/lib/queries/content";
import { getIndustries } from "@/lib/queries/industries";
import { getContent, getStyles } from "@/lib/queries/pageContent";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Packaging & Pouches",
  description:
    "Enterprise packaging solutions for modern brands. Custom boxes, pouches, coffee bags, and eco-friendly packaging.",
  path: "/",
});

export default async function Home() {
  const [faqs, showTestimonials, styles, featureItems, heroImages, heroChecklist, stylesHeading, brands, reviews, industries, cta, benefits, faqHeading, { topBar }] =
    await Promise.all([
      getFaqs(),
      getSiteSetting<boolean>("showTestimonials", false),
      getStyles(),
      getContent<{ title: string; description: string; icon: string }[]>("featureItems"),
      getContent<{ image: string; alt: string }[]>("heroImages"),
      getContent<{ text: string }[]>("heroChecklist"),
      getContent<{ title: string; highlight: string; text: string; button: string }>("homeStyles"),
      getContent<BrandsContent>("homeBrands"),
      getContent<ReviewsContent>("homeReviews"),
      getIndustries(),
      getContent<CtaContent>("homeCta"),
      getContent<BenefitsContent>("homeBenefits"),
      getContent<FaqHeading>("homeFaq"),
      getSiteContent(),
    ]);
  // Hidden until the admin switches it on (Admin → FAQs & reviews), so no placeholder reviews go live.
  const testimonials = showTestimonials === true ? await getTestimonials() : [];

  // Hero showcase: the admin-picked hero photos first, then every packaging style photo (no repeats).
  const seen = new Set<string>();
  const showcase = [...heroImages, ...styles.map((s) => ({ image: s.image, alt: s.title }))].filter((im) => {
    if (!im.image || seen.has(im.image)) return false;
    seen.add(im.image);
    return true;
  });

  return (
    <main>
      <JsonLd data={faqJsonLd(faqs)} />
      <Header />
      <Hero images={showcase} checklist={heroChecklist} />
      <StyleGrid styles={styles} heading={stylesHeading} />
      <ProcessSteps />
      <Features features={featureItems} />
      <Brands content={brands} />
      <QuoteSection source="home" />
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} heading={reviews} />}
      <IndustriesSection industries={industries} />
      <CtaBand content={cta} phone={topBar.phone} />
      <Benefits content={benefits} />
      <FAQs faqs={faqs} heading={faqHeading} />
      <Footer />
    </main>
  );
}
