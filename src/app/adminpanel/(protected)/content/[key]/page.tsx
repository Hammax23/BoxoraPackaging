import ConfirmButton from "@/components/admin/ConfirmButton";
import ContentEditor from "@/components/admin/ContentEditor";
import { requireAdmin } from "@/lib/adminAuth";
import { contentSection } from "@/lib/contentSections";
import { getContent } from "@/lib/queries/pageContent";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { resetSection, saveSection } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminContentSectionPage({ params }: { params: Promise<{ key: string }> }) {
  await requireAdmin();
  const { key } = await params;
  const section = contentSection(key);
  if (!section) notFound();
  const value = await getContent<never>(key);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/adminpanel/content" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
        <ChevronLeft className="h-4 w-4" /> Page content
      </Link>
      <h1 className="mt-2 font-heading text-3xl text-dark">{section.label}</h1>
      <p className="mt-2 text-sm text-text">{section.hint}</p>
      <div className="mt-6">
        <ContentEditor sectionKey={key} initial={value} selects={section.selects} save={saveSection} />
      </div>
      <form action={resetSection.bind(null, key)} className="mt-8">
        <ConfirmButton message="Discard your edits and restore the built-in default?" className="text-sm font-semibold text-red-600 underline">
          Reset to default
        </ConfirmButton>
      </form>
    </div>
  );
}
