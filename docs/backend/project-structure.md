# Backend Project Structure

Go backend directory organization.

## Directory Layout

```
project-management-backend/
├── cmd/
│   └── api/
│       └── main.go              # Application entry point
├── internal/
│   ├── domain/                  # Domain layer
│   │   ├── entities.go
│   │   └── repositories.go
│   ├── usecase/                 # Use case layer
│   │   ├── device_usecase.go
│   │   └── room_usecase.go
│   ├── handler/                 # HTTP handlers
│   │   ├── device_handler.go
│   │   └── auth_handler.go
│   ├── repository/              # Repository implementations
│   │   ├── device_repository.go
│   │   └── user_repository.go
│   ├── middleware/              # Middleware
│   │   ├── auth.go
│   │   └── cors.go
│   ├── mqtt/                    # MQTT client
│   │   └── client.go
│   └── models/                  # Database models
│       ├── device.go
│       └── user.go
├── pkg/                         # Public packages
│   └── auth/
│       └── jwt.go
├── wire.go                      # Dependency injection
├── wire_gen.go                  # Generated wire code
├── go.mod
└── go.sum
```

## Key Files

### main.go
Application bootstrap and server initialization

### wire.go
Wire dependency injection setup

### router.go
HTTP route configuration

---

**Previous**: [Intro](./intro) | **Next**: [Domain Layer](./domain-layer) →
