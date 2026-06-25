# himage — Photo Sharing Platform

Share and organize photos with family and friends. Invite-only albums with playful design.
Beautiful, engaging experience for capturing and reliving moments together.
Next.js 14 App Router, TypeScript, PostgreSQL (Prisma), NextAuth v5, Tailwind.

## Commands

npm run dev                              # dev server
npm test                                 # jest
npm run lint && npx tsc --noEmit         # lint + typecheck
npx prisma migrate dev --name <name>     # migration

## Key Files

- `src/lib/jwt.ts` — Token validation with hifamily (RS256)
- `src/middleware.ts` — Route protection, redirect to hifamily login
- `src/lib/hifamily-client.ts` — Cross-platform auth integration
- `prisma/schema.prisma` — Shared database with Album, Photo, AlbumAccess models

## Critical Rules

IMPORTANT: Auth redirects to hifamily — no local login here
IMPORTANT: JWT tokens validated against hifamily/api/auth/validate
IMPORTANT: Never edit applied Prisma migrations — create new ones.
IMPORTANT: Use Prisma singleton from `src/lib/prisma.ts`.

## Brand

Sentiment: Playful, joyful, celebratory
Primary: `#4A6FA5` (slate blue) · Accent: `#E5A572` (warm gold)
Fonts: Fraunces (serif display) + Plus Jakarta Sans (UI sans)

## Workflow

- Push directly to main for Phase 1 (no branch/PR needed)
