# Device Registration

Device registration via MQTT.

## Topic
```
devices/register
```

## Registration Payload

```json
{
  "device_id": "ESP32-12345678",
  "device_name": "Living Room Light",
  "device_type": "smart_switch",
  "topic": "devices/ESP32-12345678/sensor"
}
```

**Fields**:
- `device_id`: Unique device identifier (required)
- `device_name`: Human-readable device name (required)
- `device_type`: Type of device (smart_switch, sensor, etc.) (required)
- `topic`: Topic for sensor data (optional, deprecated)

## Registration Flow

1. Device publishes registration message to `devices/register`
2. Backend receives message and validates payload
3. Backend creates device record in database
4. Device appears in unpaired devices list

## Widget Creation

Widgets are **NOT** created during device registration. They are created later during the **device pairing process**.

See [Pairing](./pairing) for details on how widgets are automatically created when a device is paired to a room.

## Go Implementation

```go
// internal/infrastructure/mqtt/device_handler.go
func (h *MQTTHandler) SubscribeDeviceRegistration(client mqtt.Client) {
    topic := "devices/register"

    client.Subscribe(topic, 1, func(c mqtt.Client, m mqtt.Message) {
        var payload DevicePayload

        err := json.Unmarshal(m.Payload(), &payload)
        if err != nil {
            return
        }

        device := PayloadToDomain(&payload)

        err = h.deviceUsecase.RegisterDevice(device)
        if err != nil {
            return
        }
    })
}
```

```go
// internal/core/usecase/device_usecase.go
func (u *deviceUsecase) RegisterDevice(device *domain.Device) error {
    if err := device.Validate(); err != nil {
        return err
    }

    if err := u.repo.CreateDevice(device); err != nil {
        return err
    }

    return nil
}
```

---

**Previous**: [Topics](./topics) | **Next**: [Sensor Data](./sensor-data) →
