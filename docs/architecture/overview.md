# Architecture Overview

ภาพรวมสถาปัตยกรรมของระบบ PM IoT ทั้งหมด

Complete architecture overview of the PM IoT System.

## 🏛️ System Architecture

ระบบ PM IoT ใช้ Clean Architecture ร่วมกับ Domain-Driven Design (DDD) เพื่อแยกส่วนต่างๆ ของระบบออกจากกันอย่างชัดเจน

The PM IoT System uses Clean Architecture with Domain-Driven Design (DDD) to separate concerns clearly.

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Flutter Mobile App]
        B[BLoC State Management]
        C[UI Components]
    end

    subgraph "API Layer"
        D[Fiber HTTP Server]
        E[JWT Middleware]
        F[API Handlers]
    end

    subgraph "Application Layer"
        G[Use Cases]
        H[Business Logic]
    end

    subgraph "Domain Layer"
        I[Entities]
        J[Repository Interfaces]
        K[Business Rules]
    end

    subgraph "Infrastructure Layer"
        L[GORM Repositories]
        M[MQTT Handlers]
        N[PostgreSQL DB]
    end

    A --> D
    B --> G
    C --> I
    D --> E
    E --> F
    F --> G
    G --> I
    G --> J
    J --> L
    L --> N
    D --> M
    M --> M
```

## 📁 Project Structure

```
project-management-iot/
├── PM_Mobile_Frontend/              # Flutter Mobile Application
│   └── lib/
│       ├── main.dart
│       ├── data/                    # Repositories
│       └── features/                # Feature modules
│           ├── auth/               # Authentication
│           ├── home/               # Home screen
│           ├── device/             # Device management
│           └── room/               # Room management
│
├── project-management-backend/       # Go Backend API
│   └── cmd/app/                     # Application entry
│       ├── main.go
│       ├── router.go
│       └── wire.go                 # Dependency injection
│   └── internal/
│       ├── auth/                   # Authentication
│       ├── core/
│       │   ├── domain/             # Domain models
│       │   └── usecase/            # Business logic
│       ├── infrastructure/
│       │   ├── gorm/               # Data access
│       │   ├── http/               # API handlers
│       │   └── mqtt/               # MQTT handlers
│       └── middleware/             # HTTP middleware
│
└── docs/                           # Documentation
```

## 🎯 Design Principles

### 1. Separation of Concerns

แต่ละ layer มีความรับผิดชอบที่ชัดเจน:

Each layer has clear responsibilities:

- **Presentation Layer**: UI and user interaction
- **Application Layer**: Business logic and use cases
- **Domain Layer**: Core business rules and entities
- **Infrastructure Layer**: External dependencies

### 2. Dependency Inversion

Dependencies point inward:

```mermaid
graph LR
    A[Infrastructure] --> B[Application]
    B --> C[Domain]
    D[Presentation] --> B
```

High-level modules don't depend on low-level modules. Both depend on abstractions.

### 3. Single Responsibility

Each component has one reason to change:

- `AuthBloc` - Authentication state only
- `DeviceRepository` - Device data access only
- `DeviceUsecase` - Device business logic only

## 🔷 Clean Architecture Layers

### Domain Layer (`internal/core/domain/`)

**Purpose**: Core business logic and entities

**Contains**:
- Entities: User, Device, Room, Widget, Capability, Log
- Repository interfaces
- Value objects
- Domain services

**Example**:
```go
// Domain Entity
type Device struct {
    DeviceID      string
    DeviceName    string
    DeviceType    string
    LastHeartbeat time.Time
}

// Repository Interface
type DeviceRepository interface {
    CreateDevice(device *Device) error
    GetByID(id string) (*Device, error)
}
```

### Use Case Layer (`internal/core/usecase/`)

**Purpose**: Application business logic

**Contains**:
- Application use cases
- Business rules orchestration
- Transaction management

**Example**:
```go
type DeviceUsecase interface {
    RegisterDevice(device *Device) error
    PairDevice(id string, roomID uint) error
    UpdateHeartbeat(id string) error
}
```

### Infrastructure Layer (`internal/infrastructure/`)

**Purpose**: External concerns implementation

**Contains**:
- Repository implementations (GORM)
- MQTT handlers
- HTTP handlers
- Database connections

**Example**:
```go
type DeviceRepository struct {
    db *gorm.DB
}

