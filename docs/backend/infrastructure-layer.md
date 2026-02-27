# Infrastructure Layer

External concerns implementation layer.

## Purpose

Implements repository interfaces and handles external dependencies.

## Components

### Database Implementation

GORM repository implementations:

```go
type DeviceRepository struct {
    db *gorm.DB
}

func (r *DeviceRepository) Create(device *Device) error {
    return r.db.Create(device).Error
}
```

### MQTT Client

Eclipse Paho MQTT client:

```go
mqtt.NewClient(mqtt.NewClientOptions().
    AddBroker("tcp://localhost:1883").
    SetClientID("pm-backend"))
```

### JWT Handler

Token generation and validation:

```go
func GenerateToken(userID string) (string, error) {
    claims := jwt.MapClaims{
        "user_id": userID,
        "exp": time.Now().Add(time.Hour * 24).Unix(),
    }
    return token.SignedString([]byte(secret))
}
```

## Responsibilities

- Database operations
- External API calls
- File system operations
- Caching
- Message queuing

---

**Previous**: [Use Case Layer](./usecase-layer) | **[Backend Intro](./intro)**
