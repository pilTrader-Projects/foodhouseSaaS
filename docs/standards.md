# Coding Standards & TDD Policy

## Non-Negotiable TDD
Every function, method, or class created, refactored, or updated MUST be covered by unit tests.

### Test-First Requirement
- **Tests MUST be written before writing a single line of implementation code.**
- This applies to new features, bug fixes, and refactoring.
- If a function `A` is refactored into `a`, `b`, and `c`, unit tests for `a`, `b`, and `c` must be created first.

### Path Coverage
Unit tests must cover:
1. **Happy Paths**: Standard successful execution.
2. **Sad Paths**: Expected error conditions and failures.
3. **Edge Cases**: Boundary conditions, null/undefined inputs, extreme values.

## Clean Code & SOLID
- **S**ingle Responsibility: Each function/class should have one reason to change.
- **O**pen/Closed: Extendable without modifying existing code.
- **L**iskov Substitution: Subtypes must be substitutable for their base types.
- **I**nterface Segregation: Focused, thin interfaces.
- **D**ependency Inversion: Depend on abstractions, not concretions.

## Naming Conventions
- Variables/Functions: `camelCase`
- Classes/Interfaces: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Files: `kebab-case.ts`

## Documentation
- Use JSDoc for all public methods and complex logic.
- Maintain an up-to-date `README.md` and `docs/`.
