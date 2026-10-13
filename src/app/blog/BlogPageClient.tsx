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
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-white transition duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-[0_28px_60px_rgba(39,87,255,0.12)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-background-field">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-dark backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary">
          <Clock className="h-3.5 w-3.5" /> {post.readTime}
        </span>
        <h3 className="mt-2.5 font-heading text-[22px] leading-snug text-dark transition group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-relaxed text-text">{post.excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <Byline post={post} />
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-dark transition group-hover:border-primary group-hover:bg-primary group-hover:text-white">
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
        <div className="container-main relative z-10 pb-24 pt-16 text-center md:pb-28 md:pt-24">
          <AnimatedSection>
            <span className="hero-badge mx-auto">
              <span className="hero-badge-dot" />
              The Boxora Journal
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl font-heading text-[40px] leading-[1.08] text-white md:text-[62px]">
              Ideas that make your packaging{" "}
              <span className="hero-shimmer font-body font-extrabold tracking-tight">worth opening</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/70 md:text-lg">
              Practical guides on materials, design, sustainability and production, written for founders,
              marketers and packaging teams.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured story overlaps the masthead */}
      <section className="relative z-10 -mt-14 md:-mt-16">
        <div className="container-main">
          <AnimatedSection>
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-[36px] border border-border bg-white shadow-[0_30px_80px_rgba(8,8,16,0.18)] lg:grid-cols-[1.05fr_1fr]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-background-field lg:aspect-auto lg:min-h-[440px]">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  priority
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                <span className="absolute left-5 top-5 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-lg">
                  Featured story
                </span>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
                <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-primary">
                  {featured.category}
                </span>
                <h2 className="mt-4 font-heading text-[30px] leading-[1.12] text-dark transition group-hover:text-primary sm:text-[38px] lg:text-[44px]">
                  {featured.title}
                </h2>
                <p className="mt-5 line-clamp-4 text-base leading-relaxed text-text md:text-lg">
                  {featured.excerpt}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Byline post={featured} />
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-lighter">
                    <Clock className="h-3.5 w-3.5" /> {featured.readTime}
                  </span>
                </div>
                <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[14px] font-bold text-white shadow-[0_12px_36px_rgba(39,87,255,0.35)] transition group-hover:bg-[#1f47d6]">
                  Read the story <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Editor's picks */}
      {picks.length > 0 && !isFiltering && (
        <section className="container-main pt-16 md:pt-20">
          <AnimatedSection>
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="section-label text-secondary">Editor&apos;s picks</span>
                <h2 className="mt-2 font-heading text-[28px] leading-tight text-dark md:text-[36px]">
                  Start here
                </h2>
              </div>
            </div>
          </AnimatedSection>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {picks.map((p, i) => (
              <AnimatedSection key={p.slug} delay={i * 0.08}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full gap-4 rounded-[24px] border border-border bg-background-field/40 p-4 transition hover:border-primary/30 hover:bg-white hover:shadow-[0_18px_44px_rgba(39,87,255,0.1)]"
                >
                  <span className="font-heading text-[44px] leading-none text-transparent [-webkit-text-stroke:1px_rgba(39,87,255,0.55)]">
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
      <section className="container-main py-16 md:py-20">
        <AnimatedSection>
          <span className="section-label text-primary">The library</span>
          <h2 className="mt-2 font-heading text-[30px] leading-tight text-dark md:text-[42px]">
            Every article, in one place
          </h2>
        </AnimatedSection>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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
              className="[&::-webkit-search-cancel-button]:hidden w-full rounded-full border border-border bg-white py-3 pl-11 pr-10 text-[15px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15"
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

        <p className="mt-6 text-sm font-semibold text-lighter" role="status" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          {activeCategory !== "All" && ` in ${activeCategory}`}
        </p>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((post, i) => (
            <AnimatedSection key={post.slug} delay={(i % 3) * 0.07}>
              <PostCard post={post} />
            </AnimatedSection>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-6 rounded-[28px] border border-dashed border-border bg-background-field/40 px-6 py-16 text-center">
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
            <div className="relative overflow-hidden rounded-[40px] bg-[#080810] px-6 py-14 text-center md:px-16 md:py-16">
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
                  className="btn-slip mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-4 text-[14px] font-bold text-white shadow-[0_12px_40px_rgba(39,87,255,0.4)]"
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
