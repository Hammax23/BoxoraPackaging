import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StarRating from "@/components/ui/StarRating";
import { getStyles, getTrends } from "@/lib/queries/pageContent";
import { getIndustries } from "@/lib/queries/industries";
import { listActiveProducts } from "@/lib/queries/products";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import type { Metadata } from "next";
import { Grid2X2, List, ChevronRight } from "lucide-react";
import Image from "next/image";
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
            <span className="text-dark">{activeCategory.name}</span>
          </div>
        </div>

        <section className="section-padding pt-10">
          <div className="container-main">
            <div className="grid gap-10 lg:grid-cols-[280px_1fr] xl:gap-12">
              {/* Sidebar */}
              <aside className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.08em] text-dark">
                    Industries
                  </h3>
                  <div className="mt-4 space-y-1">
                    {industries.map((cat) => {
                      const isActive = cat.slug === activeCategory.slug;
                      const count = products.filter((p) => productInCategory(p.category, cat.name)).length;
                      return (
                        <Link
                          key={cat.slug}
                          href={cat.href}
                          className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${
                            isActive
                              ? "bg-background-field text-primary"
                              : "text-text hover:bg-background-field hover:text-dark"
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <span
                            className={`ml-3 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[12px] font-bold ${
                              isActive ? "bg-primary text-white" : "bg-background-field text-lighter"
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
                {/* Toolbar */}
                <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-lighter">
                    Showing all <span className="font-bold text-dark">{results.length}</span>{" "}
                    results
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-lighter">
                      <button
                        type="button"
                        aria-label="Grid view"
                        className="rounded-lg p-2 text-dark transition hover:bg-background-field"
                      >
                        <Grid2X2 className="h-4.5 w-4.5" />
                      </button>
                      <button
                        type="button"
                        aria-label="List view"
                        className="rounded-lg p-2 text-lighter transition hover:bg-background-field hover:text-dark"
                      >
                        <List className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <select
                      className="h-10 rounded-full border border-border bg-white px-4 text-sm font-semibold text-text outline-none focus:border-primary"
                      defaultValue="default"
                    >
                      <option value="default">Default sorting</option>
                      <option value="price-asc">Sort by price: low to high</option>
                      <option value="price-desc">Sort by price: high to low</option>
                      <option value="rating">Sort by rating</option>
                    </select>
                  </div>
                </div>

                {/* Products grid */}
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((p) => (
                    <article
                      key={p.slug}
                      className="group relative overflow-hidden rounded-[22px] border border-border bg-white transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_55px_rgba(189,249,6,0.12)]"
                    >
                      <Link href={`/products/${p.slug}`} aria-label={`View ${p.name}`} className="relative block bg-white p-4">
                        <div className="relative mx-auto aspect-square max-w-[260px]">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-contain p-2 transition duration-500 group-hover:scale-105"
                            sizes="260px"
                          />
                        </div>
                      </Link>

                      <div className="space-y-2 px-5 pb-5">
                        <h3 className="font-heading text-[18px] leading-snug text-dark">
                          <Link href={`/products/${p.slug}`} className="transition hover:text-primary">
                            {p.name}
                          </Link>
                        </h3>
                        <p className="line-clamp-2 text-sm text-lighter">
                          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                          dolore eu fugiat nulla pariatur.
                        </p>

                        <div className="pt-1">
                          {"salePrice" in p && p.salePrice ? (
                            <div className="flex items-center gap-2">
                              {p.discount && (
                                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                                  {p.discount}
                                </span>
                              )}
                              <span className="text-[15px] font-bold text-primary">
                                ${p.salePrice.toFixed(2)}
                              </span>
                              <span className="text-[13px] text-lighter line-through">
                                ${(p.price ?? 0).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[15px] font-bold text-dark">
                              ${(p.price ?? 0).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <StarRating rating={p.rating} reviews={p.reviews} />

                        <Link
                          href={`/products/${p.slug}`}
                          className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.08em] text-primary"
                        >
                          View specs &amp; order
                          <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" strokeWidth={2.5} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

