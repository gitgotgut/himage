import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyToken } from "@/lib/jwt";

/**
 * hiplan has no local login. Sessions are established only via the hifamily
 * SSO handoff: the `/sso/callback` page receives a short-lived token, this
 * "sso" provider verifies it against the shared JWT_SECRET, and NextAuth then
 * issues a normal local session cookie.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      id: "sso",
      name: "hifamily SSO",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        const token = credentials?.token;
        if (typeof token !== "string") return null;

        const payload = await verifyToken(token);
        if (!payload) return null;

        return {
          id: payload.sub,
          email: payload.email,
          name: payload.displayName ?? null,
        };
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
