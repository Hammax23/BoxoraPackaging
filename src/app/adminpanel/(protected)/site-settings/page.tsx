import { requireAdmin } from "@/lib/adminAuth";
import { revalidatePublicContent } from "@/lib/adminRevalidate";
import { prisma } from "@/lib/db";
import { topBar, heroContent, featuresSection } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { Save } from "lucide-react";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

export default async function AdminSiteSettingsPage() {
  await requireAdmin();

  const settings = await prisma.siteSetting.findMany();
  const map = new Map(settings.map((s) => [s.key, s.value]));

  const topBarVal = (map.get("topBar") as typeof topBar) ?? topBar;
  const heroVal = (map.get("heroContent") as typeof heroContent) ?? heroContent;
  const featuresVal = (map.get("featuresSection") as typeof featuresSection) ?? featuresSection;
  const siteUrl = String(map.get("siteUrl") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "");

  async function save(formData: FormData) {
    "use server";
    await requireAdmin();

    const nextTopBar = {
      tagline: String(formData.get("tagline") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      tollFree: String(formData.get("tollFree") ?? ""),
      address: String(formData.get("address") ?? ""),
      helpText: String(formData.get("helpText") ?? ""),
      quoteHref: String(formData.get("quoteHref") ?? ""),
      quoteLabel: String(formData.get("quoteLabel") ?? ""),
    };
  const nextHero = {
    badge: String(formData.get("heroBadge") ?? ""),
    titleLine1: String(formData.get("heroTitleLine1") ?? ""),
    titleLine2: String(formData.get("heroTitleLine2") ?? ""),
    subtitle: String(formData.get("heroSubtitle") ?? ""),
    tags: heroVal.tags ?? [],
  };
    const nextFeatures = {
      label: String(formData.get("featuresLabel") ?? ""),
      title: String(formData.get("featuresTitle") ?? ""),
      description: String(formData.get("featuresDescription") ?? ""),
    };
    const nextSiteUrl = String(formData.get("siteUrl") ?? "").trim();

    await prisma.siteSetting.upsert({
      where: { key: "topBar" },
      update: { value: nextTopBar },
      create: { key: "topBar", value: nextTopBar },
    });
    await prisma.siteSetting.upsert({
      where: { key: "heroContent" },
      update: { value: nextHero },
      create: { key: "heroContent", value: nextHero },
    });
    await prisma.siteSetting.upsert({
      where: { key: "featuresSection" },
      update: { value: nextFeatures },
      create: { key: "featuresSection", value: nextFeatures },
    });
    if (nextSiteUrl) {
      await prisma.siteSetting.upsert({
        where: { key: "siteUrl" },
        update: { value: nextSiteUrl },
        create: { key: "siteUrl", value: nextSiteUrl },
      });
    }

    revalidatePath("/adminpanel/site-settings");
    revalidatePublicContent();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Global</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Site settings</h2>
        <p className="mt-2 text-sm text-text">Top bar, hero copy, and feature section headings.</p>
      </div>

      <form action={save} className="space-y-6">
        <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
          <h3 className="font-heading text-2xl text-dark">Site URL</h3>
          <input name="siteUrl" defaultValue={siteUrl} className={`${input} mt-4`} placeholder="https://boxorapackaging.com" />
        </div>

        <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
          <h3 className="font-heading text-2xl text-dark">Top bar</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input name="tagline" defaultValue={topBarVal.tagline} className={input} placeholder="Tagline" />
            <input name="email" defaultValue={topBarVal.email} className={input} placeholder="Email" />
            <input name="phone" defaultValue={topBarVal.phone} className={input} placeholder="Phone" />
            <input name="address" defaultValue={topBarVal.address ?? ""} className={input} placeholder="Business address (footer)" />
            <input name="tollFree" defaultValue={topBarVal.tollFree ?? ""} className={input} placeholder="Toll-free number (contact page)" />
            <input name="helpText" defaultValue={topBarVal.helpText} className={input} placeholder="Help text" />
            <input name="quoteHref" defaultValue={topBarVal.quoteHref} className={input} placeholder="Quote href" />
            <input name="quoteLabel" defaultValue={topBarVal.quoteLabel} className={input} placeholder="Quote label" />
          </div>
        </div>

        <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
          <h3 className="font-heading text-2xl text-dark">Hero section</h3>
          <div className="mt-4 grid gap-4">
            <input name="heroBadge" defaultValue={heroVal.badge} className={input} placeholder="Badge" />
            <input name="heroTitleLine1" defaultValue={heroVal.titleLine1} className={input} placeholder="Title line 1" />
            <input name="heroTitleLine2" defaultValue={heroVal.titleLine2} className={input} placeholder="Title line 2" />
            <textarea name="heroSubtitle" defaultValue={heroVal.subtitle} rows={3} className={input} placeholder="Subtitle" />
          </div>
        </div>

        <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
          <h3 className="font-heading text-2xl text-dark">Features section</h3>
          <div className="mt-4 grid gap-4">
            <input name="featuresLabel" defaultValue={featuresVal.label} className={input} placeholder="Label" />
            <input name="featuresTitle" defaultValue={featuresVal.title} className={input} placeholder="Title" />
            <textarea name="featuresDescription" defaultValue={featuresVal.description} rows={3} className={input} placeholder="Description" />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-slip inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white">
            <Save className="h-4 w-4" />
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}
