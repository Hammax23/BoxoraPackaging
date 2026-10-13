const hits = new Map<string, { count: number; resetAt: number }>();

/** Simple in-memory limiter (per server instance). Returns false when the limit is exceeded. */
export function allow(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

// ───── Failure-only counters (used by the admin login) ─────
const failures = new Map<string, { count: number; resetAt: number }>();

/** True when this key already has `limit` or more recent failures. */
export function isLocked(key: string, limit: number) {
  const e = failures.get(key);
  return !!e && e.resetAt > Date.now() && e.count >= limit;
}

export function recordFailure(key: string, windowMs: number) {
  const now = Date.now();
  const e = failures.get(key);
  if (!e || e.resetAt < now) failures.set(key, { count: 1, resetAt: now + windowMs });
  else e.count += 1;
}

export function clearFailures(key: string) {
  failures.delete(key);
}
