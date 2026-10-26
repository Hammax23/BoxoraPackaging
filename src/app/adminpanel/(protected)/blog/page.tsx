import { requireAdmin } from "@/lib/adminAuth";
import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import ImageField from "@/components/admin/ImageField";
import ConfirmButton from "@/components/admin/ConfirmButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { logAction } from "@/lib/adminAudit";

export const dynamic = "force-dynamic";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const q = ((await searchParams).q ?? "").trim();

  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where: q ? { title: { contains: q, mode: "insensitive" } } : undefined,
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.blogCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  async function createPost(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const excerpt = String(formData.get("excerpt") ?? "").trim();
    const categoryId = String(formData.get("categoryId") ?? "");
    const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const authorName = String(formData.get("authorName") ?? "").trim();
    const readTime = String(formData.get("readTime") ?? "").trim();
    const status = formData.get("status") === "DRAFT" ? "DRAFT" : "PUBLISHED";
    if (!title || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || !excerpt || !categoryId || !coverImageUrl || !authorName || !readTime || !content) return;
    if (await prisma.blogPost.findUnique({ where: { slug }, select: { id: true } })) return;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        authorName,
        readTime,
        coverImageUrl,
        categoryId,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        featured: formData.get("featured") === "on",
      },
    });

    const paragraphs = content.split("\n\n").map((x) => x.trim()).filter(Boolean);
    await prisma.blogPostBlock.createMany({
      data: paragraphs.map((c, i) => ({ postId: post.id, type: "paragraph", content: c, sortOrder: i })),
    });

    await logAction(admin.id, "Post created", "BlogPost", post.id);
    revalidatePath("/adminpanel/blog");
    revalidatePublicContent();
  }

  async function addCategory(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const name = String(formData.get("name") ?? "").trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!name || !slug) return;
    if (await prisma.blogCategory.findUnique({ where: { slug }, select: { id: true } })) return;
    const sortOrder = await prisma.blogCategory.count();
    const row = await prisma.blogCategory.create({ data: { name, slug, sortOrder, isActive: true } });
    await logAction(admin.id, "Blog category added", "BlogCategory", row.id);
    revalidatePath("/adminpanel/blog");
    revalidatePublicContent();
  }

  async function deleteCategory(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    // Categories with posts can't be removed (FK is Restrict); move or delete the posts first.
    if (await prisma.blogPost.count({ where: { categoryId: id } })) return;
    await prisma.blogCategory.deleteMany({ where: { id } });
    await logAction(admin.id, "Blog category deleted", "BlogCategory", id);
    revalidatePath("/adminpanel/blog");
    revalidatePublicContent();
  }

  async function togglePublish(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const publish = formData.get("publish") === "true";
    if (!id) return;
    await prisma.blogPost.update({
      where: { id },
      data: publish ? { status: "PUBLISHED", publishedAt: new Date() } : { status: "DRAFT" },
    });
    await logAction(admin.id, publish ? "Post published" : "Post unpublished", "BlogPost", id);
    revalidatePath("/adminpanel/blog");
    revalidatePublicContent();
  }

  async function deletePost(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.blogPost.delete({ where: { id } });
    await logAction(admin.id, "Post deleted", "BlogPost", id);
    revalidatePath("/adminpanel/blog");
    revalidatePublicContent();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Content</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Blog posts</h2>
      </div>

      <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
        <h3 className="font-heading text-2xl text-dark">Categories</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <form key={c.id} action={deleteCategory} className="inline-flex items-center gap-1 rounded-full border border-border bg-background-field/40 py-1 pl-3 pr-1 text-sm font-semibold text-dark">
              <input type="hidden" name="id" value={c.id} />
              {c.name}
              <ConfirmButton message="Delete this category? (Only works if it has no posts.)" label={`Delete ${c.name}`} className="h-7 w-7 rounded-full text-lighter hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </ConfirmButton>
            </form>
          ))}
        </div>
        <form action={addCategory} className="mt-4 flex gap-2">
          <input name="name" placeholder="New category name" className={input} required />
          <SubmitButton pendingText="Adding…" className="shrink-0 rounded-xl bg-primary px-5 text-xs font-bold uppercase tracking-[0.08em] text-white">
            <Plus className="h-4 w-4" />
            Add
          </SubmitButton>
        </form>
      </div>

      <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
        <h3 className="font-heading text-2xl text-dark">Add post</h3>
        <form action={createPost} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="title" placeholder="Title" className={input} required />
          <input name="slug" placeholder="Slug (e.g. my-post)" pattern="[a-z0-9]+(-[a-z0-9]+)*" title="Lowercase letters, numbers and hyphens" className={input} required />
          <select name="categoryId" className={input} required>
            <option value="">Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select name="status" defaultValue="PUBLISHED" className={input} required>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
          <input name="authorName" placeholder="Author (e.g. Boxora Team)" className={input} required />
          <input name="readTime" placeholder="Read time (e.g. 5 min read)" className={input} required />
          <div className="md:col-span-2"><ImageField name="coverImageUrl" placeholder="Cover image URL or upload" required /></div>
          <textarea name="excerpt" placeholder="Excerpt" rows={2} className={`${input} md:col-span-2`} required />
          <textarea name="content" placeholder="Post body: separate paragraphs with a blank line" rows={8} className={`${input} md:col-span-2`} required />
          <label className="flex items-center gap-3 text-sm font-semibold text-dark md:col-span-2">
            <input name="featured" type="checkbox" className="h-5 w-5 accent-primary" /> Featured post
          </label>
          <SubmitButton pendingText="Creating…" className="btn-slip rounded-xl bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white md:col-span-2">
            <Plus className="h-4 w-4" />
            Create post
          </SubmitButton>
        </form>
      </div>

      <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
        <form action="/adminpanel/blog" className="mb-4">
          <input name="q" defaultValue={q} placeholder={`Search ${posts.length} posts…`} className={input} />
        </form>
        <div className="divide-y divide-border rounded-2xl border border-border">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4 px-4 py-4">
              <div className="flex min-w-0 items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.coverImageUrl} alt="" className="h-12 w-16 shrink-0 rounded-lg bg-background-field object-cover" />
                <div className="min-w-0">
                <p className="font-semibold text-dark">{post.title}</p>
                <p className="text-sm text-lighter">
                  {post.category.name} · {post.status} · /{post.slug}
                </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <form action={togglePublish}>
                  <input type="hidden" name="id" value={post.id} />
                  <input type="hidden" name="publish" value={String(post.status !== "PUBLISHED")} />
                  <SubmitButton pendingText="…" className="rounded-full border border-border px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-text hover:text-primary">
                    {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </SubmitButton>
                </form>
                <Link href={`/adminpanel/blog/${post.id}`} className="rounded-full border border-border px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-text hover:text-primary">
                  Edit
                </Link>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <ConfirmButton className="h-10 w-10 rounded-full border border-border text-text hover:text-secondary">
                    <Trash2 className="h-4 w-4" aria-label="Delete" />
                  </ConfirmButton>
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
