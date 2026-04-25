# TDD Workflow (Non-Negotiable)

This workflow must be followed for EVERY code change.

1.  **Identify Requirement**: PM identifies the function or method to be created/updated.
2.  **Define Interface**: Architect/Developer defines the function signature and expected behavior.
3.  **Write Tests (RED)**:
    - Write test for **Happy Path**.
    - Write test for **Sad Path** (errors/invalid input).
    - Write tests for **Edge Cases**.
    - Verify tests fail (or file doesn't exist).
4.  **Implement (GREEN)**:
    - Write the minimum amount of code to make all tests pass.
    - **Do NOT** write extra features yet.
5.  **Refactor (BLUE)**:
    - Clean up the code.
    - Ensure it follows SOLID and Clean Code principles.
    - Ensure tests still pass.
6.  **Verify**: Run the full test suite and sanity checks.
7.  **Senior Review**: Submit to the Senior Team Lead for audit.
