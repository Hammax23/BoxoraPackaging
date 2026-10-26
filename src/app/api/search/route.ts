import { getStyles, getTrends } from "@/lib/queries/pageContent";
import { listPublishedPosts } from "@/lib/queries/blog";
import { listActiveProducts } from "@/lib/queries/products";
import { NextResponse } from "next/server";

type Item = { title: string; subtitle: string; href: string; image?: string };
type Group = { type: string; items: Item[] };

const pages: Item[] = [
  { title: "Get a free quote", subtitle: "Dimensions, stock, printing and quantity", href: "/quote" },
  { title: "Packaging styles", subtitle: "Pouches, bags, mailers and rigid boxes", href: "/styles" },
  { title: "Packaging trends", subtitle: "What is shaping modern packaging", href: "/trends" },
  { title: "Blog", subtitle: "Guides on materials, design and sustainability", href: "/blog" },
  { title: "About Boxora", subtitle: "Our story and what we stand for", href: "/about" },
  { title: "Our team", subtitle: "The people behind every order", href: "/team" },
  { title: "FAQs", subtitle: "Minimums, setup fees, samples and shipping", href: "/faq" },
  { title: "Contact us", subtitle: "Call, email or send a message", href: "/contact" },
];

const clip = (s: string, n = 80) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().toLowerCase().slice(0, 80);
  const terms = q.split(/\s+/).filter(Boolean);
  const match = (text: string) => {
    const hay = text.toLowerCase();
    return terms.every((t) => hay.includes(t));
  };

  const [packagingStyles, packagingTrends] = await Promise.all([getStyles(), getTrends()]);
  const styleItems: Item[] = packagingStyles.map((s) => ({
    title: s.title,
    subtitle: s.specs.slice(0, 2).join(" • "),
    href: s.href,
    image: s.image,
  }));

  // No query: show helpful shortcuts.
  if (!terms.length) {
    return NextResponse.json({
      groups: [
        { type: "Pages", items: pages.slice(0, 6) },
        { type: "Packaging styles", items: styleItems.slice(0, 4) },
      ] satisfies Group[],
    });
  }

  const [products, posts] = await Promise.all([
    listActiveProducts().catch(() => []),
    listPublishedPosts().catch(() => []),
  ]);

  const groups: Group[] = [
    { type: "Pages", items: pages.filter((p) => match(`${p.title} ${p.subtitle}`)) },
    {
      type: "Packaging styles",
      items: packagingStyles
        .filter((s) => match(`${s.title} ${s.description} ${s.specs.join(" ")}`))
        .map((s) => ({ title: s.title, subtitle: s.specs.slice(0, 2).join(" • "), href: s.href, image: s.image })),
    },
    {
      type: "Trends",
      items: packagingTrends
        .filter((t) => match(`${t.title} ${t.description}`))
        .map((t) => ({ title: t.title, subtitle: clip(t.description, 70), href: t.href, image: t.image })),
    },
    {
      type: "Products",
      items: products
        .filter((p) => match(`${p.name} ${p.description} ${p.category ?? ""}`))
        .map((p) => ({ title: p.name, subtitle: clip(p.description, 70), href: `/products/${p.slug}`, image: p.image })),
    },
    {
      type: "Articles",
      items: posts
        .filter((p) => match(`${p.title} ${p.excerpt} ${p.category}`))
        .map((p) => ({ title: p.title, subtitle: p.category, href: `/blog/${p.slug}`, image: p.image })),
    },
  ]
    .map((g) => ({ ...g, items: g.items.slice(0, 4) }))
    .filter((g) => g.items.length > 0);

  return NextResponse.json({ groups });
}
