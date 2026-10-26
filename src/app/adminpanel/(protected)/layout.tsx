import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin, sessionSecretProblem, verifyPasswordScrypt } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import BrandLogo from "@/components/BrandLogo";
import { ShieldAlert } from "lucide-react";
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
    <div className="min-h-screen bg-background-field">
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

      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[264px_1fr]">
        <aside className="bg-dark p-5 md:sticky md:top-0 md:h-screen md:overflow-y-auto md:p-6">
          <div className="flex items-center justify-between gap-3">
            <BrandLogo variant="light" size="sm" href="/adminpanel" />
            <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-dark">Admin</span>
          </div>
          <p className="mt-4 truncate rounded-xl bg-white/10 px-3 py-2 text-[12px] text-white/70" title={admin.email}>
            Signed in as <span className="font-semibold text-white">{admin.email}</span>
          </p>

          <AdminNav newQuotes={newQuotes} unreadMessages={unreadMessages} />
        </aside>

        <main className="min-w-0 p-4 md:p-8 [&_.grid>*]:min-w-0 [&_form]:min-w-0">{children}</main>
      </div>
    </div>
  );
}
