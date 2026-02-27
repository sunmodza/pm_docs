# Backend Project Structure

Go backend directory organization following Clean Architecture.

## Directory Layout

```
project-management-backend/
├── cmd/
│   └── app/                         # Application entry point
│       ├── main.go                  # Bootstrap and server initialization
│       ├── router.go                # HTTP route configuration
│       ├── wire.go                  # Wire dependency injection setup
│       └── wire_gen.go              # Generated wire code
│
├── internal/
│   ├── auth/                        # Authentication package
│   │   ├── handler.go               # Auth HTTP handlers (login, register)
│   │   ├── service.go               # Auth business logic (JWT, bcrypt)
│   │   ├── repository.go            # User database operations
│   │   ├── model.go                 # UserAccount model
│   │   └── provider.go              # Wire provider
│   │
│   ├── core/                        # Core business logic
│   │   ├── domain/                  # Domain layer (entities, interfaces)
│   │   │   ├── device.go            # Device entity and repository interface
│   │   │   ├── widget.go            # Widget and Log entities
│   │   │   ├── room.go              # Room entity
│   │   │   ├── user.go              # User entity and UserRole
│   │   │   └── capability.go        # Capability entity
│   │   │
│   │   └── usecase/                 # Use case layer (business logic)
│   │       ├── device_usecase.go           # Device operations
│   │       ├── widget_usecase.go           # Widget operations
│   │       ├── room_usecase.go             # Room operations
│   │       ├── record_log_usecase.go       # Sensor data logging
│   │       ├── device_command_usecase.go   # Device commands
│   │       ├── capability_usecase.go       # Capability operations
│   │       └── device_capability_map.go    # Device type to capability mapping
│   │
│   ├── database/                    # Database connection
│   │   └── database.go              # GORM connection setup
│   │
│   ├── infrastructure/              # Infrastructure layer
│   │   ├── gorm/                    # GORM repository implementations
│   │   │   ├── device_repo.go       # Device repository
│   │   │   ├── widget_repo.go       # Widget repository
│   │   │   ├── room_repo.go         # Room repository
│   │   │   ├── user_repo.go         # User repository
│   │   │   ├── capability_repo.go   # Capability repository
│   │   │   ├── recorder_repo.go     # Log repository
│   │   │   └── seeder.go            # Database seeder
│   │   │
│   │   ├── http/                    # HTTP handlers
│   │   │   ├── device_handler.go    # Device API endpoints
│   │   │   ├── widget_handler.go    # Widget API endpoints
│   │   │   ├── room_handler.go      # Room API endpoints
│   │   │   ├── user_handler.go      # User API endpoints
│   │   │   └── command_handler.go   # Command API endpoints
│   │   │
│   │   └── mqtt/                    # MQTT client and handlers
│   │       ├── device_handler.go    # Device registration handler
│   │       ├── sensor_handler.go    # Sensor data handler
│   │       ├── sensor_subscriber.go # MQTT subscription setup
│   │       ├── device_commander.go  # Command publisher
│   │       └── pair_commander.go    # Device pairing commander
│   │
│   └── middleware/                  # HTTP middleware
│       └── jwt_middleware.go        # JWT authentication middleware
│
├── go.mod                           # Go module definition
└── go.sum                           # Go module checksums
```

## Key Files

### cmd/app/main.go
Application bootstrap and server initialization. Sets up database connection, MQTT client, and starts the HTTP server.

### cmd/app/router.go
HTTP route configuration. Defines all API endpoints and their handlers.

### cmd/app/wire.go
Wire dependency injection configuration. Defines provider sets and bindings for dependency injection.

### internal/core/domain/
Domain entities and repository interfaces. This is the innermost layer of Clean Architecture.

### internal/core/usecase/
Business logic implementation. Use cases orchestrate repository calls and implement business rules.

### internal/infrastructure/gorm/
Repository implementations using GORM. These implement the interfaces defined in the domain layer.

### internal/infrastructure/http/
HTTP handlers (controllers). Handle HTTP requests and responses.

### internal/infrastructure/mqtt/
MQTT client and message handlers. Handle device communication via MQTT.

## Dependency Flow

```
HTTP/MQTT Handlers (infrastructure)
    ↓
Use Cases (core)
    ↓
Repository Interfaces (domain)
    ↑
Repository Implementations (infrastructure/gorm)
    ↓
Database (PostgreSQL)
```

## Clean Architecture Layers

1. **Domain Layer** (`internal/core/domain/`)
   - Entities: Device, Widget, Room, User, Capability, Log
   - Repository interfaces
   - Business rules

2. **Use Case Layer** (`internal/core/usecase/`)
   - Application business logic
   - Orchestrates repository calls
   - DeviceUsecase, WidgetUsecase, RoomUsecase, etc.

3. **Infrastructure Layer** (`internal/infrastructure/`)
   - Repository implementations (GORM)
   - HTTP handlers
   - MQTT handlers

4. **Application Layer** (`cmd/app/`)
   - Main application entry
   - Wire dependency injection
   - Router configuration

---

**Previous**: [Intro](./intro) | **Next**: [Domain Layer](./domain-layer) →
