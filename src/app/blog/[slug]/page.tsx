import BlogPostPageClient from "./BlogPostPageClient";
import JsonLd from "@/components/JsonLd";
import { getBlogPost, getRelatedPosts, listBlogSlugs } from "@/lib/queries/blog";
import { getMarqueeItems } from "@/lib/queries/content";
import { blogPostJsonLd, breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const slugs = await listBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, related, marqueeItems] = await Promise.all([
    getBlogPost(slug),
    getRelatedPosts(slug, 3),
    getMarqueeItems(),
  ]);

  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={[
          blogPostJsonLd(post),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <BlogPostPageClient post={post} related={related} marqueeItems={marqueeItems} />
    </>
  );
}
