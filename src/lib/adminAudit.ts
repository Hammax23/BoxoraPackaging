import { prisma } from "@/lib/db";

/** Records an admin action in the activity log. Never throws (logging must not break an action). */
export async function logAction(
  userId: string | null,
  action: string,
  entityType?: string,
  entityId?: string,
  meta?: Record<string, string | number | boolean | null>,
) {
  try {
    await prisma.auditLog.create({ data: { userId, action, entityType, entityId, meta } });
  } catch (error) {
    console.error("[audit] could not write log:", error);
  }
}
