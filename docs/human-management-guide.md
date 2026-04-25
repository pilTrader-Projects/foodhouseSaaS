# Human-in-the-Loop: Managing Your Agentic Team

As the human orchestrator, your role is to provide vision, resolve high-level conflicts, and perform final sanity gates. This guide explains how to manage your agentic team effectively.

## 1. Initializing Work
When starting a new feature or project:
1.  **Draft the Vision**: Provide a high-level goal to the **Product Manager (PM)**.
2.  **Request a Plan**: Ask the **Architect** to draft an `implementation_plan.md`.
3.  **Review the Plan**: DO NOT allow implementation to start until you have approved the plan. Look for:
    - Consistency with existing patterns.
    - Security implications.
    - Complexity concerns.

## 2. Delegating Tasks
- **Granularity**: Keep tasks small. If a task takes an agent more than 10-15 tool calls, it's too large. Ask the PM to break it down.
- **Explicit Instruction**: If you have a specific implementation preference (e.g., "Use this specific library"), tell the Architect before the plan is finalized.

## 3. Intervention Strategies
Sometimes agents may get stuck or lose context.
- **Context Refresh**: If an agent seems confused, ask the PM to update the `TaskSummary` and `task.md` to reflect the current state.
- **Direct Correction**: If a Developer makes a logic error that the Senior Lead misses, point it out explicitly: *"Hey Senior Lead, আপনি missed this edge case in function X. Please have the Developer fix it."*
- **SOP Override**: If a rule in `docs/standards.md` is preventing progress on a unique edge case, you can grant a temporary exception.

## 4. Handling Agent Conflict
If the Architect and Developer disagree:
1.  Read their reasoning in the conversation.
2.  Review the `docs/design_patterns.md`.
3.  Provide a tie-breaking decision.

## 5. Final Approval Gate
Even after the **Senior Team Lead** approves a task:
- Review the `walkthrough.md` provided by the QA Engineer.
- Run the code locally if possible.
- Check that the UI (if any) matches your aesthetic expectations.

## 6. Training & Feedback
If your agents consistently make the same mistake:
- Update `docs/standards.md` or `docs/guardrails.md` with a new rule to prevent that mistake in the future. The environment "learns" through documentation updates.
