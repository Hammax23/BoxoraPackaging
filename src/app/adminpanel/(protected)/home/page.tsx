import { requireAdmin } from "@/lib/adminAuth";
import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { prisma } from "@/lib/db";
import { Plus, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

export default async function AdminHomePage() {
  await requireAdmin();

  const [marquee, faqs, testimonials] = await Promise.all([
    prisma.marqueeItem.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  async function addMarquee(formData: FormData) {
    "use server";
    await requireAdmin();
    const text = String(formData.get("text") ?? "").trim();
    if (!text) return;
    const count = await prisma.marqueeItem.count();
    await prisma.marqueeItem.create({ data: { text, sortOrder: count, isActive: true } });
    revalidatePath("/adminpanel/home");
    revalidatePublicContent();
  }

  async function deleteMarquee(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.marqueeItem.delete({ where: { id } });
    revalidatePath("/adminpanel/home");
    revalidatePublicContent();
  }

  async function addFaq(formData: FormData) {
    "use server";
    await requireAdmin();
    const question = String(formData.get("question") ?? "").trim();
    const answer = String(formData.get("answer") ?? "").trim();
    if (!question || !answer) return;
    const count = await prisma.faq.count();
    await prisma.faq.create({ data: { question, answer, sortOrder: count, isActive: true } });
    revalidatePath("/adminpanel/home");
    revalidatePublicContent();
  }

  async function deleteFaq(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.faq.delete({ where: { id } });
    revalidatePath("/adminpanel/home");
    revalidatePublicContent();
  }

  async function addTestimonial(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = String(formData.get("title") ?? "").trim();
    const text = String(formData.get("text") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    if (!title || !text || !name) return;
    const count = await prisma.testimonial.count();
    await prisma.testimonial.create({
      data: {
        title,
        text,
        name: role ? `${name}|${role}` : name,
        imageUrl: imageUrl || null,
        sortOrder: count,
        isActive: true,
      },
    });
    revalidatePath("/adminpanel/home");
    revalidatePublicContent();
  }

  async function deleteTestimonial(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/adminpanel/home");
    revalidatePublicContent();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Homepage</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Marquee, FAQs & testimonials</h2>
      </div>

      <Section title="Marquee items" onAdd={addMarquee} addFields={[{ name: "text", placeholder: "Marquee text" }]} items={marquee.map((m) => ({ id: m.id, title: m.text }))} onDelete={deleteMarquee} />

      <Section
        title="FAQs"
        onAdd={addFaq}
        addFields={[
          { name: "question", placeholder: "Question" },
          { name: "answer", placeholder: "Answer", textarea: true },
        ]}
        items={faqs.map((f) => ({ id: f.id, title: f.question, subtitle: f.answer }))}
        onDelete={deleteFaq}
      />

      <Section
        title="Testimonials"
        onAdd={addTestimonial}
        addFields={[
          { name: "title", placeholder: "Title" },
          { name: "text", placeholder: "Quote text", textarea: true },
          { name: "name", placeholder: "Name" },
          { name: "role", placeholder: "Role" },
          { name: "imageUrl", placeholder: "Image URL" },
        ]}
        items={testimonials.map((t) => ({
          id: t.id,
          title: t.title,
          subtitle: t.name.includes("|") ? t.name.replace("|", " · ") : t.name,
        }))}
        onDelete={deleteTestimonial}
      />
    </div>
  );
}

function Section({
  title,
  onAdd,
  addFields,
  items,
  onDelete,
}: {
  title: string;
  onAdd: (formData: FormData) => Promise<void>;
  addFields: { name: string; placeholder: string; textarea?: boolean }[];
  items: { id: string; title: string; subtitle?: string }[];
  onDelete: (formData: FormData) => Promise<void>;
}) {
  const input =
    "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

  return (
    <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
      <h3 className="font-heading text-2xl text-dark">{title}</h3>
      <form action={onAdd} className="mt-4 grid gap-3">
        {addFields.map((f) =>
          f.textarea ? (
            <textarea key={f.name} name={f.name} placeholder={f.placeholder} rows={3} className={input} required />
          ) : (
            <input key={f.name} name={f.name} placeholder={f.placeholder} className={input} required={f.name !== "imageUrl" && f.name !== "role"} />
          )
        )}
        <button type="submit" className="btn-slip inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>
      <div className="mt-6 divide-y divide-border rounded-2xl border border-border">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <p className="font-semibold text-dark">{item.title}</p>
              {item.subtitle && <p className="mt-1 line-clamp-2 text-sm text-lighter">{item.subtitle}</p>}
            </div>
            <form action={onDelete}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text hover:text-secondary">
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          </div>
        ))}
        {items.length === 0 && <p className="px-4 py-8 text-center text-sm text-lighter">No items yet.</p>}
      </div>
    </div>
  );
}
