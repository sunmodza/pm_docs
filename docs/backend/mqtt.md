# MQTT Integration

MQTT integration for IoT device communication.

## Setup

### Connection
```go
opts := mqtt.NewClientOptions().
    AddBroker("tcp://localhost:1883").
    SetClientID("go-backend-server")

client := mqtt.NewClient(opts)
if token := client.Connect(); token.Wait() && token.Error() != nil {
    panic(token.Error())
}
```

## Topics

### Device Registration
- **Topic**: `devices/register`
- **QoS**: 1
- **Direction**: Device → Backend

### Sensor Data
- **Topic**: `device/{device_id}/sensor`
- **QoS**: 1
- **Frequency**: 1 second

### Commands
- **Topic**: `device/{device_id}/command`
- **QoS**: 1
- **Direction**: Backend → Device

---

**Previous**: [Database](./database) | **Next**: [JWT Authentication](./jwt-authentication) →
