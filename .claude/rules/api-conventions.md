---
paths:
  - "src/app/api/**"
---
# API Conventions
- Every route: validate with Zod, check session with `await auth()`
- Ownership check on PATCH/DELETE: verify `resource.userId === session.user.id`
- Return 401 for no session, 404 for not found/not owned, 409 for duplicates
- Amount fields: accept decimal string input, store as cents, return as decimal string
