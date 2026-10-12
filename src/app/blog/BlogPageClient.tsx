"use client";

import Footer from "@/components/Footer";
import FeatureMarquee from "@/components/FeatureMarquee";
import Header from "@/components/Header";
import type { BlogPost } from "@/lib/blog";
import { openQuoteDrawer } from "@/lib/quoteDrawer";
import { ArrowUpRight, Calendar, ChevronRight, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid overflow-hidden rounded-[28px] border border-border bg-white shadow-sm transition hover:border-primary/25 hover:shadow-[0_20px_50px_rgba(39,87,255,0.1)] lg:grid-cols-2"
      >
        <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[360px]">
          <Image src={post.image} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 50vw" priority />
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">Featured</span>
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-primary">{post.category}</span>
          <h2 className="mt-3 font-heading text-2xl leading-tight text-dark transition group-hover:text-primary sm:text-3xl lg:text-4xl">{post.title}</h2>
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-text sm:text-base">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-lighter sm:text-sm">
            <span className="inline-flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{post.author}</span>
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:border-primary/25 hover:shadow-[0_16px_40px_rgba(39,87,255,0.08)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={post.image} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-dark backdrop-blur">{post.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-xl leading-snug text-dark transition group-hover:text-primary">{post.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-text">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-lighter">
          <span>{post.date}</span>
          <span className="font-semibold text-primary">{post.readTime}</span>
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

  const filteredPosts = useMemo(() => {
    const list = posts.filter((post) => post.slug !== featured.slug);
    if (activeCategory === "All") return list;
    return list.filter((post) => post.category === activeCategory);
  }, [activeCategory, featured.slug, posts]);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <FeatureMarquee items={marqueeItems} />
      <div className="border-b border-border bg-background-field/50">
        <div className="container-main py-3">
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
            <Link href="/" className="text-text transition hover:text-primary">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-lighter sm:h-4 sm:w-4" />
            <span className="font-semibold text-dark">Blog</span>
          </nav>
        </div>
      </div>
      <section className="border-b border-border bg-gradient-to-br from-background-field/60 via-white to-white">
        <div className="container-main py-10 sm:py-14 md:py-16">
          <div className="max-w-3xl">
            <span className="section-label text-primary">Insights</span>
            <h1 className="mt-4 font-heading text-3xl text-dark sm:text-4xl md:text-5xl">Packaging knowledge for growing brands</h1>
            <p className="mt-4 text-sm leading-relaxed text-text sm:text-base md:text-lg">
              Practical guides on materials, design, sustainability, and production — written for founders, marketers, and packaging teams.
            </p>
          </div>
        </div>
      </section>
      <section className="container-main py-8 sm:py-10 md:py-12">
        <BlogCard post={featured} featured />
        <div className="mt-10 flex flex-wrap gap-2 sm:mt-12">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition sm:text-[11px] ${
                activeCategory === category ? "bg-primary text-white shadow-[0_4px_16px_rgba(39,87,255,0.25)]" : "border border-border bg-white text-text hover:border-primary/30 hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <section className="border-t border-border bg-background-field/50 py-10 sm:py-12">
        <div className="container-main">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[28px] border border-border bg-white p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="max-w-xl">
              <h2 className="font-heading text-2xl text-dark sm:text-3xl">Need help choosing packaging?</h2>
              <p className="mt-2 text-sm text-text sm:text-base">Talk to our specialists for structure, materials, and print recommendations tailored to your product.</p>
            </div>
            <button type="button" onClick={() => openQuoteDrawer({ source: "blog" })} className="btn-slip inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-white">
              Get Free Quote
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
