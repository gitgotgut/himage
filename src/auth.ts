import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

/**
 * himage has no local login. Sessions are established only via the hifamily
 * SSO hand-off: the `/sso/callback` page receives a single-use code, this "sso"
 * provider atomically consumes it from the shared `SsoCode` table, and NextAuth
 * then issues a normal local session cookie. No token ever rides in a URL.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "sso",
      name: "hifamily SSO",
      credentials: {
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const code = credentials?.code;
        if (typeof code !== "string" || !code) return null;

        // Atomically consume the single-use, unexpired code.
        const rows = await prisma.$queryRaw<{ userId: string }[]>`
          UPDATE "SsoCode" SET "usedAt" = (now() AT TIME ZONE 'UTC')
          WHERE "code" = ${code}
            AND "usedAt" IS NULL
            AND "expiresAt" > (now() AT TIME ZONE 'UTC')
          RETURNING "userId"`;
        const userId = rows[0]?.userId;
        if (!userId) return null;

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, displayName: true },
        });
        if (!user) return null;

        return { id: user.id, email: user.email, name: user.displayName ?? null };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.email) session.user.email = token.email as string;
      return session;
    },
  },
});
