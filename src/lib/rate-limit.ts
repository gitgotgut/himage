import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Fixed-window rate limiter backed by the shared Postgres `RateLimit` table.
 * Works in any app via raw SQL (no Prisma model needed locally). Returns true
 * if the action is still under the limit for the current window.
 *
 * Times use `now() AT TIME ZONE 'UTC'` to stay consistent with Prisma's
 * tz-naive UTC timestamp storage.
 */
export async function rateLimit(
  action: string,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const key = `${action}:${identifier}`;
  const id = randomUUID();
  try {
    const rows = await prisma.$queryRaw<{ count: number }[]>`
      INSERT INTO "RateLimit" ("id", "key", "count", "expiresAt")
      VALUES (${id}, ${key}, 1, (now() AT TIME ZONE 'UTC') + (${windowSeconds} * interval '1 second'))
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE WHEN "RateLimit"."expiresAt" < (now() AT TIME ZONE 'UTC') THEN 1 ELSE "RateLimit"."count" + 1 END,
        "expiresAt" = CASE WHEN "RateLimit"."expiresAt" < (now() AT TIME ZONE 'UTC') THEN (now() AT TIME ZONE 'UTC') + (${windowSeconds} * interval '1 second') ELSE "RateLimit"."expiresAt" END
      RETURNING "count"`;
    const count = Number(rows[0]?.count ?? 1);
    return count <= limit;
  } catch {
    // Fail open: never block legitimate traffic if the limiter errors.
    return true;
  }
}

// Best-effort client IP from proxy headers.
export function ipFrom(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  const first = xff ? xff.split(",")[0] : "";
  return first.trim() || req.headers.get("x-real-ip") || "unknown";
}
