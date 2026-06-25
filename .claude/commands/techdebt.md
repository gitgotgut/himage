Find and fix technical debt: duplicate code, dead code, and unnecessary complexity.

Steps:
1. Scan the codebase for duplicate or near-duplicate code patterns:
   - Look for repeated logic across API routes (e.g. auth checks, response formatting, error handling).
   - Look for duplicated UI patterns across components.
   - Look for copy-pasted utility functions.
2. Scan for dead code:
   - Unused exports, unused imports, unreachable branches.
   - Functions or components that are defined but never referenced.
3. For each finding, report:
   - **What**: description of the duplication or dead code.
   - **Where**: file paths and line numbers.
   - **Impact**: low / medium / high.
4. Present the findings as a summary table and ask the user which ones to fix.
5. Only after user approval, refactor by:
   - Extracting shared logic into reusable helpers (in `src/lib/`).
   - Removing dead code entirely.
   - Keeping changes minimal — don't refactor beyond what's needed.
6. After changes, run `npx tsc --noEmit` and `npm test` to verify nothing broke.

Important:
- Do NOT delete test files or test utilities.
- Do NOT remove code that looks unused but is dynamically imported (e.g. Next.js page routes, API routes).
- Preserve all public API surface — only remove truly internal dead code.
