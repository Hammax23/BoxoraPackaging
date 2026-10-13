import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin, sessionSecretProblem, verifyPasswordScrypt } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { Shield, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  const [newQuotes, unreadMessages] = await Promise.all([
    prisma.quoteRequest.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  // Security warnings shown on every admin page until fixed.
  const warnings: string[] = [];
  const secretProblem = sessionSecretProblem();
  if (secretProblem) warnings.push(secretProblem);
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envPassword && verifyPasswordScrypt(envPassword, admin.passwordHash)) {
    warnings.push(
      envPassword.length < 12
        ? "Your admin password is still the short one from .env. Change it to something stronger."
        : "Your admin password is still the one stored in .env. Change it on the Security page.",
    );
  }

  return (
    <div className="min-h-screen bg-background-field/40">
      {warnings.length > 0 && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
            <span className="inline-flex items-center gap-2 font-bold">
              <ShieldAlert className="h-4 w-4 shrink-0" /> Security attention needed
            </span>
            <span className="min-w-0 break-words sm:flex-1">{warnings.join(" · ")}</span>
            <Link href="/adminpanel/security" className="font-bold underline">
              Fix now
            </Link>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[264px_1fr] md:gap-8 md:px-6 md:py-8">
        <aside className="rounded-[28px] border border-border bg-white p-5 shadow-sm md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:self-start md:overflow-y-auto md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Boxora</p>
              <h1 className="mt-1 font-heading text-xl text-dark">Admin Panel</h1>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-5 w-5 text-primary" strokeWidth={2} />
            </span>
          </div>
          <p className="mt-3 truncate rounded-xl bg-background-field/70 px-3 py-2 text-[12px] text-text" title={admin.email}>
            Signed in as <span className="font-semibold text-dark">{admin.email}</span>
          </p>

          <AdminNav newQuotes={newQuotes} unreadMessages={unreadMessages} />
        </aside>

        <main className="min-w-0 [&_.grid>*]:min-w-0 [&_form]:min-w-0">{children}</main>
      </div>
    </div>
  );
}
