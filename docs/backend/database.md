# Database Schema

Complete database schema and relationships based on GORM models.

## Entity Relationships

```mermaid
erDiagram
    Room ||--o{ Device : "contains"
    Device ||--o{ Widget : "has"
    Capability ||--o{ Widget : "defines"
    Widget ||--o{ Log : "records"
```

## Tables

### users

**Note:** The `users` table is used for domain user information, not authentication.
For authentication, see the `user_accounts` table in the auth package.

```go
// internal/core/domain/user.go
type User struct {
    Email string
    Name  string
    Role  UserRole
}

type UserRole string

const (
    RoleAdmin UserRole = "ADMIN"
    RoleUser  UserRole = "USER"
)
```

**Fields**:
- `email` - User's email address
- `name` - User's full name
- `role` - User role (ADMIN, USER)

**Note:** Authentication uses a separate `UserAccount` model:

```go
// internal/auth/model.go
type UserAccount struct {
    ID       uint   `gorm:"primaryKey"`
    Username string `gorm:"unique"`
    Password string
}
```

---

### rooms

**Primary Key**: `id` (uint, auto-increment)

```go
// internal/core/domain/room.go
type Room struct {
    ID      uint
    Name    string
    Devices []DeviceSummary
}
```

```go
// internal/infrastructure/gorm/room_repo.go
type Room struct {
    ID   uint   `gorm:"primaryKey"`
    Name string `gorm:"column:room_name"`
}
```

**Fields**:
- `id` (PK) - Auto-increment ID
- `room_name` - Room name

**Relationships**:
- Has many Devices (CASCADE on update, SET NULL on delete)

---

### devices

**Primary Key**: `device_id` (string, no auto-increment)

```go
// internal/core/domain/device.go
type Device struct {
    DeviceID      string
    DeviceName    string
    DeviceType    string
    LastHeartbeat time.Time
    Widgets       []Widget
}
```

```go
// internal/infrastructure/gorm/device_repo.go
type Device struct {
    DeviceID      string `gorm:"primaryKey;autoIncrement:false"`
    DeviceName    string
    DeviceType    string
    RoomID        *uint
    Room          *Room `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
    LastHeartbeat time.Time
    Widgets       []Widget `gorm:"foreignKey:DeviceID"`
}
```

**Fields**:
- `device_id` (PK) - Unique device identifier (string, e.g., "ESP32-12345678")
- `device_name` - Device name
- `device_type` - Device type (e.g., "smart_switch")
- `room_id` (FK, nullable) - Room ID
- `last_heartbeat` - Timestamp of last heartbeat

**Relationships**:
- Belongs to Room (optional)
- Has many Widgets

---

### capabilities

**Primary Key**: `id` (uint, auto-increment via gorm.Model)

```go
// internal/core/domain/capability.go
type Capability struct {
    ID             uint
    CapabilityType string
    ControlType    string
    Widgets        []Widget
}
```

```go
// internal/infrastructure/gorm/capability_repo.go
type Capability struct {
    gorm.Model
    CapabilityType string
    ControlType    string
    Widgets        []Widget `gorm:"foreignKey:CapabilityID"`
}
```

**gorm.Model includes**:
- `id` (PK) - Auto-increment
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `deleted_at` - Soft delete timestamp

**Fields**:
- `capability_type` - Type (e.g., "power", "temperature", "status")
- `control_type` - Control type (e.g., "toggle", "sensor", "heartbeat")

**Relationships**:
- Has many Widgets

---

### widgets

**Primary Key**: `id` (uint, auto-increment via gorm.Model)

```go
// internal/core/domain/widget.go
type Widget struct {
    ID           uint
    WidgetOrder  uint
    WidgetStatus string
    Value        string
    DeviceID     string
    CapabilityID uint
    Device       *Device
    Capability   *Capability
}
```

```go
// internal/infrastructure/gorm/widget_repo.go
type Widget struct {
    gorm.Model
    WidgetStatus string
    Value        string
    WidgetOrder  uint       `gorm:"column:widget_order"`
    CapabilityID uint       `gorm:"not null"`
    Capability   Capability `gorm:"foreignKey:CapabilityID;references:ID"`
    DeviceID     string     `gorm:"not null"`
    Device       Device     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
```

**Fields**:
- `id` (PK) - Auto-increment
- `widget_status` - Status (e.g., "include", "exclude")
- `value` - Current value as string
- `widget_order` - Display order
- `capability_id` (FK, not null) - Capability reference
- `device_id` (FK, not null) - Device reference

**Relationships**:
- Belongs to Capability
- Belongs to Device (CASCADE on update and delete)
- Has many Logs

---

### logs

**Primary Key**: `id` (uint, auto-increment via gorm.Model)

```go
// internal/core/domain/widget.go
type Log struct {
    ID        uint
    WidgetID  uint
    Actor     string
    Value     string
    EventType string
    CreatedAt time.Time
}
```

```go
// internal/infrastructure/gorm/recorder_repo.go
type Log struct {
    gorm.Model
    Value     string
    EventType string
    Actor     string
    WidgetID  uint   `gorm:"not null"`
    Widget    Widget `gorm:"foreignKey:WidgetID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
```

**Fields**:
- `id` (PK) - Auto-increment
- `value` - Log value (as string)
- `event_type` - Event type
- `actor` - User email or "sensor" who/what created the log
- `widget_id` (FK, not null) - Widget reference

**Relationships**:
- Belongs to Widget (CASCADE on update and delete)
- Actor field references user email (string), not a foreign key

---

## Key Constraints

### Foreign Key Constraints

| Table | Foreign Key | References | On Update | On Delete |
|-------|-------------|------------|-----------|-----------|
| devices | room_id | rooms.id | CASCADE | SET NULL |
| widgets | device_id | devices.device_id | CASCADE | CASCADE |
| widgets | capability_id | capabilities.id | - | - |
| logs | widget_id | widgets.id | CASCADE | CASCADE |

### Important Notes

1. **Device ID** is a string, not auto-increment
2. **Authentication** uses separate `UserAccount` table (ID, Username, Password)
3. **Soft Deletes** enabled via `gorm.Model` (Capabilities, Widgets, Logs)
4. **NULL Room**: Devices can exist without being assigned to a room
5. **Cascade Delete**: Deleting a device deletes all its widgets
6. **Cascade Delete**: Deleting a widget deletes all its logs
7. **Room has no UserID**: Rooms are not tied to specific users in the current implementation

---

**Previous**: [Clean Architecture](./clean-architecture) | **Next**: [MQTT Integration](./mqtt) →
