# Use Case Layer

Application-specific business rules layer.

## Purpose

Orchestrates business workflows and coordinates entities.

## Components

### Device Use Case

Device management operations:

```go
type DeviceUsecase struct {
    repo      Domain.DeviceRepository
    mqttClient mqtt.Client
}

func (uc *DeviceUsecase) RegisterDevice(device *Device) error {
    // Business logic
    if err := uc.repo.Create(device); err != nil {
        return err
    }
    // Trigger workflow
    uc.createWidgetsForDevice(device)
    return nil
}
```

### Room Use Case

Room management operations:

```go
type RoomUsecase struct {
    roomRepo  RoomRepository
    deviceRepo DeviceRepository
}

func (uc *RoomUsecase) CreateRoom(name string, userID string) (*Room, error) {
    room := &Room{Name: name, UserID: userID}
    return uc.roomRepo.Create(room)
}
```

### Auth Use Case

Authentication operations:

```go
type AuthUsecase struct {
    userRepo UserRepository
    jwt      JWTService
}

func (uc *AuthUsecase) Login(email, password string) (string, error) {
    user := uc.userRepo.FindByEmail(email)
    if !uc.verifyPassword(password, user.Password) {
        return "", ErrInvalidCredentials
    }
    return uc.jwt.GenerateToken(user.ID)
}
```

## Responsibilities

- Business workflow orchestration
- Entity coordination
- Input validation
- Transaction management

---

**Previous**: [Domain Layer](./domain-layer) | **Next**: [Infrastructure Layer](./infrastructure-layer) →
