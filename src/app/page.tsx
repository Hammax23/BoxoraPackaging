import FAQs from "@/components/FAQs";
import FeatureMarquee from "@/components/FeatureMarquee";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Categories from "@/components/Categories";
import GoGreen from "@/components/GoGreen";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InstantQuote from "@/components/InstantQuote";
import JsonLd from "@/components/JsonLd";
import PackagingStyles from "@/components/PackagingStyles";
import Products from "@/components/Products";
import Testimonials from "@/components/Testimonials";
import { getFaqs, getMarqueeItems, getSiteSetting, getTestimonials } from "@/lib/queries/content";
import { listActiveProducts } from "@/lib/queries/products";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Packaging & Pouches",
  description:
    "Enterprise packaging solutions for modern brands. Custom boxes, pouches, coffee bags, and eco-friendly packaging.",
  path: "/",
});

export default async function Home() {
  const [marqueeItems, products, faqs, showTestimonials] = await Promise.all([
    getMarqueeItems(),
    listActiveProducts(),
    getFaqs(),
    getSiteSetting<boolean>("showTestimonials", false),
  ]);
  // Hidden until the admin switches it on (Admin → FAQs & reviews), so no placeholder reviews go live.
  const testimonials = showTestimonials === true ? await getTestimonials() : [];

  return (
    <main>
      <JsonLd data={faqJsonLd(faqs)} />
      <Header />
      <Hero />
      <FeatureMarquee items={marqueeItems} />
      <PackagingStyles />
      <Categories products={products} />
      <Features />
      <InstantQuote />
      <Products products={products} />
      <GoGreen />
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}
      <FAQs faqs={faqs} />
      <Footer />
    </main>
  );
}
