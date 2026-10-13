import { hashPasswordScrypt, requireAdmin, revokeOtherAdminSessions, sessionSecretProblem, verifyPasswordScrypt } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { allow } from "@/lib/leads/rateLimit";
import { redirect } from "next/navigation";

const input =
  "w-full min-h-[48px] rounded-xl border border-border bg-white px-4 py-3 text-[16px] text-dark outline-none transition placeholder:text-lighter focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm";

const messages: Record<string, { ok: boolean; text: string }> = {
  done: { ok: true, text: "Password updated. Your other sessions were signed out." },
  current: { ok: false, text: "Your current password is not correct." },
  short: { ok: false, text: "The new password must be at least 12 characters." },
  weak: { ok: false, text: "Use a mix of letters and numbers, and do not include your email name." },
  match: { ok: false, text: "The new passwords do not match." },
  limit: { ok: false, text: "Too many attempts. Please wait a few minutes." },
};

export default async function AdminSecurityPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const admin = await requireAdmin();
  const { status } = await searchParams;
  const message = status ? messages[status] : undefined;
  const secretProblem = sessionSecretProblem();

  async function changePassword(formData: FormData) {
    "use server";
    const user = await requireAdmin();
    if (!allow(`admin-pw:${user.id}`, 6, 15 * 60 * 1000)) redirect("/adminpanel/security?status=limit");

    const current = String(formData.get("current") ?? "");
    const next = String(formData.get("next") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (!verifyPasswordScrypt(current, user.passwordHash)) redirect("/adminpanel/security?status=current");
    if (next.length < 12) redirect("/adminpanel/security?status=short");
    const emailName = user.email.split("@")[0].toLowerCase();
    if (!/[a-z]/i.test(next) || !/\d/.test(next) || (emailName.length > 2 && next.toLowerCase().includes(emailName))) {
      redirect("/adminpanel/security?status=weak");
    }
    if (next !== confirm) redirect("/adminpanel/security?status=match");

    await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash: hashPasswordScrypt(next) } });
    await revokeOtherAdminSessions(user.id);
    await prisma.auditLog.create({
      data: { userId: user.id, action: "admin.password_change", entityType: "AdminUser", entityId: user.id },
    });
    redirect("/adminpanel/security?status=done");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Account</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Security</h2>
        <p className="mt-2 text-sm text-text">Signed in as {admin.email}</p>
      </div>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <h3 className="font-heading text-2xl text-dark">Change password</h3>
        <p className="mt-1 text-sm text-text">Use at least 12 characters with letters and numbers.</p>

        {message && (
          <p
            role="status"
            className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${
              message.ok ? "bg-emerald-50 text-emerald-700" : "bg-secondary/10 text-secondary"
            }`}
          >
            {message.text}
          </p>
        )}

        <form action={changePassword} className="mt-5 grid max-w-xl gap-4">
          <input name="current" type="password" required autoComplete="current-password" placeholder="Current password" className={input} />
          <input name="next" type="password" required minLength={12} autoComplete="new-password" placeholder="New password (12+ characters)" className={input} />
          <input name="confirm" type="password" required minLength={12} autoComplete="new-password" placeholder="Repeat new password" className={input} />
          <button
            type="submit"
            className="btn-slip w-fit rounded-xl bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white"
          >
            Update password
          </button>
        </form>
      </div>

      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <h3 className="font-heading text-2xl text-dark">Server settings</h3>
        <ul className="mt-3 space-y-2 text-sm">
          <li className={secretProblem ? "text-secondary" : "text-emerald-700"}>
            {secretProblem
              ? `${secretProblem} Set ADMIN_SESSION_SECRET in your .env to a long random value (for example: openssl rand -hex 32), then restart the server.`
              : "Session secret looks strong."}
          </li>
          <li className="text-text">Login attempts are limited to protect against password guessing.</li>
        </ul>
      </div>
    </div>
  );
}
