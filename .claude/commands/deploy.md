Deploy all changes to GitHub.

Steps:
1. Run `git status` to see all changed, staged, and untracked files (never use `-uall` flag).
2. Run `git diff` to review staged and unstaged changes.
3. Run `git log --oneline -5` to see recent commit message style.
4. If there are no changes to commit, inform the user and stop.
5. Stage all relevant files (avoid staging `.env*`, credentials, or secrets).
6. Write a concise commit message summarizing the changes — lead with a conventional commit prefix (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, etc.). End with `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`.
7. Commit the changes.
8. Push to the remote (`git push origin main`).
9. Confirm success with the commit hash and a one-line summary.