func (r *DeviceRepository) CreateDevice(device *Device) error {
    return r.db.Create(device).Error
}
```

### Application Layer (`cmd/app/`)

**Purpose**: Application bootstrapping

**Contains**:
- `main.go` - Entry point
- `router.go` - HTTP routes
- `wire.go` - Dependency injection

## 📱 Frontend Architecture

### BLoC Pattern

```mermaid
graph LR
    A[UI Events] --> B[Events]
    B --> C[BLoC]
    C --> D[Repositories]
    D --> E[API]
    E --> F[States]
    F --> G[UI Updates]
```

**Key Components**:
- **Events**: User interactions (WidgetToggled, ValueChanged)
- **States**: UI representation (Loading, Loaded, Error)
- **BLoC**: Business logic & state transformation
- **Repositories**: Data access layer

### Feature-Based Structure

```
lib/features/
├── auth/
│   ├── bloc/           # AuthBloc, events, states
│   ├── data/           # AuthRepository, AuthApi
│   └── ui/             # SignInPage, widgets
├── home/
│   ├── bloc/           # DevicesBloc, events, states
│   ├── data/           # WidgetRepository
│   └── ui/             # HomePage, widgets
├── device/
│   └── ...             # Device management
└── room/
    └── ...             # Room management
```

## 🔗 Key Flows

### Request Flow

```mermaid
sequenceDiagram
    participant UI as Flutter UI
    participant BLoC as DevicesBloc
    participant Repo as Repository
    participant API as Backend API
    participant UC as Use Case
    participant DB as Database

    UI->>BLoC: WidgetToggled event
    BLoC->>Repo: updateWidget()
    Repo->>API: POST /api/widgets/:id/command
    API->>UC: ExecuteCommand
    UC->>DB: Update widget
    UC->>MQTT: Publish command
    DB-->>API: Success
    API-->>Repo: Response
    Repo-->>BLoC: Result
    BLoC->>BLoC: Emit new state
    BLoC-->>UI: State update
```

### Data Flow

```mermaid
graph LR
    A[IoT Device] -->|MQTT| B[Backend]
    B -->|PostgreSQL| C[(Database)]
    D[Flutter App] -->|REST API| B
    B -->|REST API| D
    D -->|Firebase Auth| E[Firebase]
```

## 🎨 Technology Stack

### Frontend

| Component | Technology |
|-----------|-----------|
| **Framework** | Flutter 3.7+ |
| **Language** | Dart 3.7+ |
| **State Management** | BLoC (flutter_bloc) |
| **Authentication** | Firebase Auth |
| **Local Storage** | Flutter Secure Storage |
| **UI** | Material Design 3 |

### Backend

| Component | Technology |
|-----------|-----------|
| **Framework** | Fiber 2.52+ |
| **Language** | Go 1.25+ |
| **Database** | PostgreSQL 13+ |
| **ORM** | GORM 1.31+ |
| **MQTT** | Paho MQTT 1.5+ |
| **DI** | Wire 0.7+ |
| **Auth** | JWT (golang-jwt/jwt) |

## 🔐 Security Architecture

```mermaid
graph TB
    A[Flutter App] -->|1. Google Sign-In| B[Firebase Auth]
    B -->|2. ID Token| C[Backend API]
    C -->|3. Verify & Generate JWT| D[JWT Service]
    D -->|4. JWT Token| A
    A -->|5. JWT in Header| E[Protected Routes]
    E -->|6. Validate JWT| F[JWT Middleware]
    F -->|7. Allow/Deny| G[API Handlers]
```

## 📊 Scalability Considerations

### Horizontal Scaling

- **Stateless API servers** (can add more instances)
- **Load balancer** in front of API servers
- **Database connection pooling**
- **MQTT broker clustering**

### Vertical Scaling

- **Increase database resources**
- **Cache frequently accessed data**
- **Optimize database queries**
- **Add database indexes**

---

**Next**: [Data Flows](./data-flows) →
