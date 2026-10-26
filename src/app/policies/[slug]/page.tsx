import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getContent } from "@/lib/queries/pageContent";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Policy = { slug: string; title: string; body: string };

const find = async (slug: string) => (await getContent<Policy[]>("policies")).find((p) => p.slug === slug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const policy = await find((await params).slug);
  if (!policy) return {};
  return buildPageMetadata({ title: policy.title, description: `${policy.title} for Boxora Packaging.`, path: `/policies/${policy.slug}` });
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const policy = await find((await params).slug);
  if (!policy) notFound();
  const lines = policy.body.split("\n").map((l) => l.trim()).filter(Boolean);

  return (
    <main>
      <Header />
      <section className="section-padding bg-white">
        <div className="container-main max-w-3xl">
          <h1 className="font-heading text-[36px] leading-tight text-dark md:text-[48px]">{policy.title}</h1>
          <div className="mt-8 space-y-4 text-[16px] leading-relaxed text-text">
            {lines.map((l, i) =>
              l.startsWith("## ") ? (
                <h2 key={i} className="pt-4 font-heading text-2xl text-dark">
                  {l.slice(3)}
                </h2>
              ) : (
                <p key={i}>{l}</p>
              ),
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
