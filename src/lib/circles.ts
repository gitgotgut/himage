import { prisma } from "@/lib/prisma";

// Circles live in the shared DB (owned by hifamily). Read membership via raw
// SQL so this app needs no local Circle Prisma model.

export async function getMyCircleIds(userId: string): Promise<string[]> {
  const rows = await prisma.$queryRaw<{ circleId: string }[]>`
    SELECT "circleId" FROM "CircleMember" WHERE "userId" = ${userId}`;
  return rows.map((r) => r.circleId);
}

export async function isCircleMember(
  circleId: string,
  userId: string
): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ one: number }[]>`
    SELECT 1 AS one FROM "CircleMember"
    WHERE "circleId" = ${circleId} AND "userId" = ${userId} LIMIT 1`;
  return rows.length > 0;
}

// Circles the user belongs to, for share pickers.
export async function getMyCircles(
  userId: string
): Promise<{ id: string; name: string }[]> {
  return prisma.$queryRaw<{ id: string; name: string }[]>`
    SELECT c."id", c."name" FROM "Circle" c
    JOIN "CircleMember" m ON m."circleId" = c."id"
    WHERE m."userId" = ${userId}
    ORDER BY c."createdAt" ASC`;
}
