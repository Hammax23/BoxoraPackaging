import { requireAdmin } from "@/lib/adminAuth";
import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

export default async function AdminBlogPage() {
  await requireAdmin();

  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  async function createPost(formData: FormData) {
    "use server";
    await requireAdmin();
    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const excerpt = String(formData.get("excerpt") ?? "").trim();
    const categoryId = String(formData.get("categoryId") ?? "");
    const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    if (!title || !slug || !excerpt || !categoryId || !coverImageUrl) return;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        authorName: "Boxora Team",
        readTime: "5 min read",
        coverImageUrl,
        categoryId,
        status: "PUBLISHED",
        publishedAt: new Date(),
        featured: false,
      },
    });

    if (content) {
      await prisma.blogPostBlock.create({
        data: { postId: post.id, type: "paragraph", content, sortOrder: 0 },
      });
    }

    revalidatePath("/adminpanel/blog");
    revalidatePublicContent();
  }

  async function deletePost(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/adminpanel/blog");
    revalidatePublicContent();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Content</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Blog posts</h2>
      </div>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <h3 className="font-heading text-2xl text-dark">Add post</h3>
        <form action={createPost} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="title" placeholder="Title" className={input} required />
          <input name="slug" placeholder="Slug" className={input} required />
          <select name="categoryId" className={input} required>
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input name="coverImageUrl" placeholder="Cover image URL" className={input} required />
          <textarea name="excerpt" placeholder="Excerpt" rows={2} className={`${input} md:col-span-2`} required />
          <textarea name="content" placeholder="First paragraph" rows={4} className={`${input} md:col-span-2`} />
          <button type="submit" className="btn-slip inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white md:col-span-2">
            <Plus className="h-4 w-4" />
            Create post
          </button>
        </form>
      </div>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <div className="divide-y divide-border rounded-2xl border border-border">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="min-w-0">
                <p className="font-semibold text-dark">{post.title}</p>
                <p className="text-sm text-lighter">
                  {post.category.name} · {post.status} · /{post.slug}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/adminpanel/blog/${post.id}`} className="rounded-full border border-border px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-text hover:text-primary">
                  Edit
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-text hover:text-secondary">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="px-4 py-8 text-center text-sm text-lighter">No posts yet.</p>}
        </div>
      </div>
    </div>
  );
}
