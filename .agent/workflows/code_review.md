---
description: Mandatory Code Review Workflow
---

# Senior Team Lead Code Review

// turbo-all

This workflow is triggered when a Developer completes a task.

1.  **Context Check**: Review `task.md` and `implementation_plan.md` to understand the goal.
2.  **TDD Audit**:
    - Verify tests were created **before** implementation files.
    - Check for Happy, Sad, and Edge case tests for EVERY new/updated function.
    - Run `npm test` to ensure 100% pass rate.
3.  **Standards Audit**:
    - Check against `docs/standards.md` (SOLID, Clean Code).
    - Check against `docs/design_patterns.md`.
    - Check against `docs/guardrails.md` (Security, Error handling).
4.  **Sanity Check**: Run `npm run sanity`.
5.  **UI/UX Aesthetic Audit (If UI change)**:
    - **UI/UX Designer** must evaluate the layout and aesthetics.
    - Confirm premium look (glassmorphism, vibrant colors, dynamic animations).
    - Use `browser_subagent` to navigate to the affected pages.
    - Confirm no Build Error overlays or console errors.
    - Capture a recording to document visual integrity and "alive" feel.
6.  **Feedback**:
    - If issues found: Provide specific instructions to the Developer and return to Step 4 of TDD Workflow.
    - If approved: Document approval in the task status and notify the User.
