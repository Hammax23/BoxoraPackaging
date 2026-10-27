import Footer from "@/components/Footer";
import Header from "@/components/Header";
import CategoryResults from "./CategoryResults";
import { getStyles, getTrends } from "@/lib/queries/pageContent";
import { getIndustries } from "@/lib/queries/industries";
import { listActiveProducts } from "@/lib/queries/products";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function productInCategory(productCategory: string | undefined, categoryName: string) {
  if (!productCategory) return false;
  return productCategory
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .includes(categoryName.toLowerCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industries = await getIndustries();
  const activeCategory = industries.find((c) => c.slug === slug);
  if (!activeCategory) return {};
  return buildPageMetadata({
    title: `${activeCategory.name} Packaging`,
    description: `Browse custom ${activeCategory.name.toLowerCase()} packaging solutions from Boxora.`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [products, industries, packagingStyles, trends] = await Promise.all([listActiveProducts(), getIndustries(), getStyles(), getTrends()]);
  const activeCategory = industries.find((c) => c.slug === slug);
  if (!activeCategory) notFound();

  const results = products.filter((p) => productInCategory(p.category, activeCategory.name));
  const counted = industries.map((cat) => ({ cat, count: products.filter((p) => productInCategory(p.category, cat.name)).length }));
  // Industries with products first, so people land on something useful.
  const ordered = [...counted].sort((a, b) => Number(b.count > 0) - Number(a.count > 0));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: activeCategory.name, path: `/category/${slug}` },
        ])}
      />
      <Header />

      <main className="bg-white">
        {/* Top breadcrumb bar */}
        <div className="border-b border-border bg-white">
          <div className="container-main flex items-center justify-center py-4 text-[12px] font-semibold text-lighter">
            <Link href="/" className="transition hover:text-primary">
              Home Page
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" strokeWidth={2.5} />
            <Link href="/industries" className="transition hover:text-primary">
              Industries
            </Link>
            <ChevronRight className="mx-2 h-4 w-4" strokeWidth={2.5} />
            <span className="text-dark">{activeCategory.name}</span>
          </div>
        </div>

        <section className="section-padding pt-10">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[280px_1fr] xl:gap-12">
              {/* Sidebar */}
              <aside className="hidden space-y-8 lg:block">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-dark">
                    Industries
                  </h3>
                  <div className="mt-4 space-y-1">
                    {ordered.map(({ cat, count }) => {
                      const isActive = cat.slug === activeCategory.slug;
                      return (
                        <Link
                          key={cat.slug}
                          href={cat.href}
                          aria-current={isActive ? "page" : undefined}
                          className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? "bg-primary text-dark"
                              : count > 0
                                ? "text-text hover:bg-background-field hover:text-dark"
                                : "text-lighter hover:bg-background-field hover:text-dark"
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <span
                            className={`ml-3 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[12px] font-bold ${
                              isActive ? "bg-dark text-[#bdf906]" : count > 0 ? "bg-background-field text-dark" : "bg-background-field/70 text-lighter"
                            }`}
                          >
                            {count}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-dark">
                    Packaging Styles
                  </h3>
                  <div className="mt-4 space-y-1">
                    {packagingStyles.map((style) => (
                      <Link
                        key={style.title}
                        href={style.href}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text transition hover:bg-background-field hover:text-dark"
                      >
                        <span className="truncate">{style.title}</span>
                        <ChevronRight className="h-4 w-4 text-lighter" strokeWidth={2.5} />
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-dark">
                    Trends
                  </h3>
                  <div className="mt-4 space-y-1">
                    {trends.map((trend) => (
                      <Link
                        key={trend.title}
                        href={trend.href}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-text transition hover:bg-background-field hover:text-dark"
                      >
                        <span className="truncate">{trend.title}</span>
                        <ChevronRight className="h-4 w-4 text-lighter" strokeWidth={2.5} />
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Content */}
              <div>
                <div className="mb-8">
                  <h1 className="font-heading text-[30px] leading-tight text-dark md:text-[40px]">{activeCategory.name} Packaging</h1>
                  <p className="mt-2 max-w-2xl text-base text-text">{activeCategory.sub}. Browse ready-made options or get a custom quote.</p>
                </div>

                {/* Mobile: swipeable industry chips (the sidebar is desktop only) */}
                <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
                  {ordered.map(({ cat }) => {
                    const isActive = cat.slug === activeCategory.slug;
                    return (
                      <Link
                        key={cat.slug}
                        href={cat.href}
                        className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          isActive ? "border-primary bg-primary text-dark" : "border-border bg-white text-text hover:border-primary"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    );
                  })}
                </div>

                <CategoryResults products={results} industry={activeCategory.name} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

