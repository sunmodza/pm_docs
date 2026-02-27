# Sensor Data

Sensor data transmission format.

## Topic
```
devices/{device_id}/sensor
```

## Sensor Payload

```json
{
  "capability_type": "temperature",
  "control_type": "sensor",
  "value": "25.5"
}
```

**Fields**:
- `capability_type`: Type of sensor (temperature, humidity, power, etc.)
- `control_type`: Control type ("sensor" for sensor data, "heartbeat" for heartbeat)
- `value`: Sensor reading as string

**Backend Processing**:
```go
// Topic: devices/{device_id}/sensor
// Parses device_id from topic[1]
// Records sensor log with:
// - capability_type
// - control_type
// - value
```

## Data Types

- **Temperature**: Numeric value in °C
- **Humidity**: Percentage (0-100)
- **Power**: ON/OFF or numeric value
- **Status**: Online/Offline (handled separately as heartbeat)
- **Custom**: Any sensor type

---

**Previous**: [Registration](./registration) | **Next**: [Heartbeat](./heartbeat) →
