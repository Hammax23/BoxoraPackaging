import ImageField from "@/components/admin/ImageField";
import { requireAdmin } from "@/lib/adminAuth";
import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

export default async function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({
      where: { id },
      include: { blocks: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!post) notFound();

  async function save(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const excerpt = String(formData.get("excerpt") ?? "").trim();
    const categoryId = String(formData.get("categoryId") ?? "");
    const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
    const authorName = String(formData.get("authorName") ?? "").trim();
    const readTime = String(formData.get("readTime") ?? "").trim();
    const status = String(formData.get("status") ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "ARCHIVED";
    const featured = formData.get("featured") === "on";
    const content = String(formData.get("content") ?? "").trim();

    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        categoryId,
        coverImageUrl,
        authorName,
        readTime,
        status,
        featured,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    await prisma.blogPostBlock.deleteMany({ where: { postId: id } });
    const paragraphs = content.split("\n\n").map((p) => p.trim()).filter(Boolean);
    for (let i = 0; i < paragraphs.length; i++) {
      await prisma.blogPostBlock.create({
        data: { postId: id, type: "paragraph", content: paragraphs[i], sortOrder: i },
      });
    }

    revalidatePath("/adminpanel/blog");
    revalidatePath(`/adminpanel/blog/${id}`);
    revalidatePath(`/blog/${slug}`);
    revalidatePublicContent();
  }

  const content = post.blocks.map((b) => b.content).join("\n\n");

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="section-label text-primary">Edit</p>
            <h2 className="mt-4 font-heading text-3xl text-dark">{post.title}</h2>
          </div>
          <Link href="/adminpanel/blog" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-text">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </div>

      <form action={save} className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <input type="hidden" name="id" value={post.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <input name="title" defaultValue={post.title} className={input} required />
          <input name="slug" defaultValue={post.slug} className={input} required />
          <select name="categoryId" defaultValue={post.categoryId} className={input} required>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select name="status" defaultValue={post.status} className={input}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          <input name="authorName" defaultValue={post.authorName} className={input} />
          <input name="readTime" defaultValue={post.readTime} className={input} />
          <div className="md:col-span-2"><ImageField name="coverImageUrl" defaultValue={post.coverImageUrl} required /></div>
          <textarea name="excerpt" defaultValue={post.excerpt} rows={3} className={`${input} md:col-span-2`} required />
          <textarea name="content" defaultValue={content} rows={10} className={`${input} md:col-span-2`} placeholder="Separate paragraphs with blank lines" />
        </div>
        <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-dark">
          <input name="featured" type="checkbox" defaultChecked={post.featured} className="h-5 w-5 accent-primary" />
          Featured post
        </label>
        <div className="mt-6 flex justify-end">
          <button type="submit" className="btn-slip inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white">
            <Save className="h-4 w-4" />
            Save post
          </button>
        </div>
      </form>
    </div>
  );
}
