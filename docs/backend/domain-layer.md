# Domain Layer

The core business logic layer of the backend.

## Purpose

Contains enterprise business rules and is the most inner layer of Clean Architecture.

## Components

### Entities

Core business objects:

```go
type Device struct {
    ID          string
    Name        string
    Type        string
    Capabilities []Capability
}
```

### Repository Interfaces

Defines contracts for data access:

```go
type DeviceRepository interface {
    Create(device *Device) error
    GetByID(id string) (*Device, error)
    List() ([]*Device, error)
    Update(device *Device) error
    Delete(id string) error
}
```

### Use Case Interfaces

Defines business operations:

```go
type DeviceUsecase interface {
    RegisterDevice(device *Device) error
    GetDevice(id string) (*Device, error)
    ControlDevice(id string, command Command) error
}
```

## Principles

- Independent of frameworks
- Independent of UI
- Independent of database
- Independent of external agencies

---

**Previous**: [Clean Architecture](./clean-architecture) | **Next**: [Use Case Layer](./usecase-layer) →
