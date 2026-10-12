"use client";

import Footer from "@/components/Footer";
import FeatureMarquee from "@/components/FeatureMarquee";
import Header from "@/components/Header";
import type { BlogPost } from "@/lib/blog";
import { ArrowUpRight, Calendar, ChevronRight, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function BlogPostPageClient({
  post,
  related,
  marqueeItems,
}: {
  post: BlogPost;
  related: BlogPost[];
  marqueeItems: string[];
}) {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <FeatureMarquee items={marqueeItems} />
      <div className="border-b border-border bg-background-field/50">
        <div className="container-main py-3">
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
            <Link href="/" className="shrink-0 text-text transition hover:text-primary">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-lighter sm:h-4 sm:w-4" />
            <Link href="/blog" className="shrink-0 text-text transition hover:text-primary">Blog</Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-lighter sm:h-4 sm:w-4" />
            <span className="min-w-0 truncate font-semibold text-dark">{post.title}</span>
          </nav>
        </div>
      </div>
      <article>
        <div className="container-main py-8 sm:py-10 md:py-12">
          <div className="mx-auto max-w-4xl">
            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-primary">{post.category}</span>
            <h1 className="mt-4 font-heading text-[28px] leading-tight text-dark sm:text-4xl md:text-5xl">{post.title}</h1>
            <p className="mt-4 text-base leading-relaxed text-text sm:text-lg">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-lighter">
              <span className="inline-flex items-center gap-1.5"><User className="h-4 w-4" />{post.author}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{post.date}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readTime}</span>
            </div>
          </div>
          <div className="relative mx-auto mt-8 aspect-[16/9] max-w-5xl overflow-hidden rounded-[28px] border border-border">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="(max-width: 1280px) 100vw, 1024px" />
          </div>
          <div className="mx-auto mt-8 max-w-3xl space-y-5 sm:mt-10">
            {post.content.map((paragraph, i) => (
              <p key={`${post.slug}-${i}`} className="text-base leading-relaxed text-text sm:text-lg">{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
      <section className="border-t border-border bg-background-field/40 py-10 sm:py-12">
        <div className="container-main">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-label text-primary">Keep reading</span>
              <h2 className="mt-3 font-heading text-2xl text-dark sm:text-3xl">Related articles</h2>
            </div>
            <Link href="/blog" className="section-link group w-fit">
              <span>All articles</span>
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-white transition hover:border-primary/25">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">{item.category}</p>
                  <h3 className="mt-2 font-heading text-lg leading-snug text-dark transition group-hover:text-primary">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-text">{item.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
