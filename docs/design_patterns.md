# Design Patterns

## Repository Pattern
Decouples the domain layer from data access logic.
- **Goal**: Centralize data access and provide a clean API for the rest of the application.
- **Usage**: Use for all database or external API interactions.

## Service Pattern
Encapsulates business logic.
- **Goal**: Keep controllers/agents thin and focus on orchestration.
- **Usage**: Business rules, calculations, and complex multi-step processes.

## Factory Pattern
Aids in object creation.
- **Goal**: Decouple the creation of objects from their usage.
- **Usage**: When creating complex objects with many dependencies.

## Dependency Injection
- **Goal**: Improve testability by allowing mocks to be injected.
- **Usage**: Always inject dependencies via constructors or parameters.

## Functional Programming Prefs
- Favor pure functions when possible.
- Use immutability for state management where applicable.
- Avoid side effects in business logic.
