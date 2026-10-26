import { requireAdmin } from "@/lib/adminAuth";
import { contentSections } from "@/lib/contentSections";
import { prisma } from "@/lib/db";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  await requireAdmin();
  const saved = new Set((await prisma.siteSetting.findMany({ where: { key: { startsWith: "content:" } }, select: { key: true } })).map((r) => r.key));

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-heading text-3xl text-dark">Page content</h1>
      <p className="mt-2 text-sm text-text">Edit the text, images and lists shown on the public pages.</p>
      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-white">
        {contentSections.map((s) => (
          <Link key={s.key} href={`/adminpanel/content/${s.key}`} className="flex items-center justify-between gap-4 p-4 transition hover:bg-background-field">
            <span>
              <span className="block font-semibold text-dark">{s.label}</span>
              <span className="block text-sm text-text">{s.hint}</span>
            </span>
            <span className="flex shrink-0 items-center gap-2 text-xs font-bold text-lighter">
              {saved.has(`content:${s.key}`) ? "Customised" : "Default"}
              <ChevronRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
