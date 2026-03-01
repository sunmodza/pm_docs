# Sensor Data

Sensor data transmission format.

## Topic
```
devices/{device_id}/sensor
```

**Wildcard Subscription**: `devices/+/sensor` (Backend subscribes to all devices)

## Sensor Payload

```json
{
  "capability_type": "temperature",
  "control_type": "sensor",
  "value": "25.5",
  "actor": "sensor"
}
```

**Required Fields**:
- `capability_type`: Type of sensor (temperature, humidity, power, status, etc.) - **Required**
- `control_type`: Control type ("sensor" for sensor data, "heartbeat" for heartbeat) - **Required**
- `value`: Sensor reading as string - **Required**
- `actor`: Source of the data (typically "sensor" for device-generated data) - **Required**

**Backend Processing**:
```go
// internal/infrastructure/mqtt/sensor_handler.go
// Topic: devices/{device_id}/sensor
// Parses device_id from topic[1]
// Records sensor log with:
// - capability_type
// - control_type
// - value
// - actor (set to "sensor" for device data)
```

## Heartbeat Processing

Heartbeat messages use the same topic but are processed differently:

```json
{
  "capability_type": "status",
  "control_type": "heartbeat",
  "value": "online",
  "actor": "sensor"
}
```

**Special Handling**:
- When `capability_type == "status" && control_type == "heartbeat"`
- Updates device heartbeat timestamp in database
- Does NOT create a log entry
- Used for device health monitoring

## Data Types

- **Temperature**: Numeric value in °C (e.g., "25.5")
- **Humidity**: Percentage (0-100) (e.g., "65")
- **Power**: ON/OFF or numeric value (e.g., "ON", "75")
- **Status**: Online/Offline (handled as heartbeat)
- **Brightness**: Level 0-100 (e.g., "80")
- **Custom**: Any sensor type supported by the device

## QoS & Frequency

- **QoS**: 1 (At least once)
- **Frequency**: 1 second for continuous monitoring
- **Purpose**: Real-time sensor data updates

---

**Previous**: [Registration](./registration) | **Next**: [Heartbeat](./heartbeat) →
