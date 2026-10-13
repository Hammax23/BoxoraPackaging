import { requireAdmin } from "@/lib/adminAuth";
import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { prisma } from "@/lib/db";
import ConfirmButton from "@/components/admin/ConfirmButton";
import ImageField from "@/components/admin/ImageField";
import SubmitButton from "@/components/admin/SubmitButton";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import { moveItem, removeItem, saveItem, setTestimonialsVisible, toggleItem } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await requireAdmin();

  const [marquee, faqs, testimonials, showSetting] = await Promise.all([
    prisma.marqueeItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.faq.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.siteSetting.findUnique({ where: { key: "showTestimonials" } }),
  ]);
  const showTestimonials = showSetting?.value === true;

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

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Homepage</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Marquee, FAQs & testimonials</h2>
        <p className="mt-2 text-sm text-text">
          Add, edit, reorder and show or hide items. Changes appear on the website straight away.
        </p>
      </div>

      <Section
        kind="marquee"
        title="Marquee items"
        hint="The scrolling highlights under the hero."
        onAdd={addMarquee}
        addFields={[{ name: "text", placeholder: "Marquee text" }]}
        items={marquee.map((m) => ({ id: m.id, title: m.text, active: m.isActive, fields: { text: m.text } }))}
      />

      <Section
        kind="faq"
        title="FAQs"
        hint="Shown on the homepage and the FAQ page."
        onAdd={addFaq}
        addFields={[
          { name: "question", placeholder: "Question" },
          { name: "answer", placeholder: "Answer", textarea: true },
        ]}
        items={faqs.map((f) => ({
          id: f.id,
          title: f.question,
          subtitle: f.answer,
          active: f.isActive,
          fields: { question: f.question, answer: f.answer },
        }))}
      />

      <Section
        kind="testimonial"
        title="Testimonials"
        hint="Only add real customer reviews."
        headerExtra={
          <form action={setTestimonialsVisible} className="flex items-center gap-3">
            <input type="hidden" name="visible" value={String(!showTestimonials)} />
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${showTestimonials ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {showTestimonials ? "Visible on homepage" : "Hidden on homepage"}
            </span>
            <SubmitButton
              pendingText="…"
              className="rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-dark hover:border-primary hover:text-primary"
            >
              {showTestimonials ? "Hide section" : "Show section"}
            </SubmitButton>
          </form>
        }
        onAdd={addTestimonial}
        addFields={[
          { name: "title", placeholder: "Title" },
          { name: "text", placeholder: "Quote text", textarea: true },
          { name: "name", placeholder: "Name" },
          { name: "role", placeholder: "Role" },
          { name: "imageUrl", placeholder: "Photo URL or upload", image: true },
        ]}
        items={testimonials.map((t) => {
          const [name, role] = t.name.includes("|") ? t.name.split("|", 2) : [t.name, ""];
          return {
            id: t.id,
            title: t.title,
            subtitle: `${name}${role ? ` · ${role}` : ""}`,
            active: t.isActive,
            fields: { title: t.title, text: t.text, name, role, imageUrl: t.imageUrl ?? "" },
          };
        })}
      />
    </div>
  );
}

type Field = { name: string; placeholder: string; textarea?: boolean; image?: boolean };
type Item = { id: string; title: string; subtitle?: string; active: boolean; fields: Record<string, string> };

const inputCls =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";
const iconBtn =
  "h-9 w-9 rounded-full border border-border text-text transition hover:border-primary/30 hover:text-primary disabled:opacity-30";

function Field({ f, value }: { f: Field; value?: string }) {
  if (f.image) return <ImageField name={f.name} defaultValue={value ?? ""} placeholder={f.placeholder} />;
  if (f.textarea)
    return <textarea name={f.name} defaultValue={value} placeholder={f.placeholder} rows={3} className={inputCls} required />;
  return (
    <input
      name={f.name}
      defaultValue={value}
      placeholder={f.placeholder}
      className={inputCls}
      required={f.name !== "role"}
    />
  );
}

function Section({
  kind,
  title,
  hint,
  headerExtra,
  onAdd,
  addFields,
  items,
}: {
  kind: "marquee" | "faq" | "testimonial";
  title: string;
  hint?: string;
  headerExtra?: React.ReactNode;
  onAdd: (formData: FormData) => Promise<void>;
  addFields: Field[];
  items: Item[];
}) {
  return (
    <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-2xl text-dark">
            {title} <span className="text-base text-lighter">({items.length})</span>
          </h3>
          {hint && <p className="mt-1 text-sm text-text">{hint}</p>}
        </div>
        {headerExtra}
      </div>

      <form action={onAdd} className="mt-5 grid gap-3 rounded-2xl bg-background-field/50 p-4">
        {addFields.map((f) => (
          <Field key={f.name} f={f} />
        ))}
        <SubmitButton pendingText="Adding…" className="btn-slip w-fit rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white">
          <Plus className="h-4 w-4" /> Add
        </SubmitButton>
      </form>

      <div className="mt-6 divide-y divide-border rounded-2xl border border-border">
        {items.map((item, i) => (
          <div key={item.id} className={`px-4 py-4 ${item.active ? "" : "bg-background-field/40"}`}>
            <div className="flex items-center justify-between gap-4">
              <div className={`min-w-0 ${item.active ? "" : "opacity-60"}`}>
                <p className="font-semibold text-dark">{item.title}</p>
                {item.subtitle && <p className="mt-1 line-clamp-2 text-sm text-lighter">{item.subtitle}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <form action={moveItem}>
                  <input type="hidden" name="kind" value={kind} />
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="dir" value="up" />
                  <SubmitButton pendingText="" className={iconBtn}>
                    <ArrowUp className="h-4 w-4" aria-label="Move up" />
                  </SubmitButton>
                </form>
                <form action={moveItem}>
                  <input type="hidden" name="kind" value={kind} />
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="dir" value="down" />
                  <SubmitButton pendingText="" className={iconBtn}>
                    <ArrowDown className="h-4 w-4" aria-label="Move down" />
                  </SubmitButton>
                </form>
                <form action={toggleItem}>
                  <input type="hidden" name="kind" value={kind} />
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="isActive" value={String(!item.active)} />
                  <SubmitButton pendingText="" className={iconBtn}>
                    {item.active ? <Eye className="h-4 w-4" aria-label="Hide" /> : <EyeOff className="h-4 w-4" aria-label="Show" />}
                  </SubmitButton>
                </form>
                <form action={removeItem}>
                  <input type="hidden" name="kind" value={kind} />
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmButton message={`Delete "${item.title.slice(0, 60)}"?`} label="Delete" className={`${iconBtn} hover:!border-red-300 hover:!text-red-600`}>
                    <Trash2 className="h-4 w-4" />
                  </ConfirmButton>
                </form>
              </div>
            </div>

            <details className="group mt-3">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-primary">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </summary>
              <form action={saveItem} className="mt-3 grid gap-3">
                <input type="hidden" name="kind" value={kind} />
                <input type="hidden" name="id" value={item.id} />
                {addFields.map((f) => (
                  <Field key={f.name} f={f} value={item.fields[f.name]} />
                ))}
                <SubmitButton pendingText="Saving…" className="btn-slip w-fit rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white">
                  Save changes
                </SubmitButton>
              </form>
            </details>
            <span className="sr-only">Position {i + 1}</span>
          </div>
        ))}
        {items.length === 0 && <p className="px-4 py-8 text-center text-sm text-lighter">No items yet.</p>}
      </div>
    </div>
  );
}
