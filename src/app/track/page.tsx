import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TrackForm from "@/components/TrackForm";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "Track Your Order",
  description: "Enter your order reference and email to see where your Boxora packaging order is.",
  path: "/track",
});

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const ref = ((await searchParams).ref ?? "").slice(0, 40);
  return (
    <main>
      <Header />
      <section className="section-padding bg-background-field">
        <div className="container-main max-w-3xl">
          <h1 className="font-heading text-[36px] leading-tight text-dark md:text-[48px]">Track your order</h1>
          <p className="mt-3 text-base text-text md:text-lg">
            Enter the reference from your quote or order confirmation and the email you used.
          </p>
          <TrackForm defaultReference={ref} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
