import { faqs as staticFaqs, marqueeItems as staticMarquee, testimonials as staticTestimonials } from "@/lib/data";
import { prisma } from "@/lib/db";

export type FaqView = { question: string; answer: string };
export type TestimonialView = {
  title: string;
  text: string;
  name: string;
  role: string;
  image: string;
};

export async function getMarqueeItems(): Promise<string[]> {
  try {
    const rows = await prisma.marqueeItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) return rows.map((r) => r.text);
  } catch {
    // fall through
  }
  return [...staticMarquee];
}

export async function getFaqs(): Promise<FaqView[]> {
  try {
    const rows = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) return rows.map((r) => ({ question: r.question, answer: r.answer }));
  } catch {
    // fall through
  }
  return staticFaqs.map((f) => ({ question: f.question, answer: f.answer }));
}

export async function getTestimonials(): Promise<TestimonialView[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length > 0) {
      return rows.map((r) => {
        const [name, role] = r.name.includes("|") ? r.name.split("|", 2) : [r.name, "Customer"];
        return {
          title: r.title,
          // Older entries were written for the template's former brand name.
          text: r.text.replace(/bocpak/gi, "Boxora"),
          name: name.trim(),
          role: (role ?? "Customer").trim(),
          image: r.imageUrl ?? "/images/placeholder-avatar.png",
        };
      });
    }
  } catch {
    // fall through
  }
  return staticTestimonials.map((t) => ({
    title: t.title,
    text: t.text,
    name: t.name,
    role: t.role,
    image: t.image,
  }));
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    if (row?.value !== undefined) return row.value as T;
  } catch {
    // fall through
  }
  return fallback;
}
