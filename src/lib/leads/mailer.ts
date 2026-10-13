/**
 * Email notifications for new leads, sent through Resend's HTTP API (no extra dependency).
 * Set RESEND_API_KEY and LEAD_NOTIFY_EMAIL (comma-separated allowed) to turn it on.
 * Optional: MAIL_FROM, e.g. "Boxora <quotes@yourdomain.com>".
 * Without those, leads are still saved to the database and shown in the admin panel.
 */
export async function notifyOwner(opts: { subject: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) {
    console.info("[leads] Email not configured (RESEND_API_KEY / LEAD_NOTIFY_EMAIL); lead saved only.");
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.MAIL_FROM ?? "Boxora <onboarding@resend.dev>",
        to: to.split(",").map((s) => s.trim()).filter(Boolean),
        subject: opts.subject,
        text: opts.text,
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
      }),
    });
    if (!res.ok) console.error("[leads] Email failed:", res.status, await res.text());
  } catch (error) {
    console.error("[leads] Email error:", error);
  }
}
