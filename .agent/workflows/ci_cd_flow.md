---
description: CI/CD Workflow
---

# CI/CD Flow

// turbo-all

1.  **Linting**: Run `npm run lint` to check for style violations.
2.  **Unit Tests**: Run `npm test` to verify logic.
3.  **Sanity Test**: Run `npm run sanity` (triggers `tests/sanity_check.ts`).
4.  **Build**: Run `npm run build` to ensure project compiles.
5.  **Audit**: Run `npm audit` for security vulnerabilities.
6.  **Report**: QA Engineer generates a `walkthrough.md` with results.
