import { images } from "./images";

export type BlogCategory =
  | "Packaging Tips"
  | "Sustainability"
  | "Design"
  | "Industry News";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: BlogCategory;
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
};

export const blogCategories: ("All" | BlogCategory)[] = [
  "All",
  "Packaging Tips",
  "Sustainability",
  "Design",
  "Industry News",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-right-mailer-box",
    title: "How to Choose the Right Mailer Box for E‑commerce",
    excerpt:
      "From board strength to unboxing experience — a practical guide to picking mailer packaging that protects products and elevates your brand.",
    category: "Packaging Tips",
    author: "Boxora Team",
    date: "Mar 12, 2026",
    readTime: "6 min read",
    image: images.packagingStyles[0],
    featured: true,
    content: [
      "Mailer boxes are one of the most versatile formats in modern e-commerce. They ship flat, assemble quickly, and create a strong first impression when customers open their order.",
      "Start with your product weight and fragility. Lightweight items may work well with E-flute corrugated, while heavier or fragile SKUs often benefit from B-flute or reinforced edges.",
      "Consider your brand story. Matte kraft communicates sustainability and craft. Full-color print with gloss laminate signals premium positioning. Soft-touch finishes work especially well for cosmetics and lifestyle brands.",
      "Finally, think about fulfillment speed. Tuck-top mailers are fast to pack. Self-locking bases reduce tape usage and improve line efficiency at higher volumes.",
    ],
  },
  {
    slug: "sustainable-packaging-trends-2026",
    title: "Sustainable Packaging Trends Brands Should Watch in 2026",
    excerpt:
      "Recyclable structures, mono-material films, and right-sized boxes are reshaping how leading D2C brands package and ship.",
    category: "Sustainability",
    author: "Sarah Mitchell",
    date: "Mar 8, 2026",
    readTime: "5 min read",
    image: images.goGreen,
    content: [
      "Sustainability is no longer a nice-to-have on packaging briefs — it is a baseline expectation from retailers, marketplaces, and consumers.",
      "Right-sizing is one of the fastest wins. Reducing void space cuts material use, freight cost, and damage rates simultaneously.",
      "Mono-material pouches and paper-based alternatives are gaining share in food and personal care, especially where recycling streams are clearly communicated on-pack.",
      "Brands that pair material choices with clear on-pack icons and QR-linked disposal guides see stronger trust scores in post-purchase surveys.",
    ],
  },
  {
    slug: "cosmetic-box-finishes-guide",
    title: "A Practical Guide to Cosmetic Box Finishes",
    excerpt:
      "Matte, gloss, soft-touch, foil — which finish fits your shelf story, budget, and production timeline?",
    category: "Design",
    author: "James Cooper",
    date: "Feb 28, 2026",
    readTime: "7 min read",
    image: images.megamenuCategories[9],
    content: [
      "Cosmetic packaging is judged in seconds on shelf and in unboxing videos. Finish selection is as important as structural design.",
      "Matte laminate feels modern and reduces glare under retail lighting. It pairs well with minimal typography and pastel color palettes.",
      "Soft-touch coatings add a tactile premium feel that customers remember — ideal for serums, fragrances, and gift sets.",
      "Foil accents and spot UV can highlight logos or claims without covering the entire pack, keeping unit costs manageable at mid-volume runs.",
    ],
  },
  {
    slug: "coffee-bag-barrier-film-explained",
    title: "Coffee Bag Barrier Films Explained (Simply)",
    excerpt:
      "PET, AL, PE — what each layer does, and how to balance freshness, aroma, and recyclability goals.",
    category: "Industry News",
    author: "Boxora Team",
    date: "Feb 20, 2026",
    readTime: "8 min read",
    image: images.megamenuCategories[0],
    content: [
      "Fresh coffee needs oxygen and moisture protection. That is why most specialty coffee bags use multi-layer barrier laminates.",
      "A typical structure includes PET for print and stiffness, aluminum for barrier performance, and PE for heat-seal compatibility.",
      "Degassing valves remain essential for freshly roasted beans, allowing CO₂ to escape without letting oxygen in.",
      "If recyclability is a priority, discuss mono-material or paper-based barrier options early — they influence artwork, seal strength, and shelf life testing.",
    ],
  },
  {
    slug: "reduce-shipping-damage-with-better-fit",
    title: "Reduce Shipping Damage with Better Pack Fit",
    excerpt:
      "Loose packs cause more returns than weak boards. Here is how to tighten fit without oversizing your outer carton.",
    category: "Packaging Tips",
    author: "Elena Ruiz",
    date: "Feb 14, 2026",
    readTime: "4 min read",
    image: images.services[2],
    content: [
      "Damage in transit is often a fit problem, not a strength problem. Products that move inside the pack absorb impact repeatedly until something fails.",
      "Add targeted clearance only where needed — not uniformly on every axis. Snug trays and folded inserts often outperform generic void fill.",
      "For multi-SKU brands, consider a family of two outer sizes rather than one oversized shipper for everything.",
      "Test with your actual fulfillment flow: drop, vibration, and compression tests reveal issues that CAD alone cannot predict.",
    ],
  },
  {
    slug: "stand-up-pouch-design-checklist",
    title: "Stand-Up Pouch Design Checklist for Food Brands",
    excerpt:
      "Zipper placement, gusset width, fill volume, and print safe zones — the details that prevent costly reprints.",
    category: "Design",
    author: "Boxora Team",
    date: "Feb 3, 2026",
    readTime: "6 min read",
    image: images.megamenuCategories[8],
    content: [
      "Stand-up pouches look simple until artwork meets production. Small layout decisions become expensive if discovered after plates are made.",
      "Confirm fill volume and headspace with your co-packer before finalizing panel dimensions. Shelf presence changes dramatically with gusset width.",
      "Keep critical text and barcodes inside safe zones away from seals and folds. Reverse print on metallized films needs extra contrast testing.",
      "Plan for batch codes and allergen statements early — regulatory copy often forces late layout changes if not scoped upfront.",
    ],
  },
  {
    slug: "rigid-box-vs-folding-carton",
    title: "Rigid Box vs Folding Carton: When to Upgrade",
    excerpt:
      "Both formats work for premium products — but they solve different jobs in perceived value, protection, and unit economics.",
    category: "Packaging Tips",
    author: "Michael Chen",
    date: "Jan 22, 2026",
    readTime: "5 min read",
    image: images.packagingStyles[3],
    content: [
      "Folding cartons are efficient, print-friendly, and excellent for retail velocity. They are often the right first pack for new SKU launches.",
      "Rigid setup boxes signal luxury through structure and weight. They are common in cosmetics, electronics accessories, and limited editions.",
      "The upgrade decision usually comes down to price point, giftability, and whether the pack must survive multiple opens without looking worn.",
      "Hybrid approaches — folding carton with sleeve or partial rigid insert — can deliver premium cues at lower MOQ thresholds.",
    ],
  },
  {
    slug: "flexo-vs-digital-for-short-runs",
    title: "Flexo vs Digital Print for Short Packaging Runs",
    excerpt:
      "Tooling, color consistency, and lead times — how to pick the right print path for your next packaging project.",
    category: "Industry News",
    author: "Boxora Team",
    date: "Jan 10, 2026",
    readTime: "7 min read",
    image: images.services[4],
    content: [
      "Short runs used to mean compromise. Digital print for packaging has closed much of the quality gap for many board and label applications.",
      "Flexo remains strong at volume, especially when spot colors, metallics, or very specific brand color standards are non-negotiable.",
      "Digital excels when you need fast iterations, multiple SKUs, or seasonal artwork swaps without new plates.",
      "Ask for printed proofs on your actual substrate — color shifts between paper, kraft, and film are significant and predictable once documented.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPost() {
  return blogPosts.find((post) => post.featured) ?? blogPosts[0];
}

export function getRelatedPosts(slug: string, limit = 3) {
  const current = getBlogPost(slug);
  if (!current) return blogPosts.slice(0, limit);

  const sameCategory = blogPosts.filter(
    (post) => post.slug !== slug && post.category === current.category,
  );
  const others = blogPosts.filter(
    (post) => post.slug !== slug && post.category !== current.category,
  );

  return [...sameCategory, ...others].slice(0, limit);
}
