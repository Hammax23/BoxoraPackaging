"use client";

import FeatureMarquee from "@/components/FeatureMarquee";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { BlogPost } from "@/lib/blog";
import { openQuoteDrawer } from "@/lib/quoteDrawer";
import { ArrowRight, ArrowUpRight, Clock, Search, SearchX, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Byline({ post, light = false }: { post: BlogPost; light?: boolean }) {
  return (
    <div className={`flex items-center gap-3 text-[13px] ${light ? "text-white/70" : "text-lighter"}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
          light ? "bg-white/15 text-white" : "bg-gradient-to-br from-primary to-secondary text-white"
        }`}
      >
        {initials(post.author)}
      </span>
      <span className="min-w-0 truncate">
        <span className={`font-semibold ${light ? "text-white" : "text-dark"}`}>{post.author}</span>
        <span className="mx-2 opacity-50">•</span>
        {post.date}
      </span>
    </div>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border/80 bg-white transition duration-300 hover:-translate-y-1.5 hover:border-primary/35 hover:shadow-[0_28px_60px_rgba(3,90,83,0.12)]"
    >
      <div className="relative aspect-[1.18] overflow-hidden bg-background-field">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-dark shadow-sm backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
          <Clock className="h-3.5 w-3.5" /> {post.readTime}
        </span>
        <h3 className="mt-3 font-heading text-[22px] leading-[1.18] text-dark transition group-hover:text-primary sm:text-[24px]">
          {post.title}
        </h3>
        <p className="mt-4 line-clamp-3 flex-1 text-[15px] leading-[1.7] text-text">{post.excerpt}</p>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/80 pt-4">
          <Byline post={post} />
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-dark transition group-hover:border-primary group-hover:bg-primary group-hover:text-dark">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPageClient({
  posts,
  categories,
  featured,
  marqueeItems,
}: {
  posts: BlogPost[];
  categories: string[];
  featured: BlogPost;
  marqueeItems: string[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [query, setQuery] = useState("");

  const rest = useMemo(() => posts.filter((p) => p.slug !== featured.slug), [posts, featured.slug]);
  const picks = rest.slice(0, 3);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rest.filter(
      (p) =>
        (activeCategory === "All" || p.category === activeCategory) &&
        (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)),
    );
  }, [rest, activeCategory, query]);

  const isFiltering = activeCategory !== "All" || query.trim() !== "";

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Masthead */}
      <section className="hero-section relative overflow-hidden">
        <div className="hero-aurora hero-aurora-1" />
        <div className="hero-aurora hero-aurora-2" />
        <div className="hero-grid" />
        <div className="container-main relative z-10 pb-28 pt-16 text-center md:pb-36 md:pt-24">
          <AnimatedSection>
            <span className="hero-badge mx-auto">
              <span className="hero-badge-dot" />
              The Boxora Journal
            </span>
            <h1 className="mx-auto mt-7 max-w-4xl font-heading text-[40px] leading-[1.04] text-white md:text-[68px]">
              Ideas that make your packaging{" "}
              <span className="hero-shimmer font-body font-extrabold tracking-tight">worth opening</span>
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
              Practical guides on materials, design, sustainability and production, written for founders,
              marketers and packaging teams.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured story overlaps the masthead */}
      <section className="relative z-10 -mt-20 md:-mt-24">
        <div className="container-main">
          <AnimatedSection>
            <Link
              href={`/blog/${featured.slug}`}
              className="group mx-auto grid max-w-[1180px] overflow-hidden rounded-[28px] border border-border/80 bg-white shadow-[0_24px_70px_rgba(3,90,83,0.14)] lg:h-[360px] lg:grid-cols-[1fr_1fr]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-background-field lg:aspect-auto lg:h-full">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                <span className="absolute left-6 top-6 rounded-full bg-white/95 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-dark shadow-lg backdrop-blur">
                  Featured story
                </span>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  {featured.category}
                </span>
                <h2 className="mt-3 font-heading text-[28px] leading-[1.08] text-dark transition group-hover:text-primary sm:text-[34px] lg:text-[38px]">
                  {featured.title}
                </h2>
                <p className="mt-4 line-clamp-2 max-w-xl text-[15px] leading-[1.6] text-text md:text-base">
                  {featured.excerpt}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <Byline post={featured} />
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-lighter">
                    <Clock className="h-3.5 w-3.5" /> {featured.readTime}
                  </span>
                </div>
                <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-[13px] font-bold text-dark shadow-[0_10px_28px_rgba(189,249,6,0.25)] transition group-hover:bg-[#8fbf00]">
                  Read the story <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Editor's picks */}
      {picks.length > 0 && !isFiltering && (
        <section className="container-main pt-20 md:pt-28">
          <AnimatedSection>
            <div className="flex items-end justify-between gap-4 border-b border-border/80 pb-5">
              <div>
                <span className="section-label text-secondary">Editor&apos;s picks</span>
                <h2 className="mt-2 font-heading text-[28px] leading-tight text-dark md:text-[36px]">
                  Start here
                </h2>
              </div>
            </div>
          </AnimatedSection>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {picks.map((p, i) => (
              <AnimatedSection key={p.slug} delay={i * 0.08}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full gap-4 rounded-[20px] border border-border/80 bg-background-field/35 p-5 transition hover:border-primary/30 hover:bg-white hover:shadow-[0_18px_44px_rgba(3,90,83,0.1)]"
                >
                  <span className="font-heading text-[44px] leading-none text-transparent [-webkit-text-stroke:1px_rgba(3,90,83,0.55)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                      {p.category}
                    </span>
                    <span className="mt-1 block font-heading text-[18px] leading-snug text-dark transition group-hover:text-primary">
                      {p.title}
                    </span>
                    <span className="mt-2 block text-[12px] font-semibold text-lighter">{p.readTime}</span>
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </section>
      )}

      {/* Library */}
      <section className="container-main py-20 md:py-28">
        <AnimatedSection>
          <div className="flex flex-col gap-3 border-b border-border/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-label text-primary">The library</span>
              <h2 className="mt-2 font-heading text-[30px] leading-tight text-dark md:text-[42px]">
                Every article, in one place
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-lighter sm:text-right">
              Fresh thinking for better products, better launches, and better unboxing moments.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-8 flex flex-col gap-5 rounded-[20px] border border-border/80 bg-background-field/35 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`shrink-0 rounded-full px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.08em] transition ${
                  activeCategory === category
                    ? "bg-dark text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                    : "border border-border bg-white text-text hover:border-primary/40 hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-[320px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lighter" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles"
              aria-label="Search articles"
              className="[&::-webkit-search-cancel-button]:hidden w-full rounded-full border border-border/80 bg-white py-3 pl-11 pr-10 text-[15px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-lighter hover:bg-background-field hover:text-dark"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.1em] text-lighter" role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((post, i) => (
            <AnimatedSection key={post.slug} delay={(i % 3) * 0.07}>
              <PostCard post={post} />
            </AnimatedSection>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-6 rounded-[20px] border border-dashed border-border bg-background-field/40 px-6 py-16 text-center">
            <SearchX className="mx-auto h-10 w-10 text-lighter" />
            <h3 className="mt-4 font-heading text-2xl text-dark">No articles found</h3>
            <p className="mt-2 text-text">Try another keyword or category.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
              }}
              className="mt-5 text-sm font-bold text-primary hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-24">
        <div className="container-main">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-[28px] bg-[#024540] px-6 py-16 text-center md:px-16 md:py-20">
              <div className="hero-aurora hero-aurora-1 opacity-40" />
              <div className="hero-aurora hero-aurora-2 opacity-40" />
              <div className="relative z-10">
                <h2 className="mx-auto max-w-2xl font-heading text-[30px] leading-tight text-white md:text-[42px]">
                  Ready to turn ideas into packaging?
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-white/70 md:text-lg">
                  Talk to our specialists about structure, materials and print for your product.
                </p>
                <button
                  type="button"
                  onClick={() => openQuoteDrawer({ source: "blog" })}
                  className="btn-slip mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-4 text-[14px] font-bold text-white shadow-[0_12px_40px_rgba(189,249,6,0.4)]"
                >
                  Get a free quote <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <FeatureMarquee items={marqueeItems} />
      <Footer />
    </main>
  );
}
