# Clean Architecture

Clean Architecture implementation in Go backend.

## Layer Structure
```
Domain Layer (Entities & Interfaces)
    ↓
Use Case Layer (Business Logic)
    ↓
Infrastructure Layer (Implementations)
    ↓
Application Layer (Entry Points)
```

## Key Principles
- Dependencies point inward
- Framework-independent
- Testable business logic

---

**Previous**: [Backend Intro](./intro) | **Next**: [Domain Layer](./domain-layer) →
