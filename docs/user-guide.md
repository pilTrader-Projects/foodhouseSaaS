# User Guide: Agentic Development Environment

This guide explains how to effectively use this boilerplate to orchstrate a team of AI agents for high-quality software development.

## 1. Understanding Agent Personas
Each agent has a specific role defined in [.agent/personas.md](file:///Users/user/dev/projects/nocode/agentic-dev/.agent/personas.md).
- **PM**: Use them to break down requirements and manage [task.md](file:///Users/user/.gemini/antigravity/brain/078a217b-8212-4398-85ad-8efca659051f/task.md).
- **Architect**: Use them to draft the [implementation_plan.md](file:///Users/user/.gemini/antigravity/brain/078a217b-8212-4398-85ad-8efca659051f/implementation_plan.md).
- **Developer**: Use them for strict Red-Green-Refactor implementation.
- **Senior Lead**: Always involve them for final code review before human notification.

## 2. Core Workflows
### Strict TDD (Red-Green-Refactor)
Follow the [tdd_flow.md](file:///Users/user/dev/projects/nocode/agentic-dev/.agent/workflows/tdd_flow.md).
1.  **Red**: Create unit tests first. Ensure they fail.
2.  **Green**: Implement minimum logic to pass tests.
3.  **Refactor**: Improve code quality while maintaining green tests.

### Mandatory Code Review
Before a task is considered "Done", the **Senior Lead** must execute the [code_review.md](file:///Users/user/dev/projects/nocode/agentic-dev/.agent/workflows/code_review.md).
- This ensures that all happy, sad, and edge cases are covered.
- This ensures compliance with [docs/standards.md](file:///Users/user/dev/projects/nocode/agentic-dev/docs/standards.md).

## 3. Best Practices
- **Never Skip Tests**: If a code change is made without a corresponding test update, the Senior Lead *must* reject it.
- **Atomic Commits/Tasks**: Keep tasks granular in `task.md` to help agents stay focused.
- **Context Management**: Ensure the PM updates the `TaskSummary` in the environment to keep all agents aligned.

## 4. Environment Sanity
Regularly run the sanity check to ensure the project structure and dependencies are intact:
```bash
npm run sanity
```

## 5. Security Guardrails
Always check [docs/guardrails.md](file:///Users/user/dev/projects/nocode/agentic-dev/docs/guardrails.md) before implementing external integrations or handling sensitive data.
