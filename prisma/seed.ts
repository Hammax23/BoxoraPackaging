import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";
import { blogCategories, blogPosts } from "../src/lib/blog";
import {
  faqs,
  footerLinks,
  marqueeItems,
  navLeft,
  navRight,
  products as seedProducts,
  testimonials,
} from "../src/lib/data";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5436/boxora?schema=public";

const pool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  // Site settings defaults
  await prisma.siteSetting.upsert({
    where: { key: "siteUrl" },
    update: {},
    create: { key: "siteUrl", value: process.env.NEXT_PUBLIC_SITE_URL ?? "https://boxorapackaging.com" },
  });

  // Marquee
  for (let i = 0; i < marqueeItems.length; i++) {
    await prisma.marqueeItem.upsert({
      where: { id: `marquee_${i}` },
      update: { text: marqueeItems[i], sortOrder: i, isActive: true },
      create: { id: `marquee_${i}`, text: marqueeItems[i], sortOrder: i, isActive: true },
    });
  }

  // Products
  for (const p of seedProducts) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        category: p.category ?? null,
        price: p.price ?? null,
        salePrice: (p as any).salePrice ?? null,
        discount: (p as any).discount ?? null,
        rating: p.rating ?? 0,
        reviews: p.reviews ?? 0,
        imageUrl: p.image,
        onSale: Boolean((p as any).onSale),
        hot: Boolean((p as any).hot),
        isActive: true,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        category: p.category ?? null,
        price: p.price ?? null,
        salePrice: (p as any).salePrice ?? null,
        discount: (p as any).discount ?? null,
        rating: p.rating ?? 0,
        reviews: p.reviews ?? 0,
        imageUrl: p.image,
        onSale: Boolean((p as any).onSale),
        hot: Boolean((p as any).hot),
        isActive: true,
      },
    });
  }

  // Blog categories
  const catMap = new Map<string, string>(); // name -> id
  for (const name of blogCategories.filter((c) => c !== "All")) {
    const slug = slugify(name);
    const created = await prisma.blogCategory.upsert({
      where: { slug },
      update: { name, isActive: true },
      create: { slug, name, isActive: true },
    });
    catMap.set(name, created.id);
  }

  // Blog posts + blocks
  for (const post of blogPosts) {
    const categoryId = catMap.get(post.category) ?? (await prisma.blogCategory.findFirst())!.id;
    const publishedAt = new Date(post.date);

    const created = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        authorName: post.author,
        publishedAt,
        readTime: post.readTime,
        featured: Boolean(post.featured),
        coverImageUrl: post.image,
        status: "PUBLISHED",
        categoryId,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        authorName: post.author,
        publishedAt,
        readTime: post.readTime,
        featured: Boolean(post.featured),
        coverImageUrl: post.image,
        status: "PUBLISHED",
        categoryId,
      },
    });

    await prisma.blogPostBlock.deleteMany({ where: { postId: created.id } });
    for (let i = 0; i < post.content.length; i++) {
      await prisma.blogPostBlock.create({
        data: {
          postId: created.id,
          type: "paragraph",
          content: post.content[i],
          sortOrder: i,
        },
      });
    }
  }

  // FAQs
  for (let i = 0; i < faqs.length; i++) {
    await prisma.faq.upsert({
      where: { id: `faq_${i}` },
      update: { question: faqs[i].question, answer: faqs[i].answer, sortOrder: i, isActive: true },
      create: { id: `faq_${i}`, question: faqs[i].question, answer: faqs[i].answer, sortOrder: i, isActive: true },
    });
  }

  // Testimonials
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    await prisma.testimonial.upsert({
      where: { id: `testimonial_${i}` },
      update: {
        title: t.title,
        text: t.text,
        name: `${t.name}|${t.role}`,
        imageUrl: t.image,
        sortOrder: i,
        isActive: true,
      },
      create: {
        id: `testimonial_${i}`,
        title: t.title,
        text: t.text,
        name: `${t.name}|${t.role}`,
        imageUrl: t.image,
        sortOrder: i,
        isActive: true,
      },
    });
  }

  // Navigation
  async function seedNav(
    area: "left" | "right",
    items: ReadonlyArray<{ label: string; href: string; megamenu?: string; children?: readonly string[] }>,
    startOrder = 0
  ) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const id = `nav_${area}_${i}`;
      const created = await prisma.navigationItem.upsert({
        where: { id },
        update: {
          area,
          label: item.label,
          href: item.href,
          megamenu: "megamenu" in item ? item.megamenu : null,
          sortOrder: startOrder + i,
          isActive: true,
        },
        create: {
          id,
          area,
          label: item.label,
          href: item.href,
          megamenu: "megamenu" in item ? item.megamenu : null,
          sortOrder: startOrder + i,
          isActive: true,
        },
      });
      if ("children" in item && item.children) {
        for (let j = 0; j < item.children.length; j++) {
          const childId = `${id}_child_${j}`;
          await prisma.navigationItem.upsert({
            where: { id: childId },
            update: {
              area,
              label: item.children[j],
              href: "#",
              parentId: created.id,
              sortOrder: j,
              isActive: true,
            },
            create: {
              id: childId,
              area,
              label: item.children[j],
              href: "#",
              parentId: created.id,
              sortOrder: j,
              isActive: true,
            },
          });
        }
      }
    }
  }

  await seedNav("left", navLeft);
  await seedNav("right", navRight);

  // Footer link groups
  const footerMap = [
    { key: "shop", title: "shop", links: footerLinks.shop },
    { key: "company", title: "company", links: footerLinks.company },
    { key: "support", title: "support", links: footerLinks.support },
  ] as const;

  const footerHrefMap: Record<string, string> = {
    "All Products": "/products",
    Categories: "/products",
    Blog: "/blog",
    FAQ: "#faq",
    "Contact Us": "#contact",
  };

  for (let g = 0; g < footerMap.length; g++) {
    const group = footerMap[g];
    const groupId = `footer_${group.key}`;
    await prisma.footerLinkGroup.upsert({
      where: { id: groupId },
      update: { title: group.title, sortOrder: g },
      create: { id: groupId, title: group.title, sortOrder: g },
    });
    for (let i = 0; i < group.links.length; i++) {
      const label = group.links[i];
      await prisma.footerLink.upsert({
        where: { id: `${groupId}_${i}` },
        update: {
          groupId,
          label,
          href: footerHrefMap[label] ?? "#",
          sortOrder: i,
        },
        create: {
          id: `${groupId}_${i}`,
          groupId,
          label,
          href: footerHrefMap[label] ?? "#",
          sortOrder: i,
        },
      });
    }
  }

  // Create first admin user if ADMIN_EMAIL/ADMIN_PASSWORD provided.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const salt = crypto.randomBytes(16).toString("hex");
    const derived = crypto.scryptSync(adminPassword, salt, 64).toString("hex");
    const passwordHash = `scrypt$${salt}$${derived}`;

    await prisma.adminUser.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: { passwordHash, isActive: true },
      create: { email: adminEmail.toLowerCase(), passwordHash, isActive: true },
    });
  }
}

main()
  .then(async () => {
    await pool.end();
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await pool.end();
    await prisma.$disconnect();
    process.exit(1);
  });

