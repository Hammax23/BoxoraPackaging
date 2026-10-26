import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { logAction } from "@/lib/adminAudit";
import ConfirmButton from "@/components/admin/ConfirmButton";
import SubmitButton from "@/components/admin/SubmitButton";
import { CheckCheck, Mail, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  await requireAdmin();
  const { filter } = await searchParams;
  const onlyUnread = filter === "unread";
  const messages = await prisma.contactMessage.findMany({
    where: onlyUnread ? { isRead: false } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  const unreadTotal = await prisma.contactMessage.count({ where: { isRead: false } });

  async function toggleRead(formData: FormData) {
    "use server";
    await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const isRead = formData.get("isRead") === "true";
    if (!id) return;
    await prisma.contactMessage.update({ where: { id }, data: { isRead } });
    revalidatePath("/adminpanel", "layout");
  }

  async function markAllRead() {
    "use server";
    const admin = await requireAdmin();
    await prisma.contactMessage.updateMany({ where: { isRead: false }, data: { isRead: true } });
    await logAction(admin.id, "Marked all messages read", "ContactMessage");
    revalidatePath("/adminpanel", "layout");
  }

  async function deleteMessage(formData: FormData) {
    "use server";
    const admin = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.contactMessage.delete({ where: { id } });
    await logAction(admin.id, "Message deleted", "ContactMessage", id);
    revalidatePath("/adminpanel", "layout");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Inbox</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Contact messages</h2>
        <p className="mt-2 text-sm text-text">{unreadTotal} unread</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {[
            { href: "/adminpanel/messages", label: "All", active: !onlyUnread },
            { href: "/adminpanel/messages?filter=unread", label: "Unread", active: onlyUnread },
          ].map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wide transition ${
                t.active ? "bg-primary text-white" : "bg-background-field text-text hover:text-primary"
              }`}
            >
              {t.label}
            </Link>
          ))}
          {unreadTotal > 0 && (
            <form action={markAllRead} className="ml-auto">
              <SubmitButton
                pendingText="Working…"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[12px] font-bold text-dark transition hover:border-primary hover:text-primary"
              >
                <CheckCheck className="h-4 w-4" /> Mark all read
              </SubmitButton>
            </form>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-[20px] border bg-white p-6 shadow-sm ${m.isRead ? "border-border" : "border-primary/40"}`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="font-heading text-xl text-dark">
                  {m.name}
                  {!m.isRead && (
                    <span className="ml-3 rounded-full bg-primary px-2.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wide text-white">
                      New
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm text-lighter">
                  <a href={`mailto:${m.email}`} className="text-primary hover:underline">
                    {m.email}
                  </a>
                  {m.phone ? ` · ${m.phone}` : ""}
                  {m.topic ? ` · ${m.topic}` : ""}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text">{m.message}</p>
                <p className="mt-3 text-xs text-lighter">{m.createdAt.toLocaleString()}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <form action={toggleRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="isRead" value={String(!m.isRead)} />
                  <SubmitButton
                    pendingText="…"
                    className="w-full rounded-xl border border-border px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-dark transition hover:border-primary hover:text-primary"
                  >
                    Mark as {m.isRead ? "unread" : "read"}
                  </SubmitButton>
                </form>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to Boxora")}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-[12px] font-bold text-dark transition hover:border-primary hover:text-primary"
                  >
                    <Mail className="h-4 w-4" /> Reply
                  </a>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <ConfirmButton className="rounded-xl border border-red-200 px-3 py-2.5 text-red-600 transition hover:bg-red-50">
                      <Trash2 className="h-4 w-4" aria-label="Delete message" />
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="rounded-[20px] border border-dashed border-border bg-white px-4 py-12 text-center text-sm text-lighter">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
