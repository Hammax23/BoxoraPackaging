import { requireAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { History } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  await requireAdmin();
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { email: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm md:p-8">
        <p className="section-label text-primary">Account</p>
        <h2 className="mt-4 font-heading text-3xl text-dark">Activity log</h2>
        <p className="mt-2 text-sm text-text">The last 200 actions taken in the admin panel.</p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-border bg-white shadow-sm">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center text-text">
            <History className="h-8 w-8 text-lighter" />
            <p>No activity recorded yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {logs.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-2 px-6 py-3.5 text-sm">
                <div className="min-w-0">
                  <span className="font-semibold text-dark">{l.action}</span>
                  {l.entityType && (
                    <span className="ml-2 rounded-full bg-background-field px-2 py-0.5 text-[11px] font-semibold text-text">
                      {l.entityType}
                    </span>
                  )}
                  <p className="truncate text-xs text-lighter">{l.user?.email ?? "system"}</p>
                </div>
                <time className="text-xs text-lighter" dateTime={l.createdAt.toISOString()}>
                  {l.createdAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
