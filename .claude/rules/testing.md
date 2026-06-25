---
paths:
  - "src/**/*.test.ts"
  - "jest.config.*"
---
# Testing
- Jest with ts-jest
- Prefer single file: `npm test -- path/to/file.test.ts`
- Don't run full suite unless asked — it's slow
- Test files mirror source: `src/foo.ts` → `src/__tests__/foo.test.ts`
