---
paths:
  - "prisma/**"
  - "src/lib/prisma.ts"
---
# Database Rules
- Always create new migrations, never edit existing ones
- Use `npx prisma migrate dev --name <descriptive-name>`
- Amounts: `amountCents Int` (integer cents, not Float/Decimal)
- Cascade rules matter: User deletion cascades to all owned data
- Use singleton from `src/lib/prisma.ts`
