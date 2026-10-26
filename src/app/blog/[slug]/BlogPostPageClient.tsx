"use client";

import FeatureMarquee from "@/components/FeatureMarquee";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { BlogPost } from "@/lib/blog";
import { openQuoteDrawer } from "@/lib/quoteDrawer";
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, Clock, Link2, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ReadingProgress({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = target.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const done = Math.min(Math.max(-rect.top + window.innerHeight * 0.2, 0), total);
      setPct(total > 0 ? (done / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-1 bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-100"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function ShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const open = (build: (url: string, text: string) => string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    window.open(build(url, text), "_blank", "noopener,noreferrer,width=600,height=560");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", window.location.href);
    }
  };

  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-dark transition hover:border-primary hover:bg-primary hover:text-dark";

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-[12px] font-bold uppercase tracking-[0.12em] text-lighter">Share</span>
      <button type="button" aria-label="Share on X" className={btn} onClick={() => open((u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`)}>
        <span className="text-[13px] font-bold">X</span>
      </button>
      <button type="button" aria-label="Share on LinkedIn" className={btn} onClick={() => open((u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`)}>
        <span className="text-[12px] font-bold">in</span>
      </button>
      <a
        aria-label="Share by email"
        className={btn}
        href={`mailto:?subject=${encodeURIComponent(title)}&body=`}
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(window.location.href)}`;
        }}
      >
        <Mail className="h-4 w-4" />
      </a>
      <button type="button" aria-label="Copy link" className={btn} onClick={copy}>
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
      <span role="status" aria-live="polite" className="ml-1 text-[12px] font-semibold text-primary">
        {copied && "Link copied"}
      </span>
    </div>
  );
}

export default function BlogPostPageClient({
  post,
  related,
  marqueeItems,
}: {
  post: BlogPost;
  related: BlogPost[];
  marqueeItems: string[];
}) {
  const articleRef = useRef<HTMLElement | null>(null);

  return (
    <main className="min-h-screen bg-white">
      <ReadingProgress target={articleRef} />
      <Header />

      {/* Title block */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background-field/70 via-white to-white">
        <div className="container-main pb-10 pt-8 md:pb-14 md:pt-10">
          <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold text-lighter sm:text-[13px]">
            <Link href="/" className="transition hover:text-primary">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="transition hover:text-primary">Journal</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="max-w-[40ch] truncate text-dark">{post.title}</span>
          </nav>

          <div className="mx-auto mt-8 max-w-4xl text-center">
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              {post.category}
            </span>
            <h1 className="mt-5 font-heading text-[32px] leading-[1.1] text-dark sm:text-[44px] md:text-[56px]">
              {post.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text sm:text-lg md:text-xl">
              {post.excerpt}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-lighter">
              <span className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-[12px] font-bold text-white">
                  {initials(post.author)}
                </span>
                <span className="font-semibold text-dark">{post.author}</span>
              </span>
              <span>{post.date}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      <article ref={articleRef}>
        <div className="container-main">
          <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-[16px] bg-background-field shadow-[0_30px_80px_rgba(3,90,83,0.15)]">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1024px"
            />
          </div>

          <div className="mx-auto mt-12 grid max-w-[1000px] gap-10 md:mt-16 lg:grid-cols-[1fr_auto] lg:gap-14">
            <div className="mx-auto w-full max-w-[720px] space-y-7">
              {post.content.map((paragraph, i) => (
                <p
                  key={`${post.slug}-${i}`}
                  className={
                    i === 0
                      ? "text-[18px] leading-[1.85] text-dark first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-heading first-letter:text-[72px] first-letter:leading-[0.8] first-letter:text-primary md:text-[20px]"
                      : "text-[18px] leading-[1.85] text-text md:text-[19px]"
                  }
                >
                  {paragraph}
                </p>
              ))}

              <div className="flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
                <ShareBar title={post.title} />
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                  <ArrowLeft className="h-4 w-4" /> Back to the journal
                </Link>
              </div>

              {/* Author card */}
              <div className="flex items-start gap-4 rounded-[20px] border border-border bg-background-field/50 p-6">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white">
                  {initials(post.author)}
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-lighter">Written by</p>
                  <p className="font-heading text-xl text-dark">{post.author}</p>
                  <p className="mt-1 text-[15px] text-text">
                    Sharing practical packaging knowledge from the Boxora team.
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky side share (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-32 flex flex-col items-center gap-3 rounded-full border border-border bg-white p-2 shadow-sm">
                <ShareRail title={post.title} />
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Quote CTA */}
      <section className="py-14 md:py-20">
        <div className="container-main">
          <AnimatedSection>
            <div className="relative overflow-hidden rounded-[36px] bg-dark ring-1 ring-primary/30 px-6 py-12 text-center md:px-16 md:py-16">
              <h2 className="mx-auto max-w-2xl font-heading text-[28px] leading-tight text-white md:text-[40px]">
                Put these ideas into your packaging
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/85 md:text-lg">
                Tell us about your product and we&apos;ll recommend the right structure, materials and print.
              </p>
              <button
                type="button"
                onClick={() => openQuoteDrawer({ source: `blog-post:${post.slug}` })}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-[14px] font-bold text-dark transition hover:bg-background-field"
              >
                Get a free quote <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border bg-background-field/40 py-14 md:py-20">
          <div className="container-main">
            <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="section-label text-secondary">Keep reading</span>
                <h2 className="mt-2 font-heading text-[28px] text-dark md:text-[38px]">More from the journal</h2>
              </div>
              <Link href="/blog" className="section-link group w-fit">
                <span>All articles</span>
                <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="group overflow-hidden rounded-[20px] border border-border bg-white transition duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-[0_24px_56px_rgba(189,249,6,0.12)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-background-field">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">{item.category}</p>
                    <h3 className="mt-2 font-heading text-xl leading-snug text-dark transition group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-text">{item.excerpt}</p>
                    <p className="mt-4 text-[12px] font-semibold text-lighter">{item.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FeatureMarquee items={marqueeItems} />
      <Footer />
    </main>
  );
}

function ShareRail({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full text-dark transition hover:bg-primary hover:text-dark";
  const open = (build: (url: string, text: string) => string) => {
    const url = encodeURIComponent(window.location.href);
    window.open(build(url, encodeURIComponent(title)), "_blank", "noopener,noreferrer,width=600,height=560");
  };
  return (
    <>
      <button type="button" aria-label="Share on X" className={btn} onClick={() => open((u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`)}>
        <span className="text-[13px] font-bold">X</span>
      </button>
      <button type="button" aria-label="Share on LinkedIn" className={btn} onClick={() => open((u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`)}>
        <span className="text-[12px] font-bold">in</span>
      </button>
      <button
        type="button"
        aria-label="Copy link"
        className={btn}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            window.prompt("Copy this link", window.location.href);
          }
        }}
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
    </>
  );
}
