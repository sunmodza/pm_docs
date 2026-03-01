# MQTT Topics

Complete MQTT topic reference.

## Topic Structure
```
devices/register                          # Device registration
devices/+/sensor                          # Sensor data (wildcard subscription)
devices/{device_id}/command/request       # Commands to device
devices/{correlation_id}/command/response # Device command responses
devices/{device_id}/pair/request          # Pair request
devices/{device_id}/pair/response         # Pair response
```

**Legend**:
- `{device_id}` - Actual device identifier (e.g., "ESP32-12345678")
- `{correlation_id}` - Backend-generated correlation ID for command matching
- `+` - MQTT wildcard (matches single topic level)

## Usage Details

### Device Registration
```
Topic: devices/register
QoS: 1
Direction: Device → Backend
Purpose: New device registration and discovery
```

### Sensor Data
```
Topic: devices/{device_id}/sensor
Backend Subscription: devices/+/sensor
QoS: 1
Direction: Device → Backend
Frequency: 1 second (recommended)
Purpose: Real-time sensor data and heartbeat
```

**Note**: Backend uses wildcard `devices/+/sensor` to receive data from all devices.

### Commands
```
Topic: devices/{device_id}/command/request
QoS: 1
Direction: Backend → Device
Purpose: Send control commands to device
```

### Command Response
```
Topic: devices/{correlation_id}/command/response
QoS: 1
Direction: Device → Backend
Purpose: Device command execution response
```

**Note**: Response topic uses correlation ID, not device ID.

### Pair Request
```
Topic: devices/{device_id}/pair/request
QoS: 1
Direction: Backend → Device
Purpose: Initiate device pairing
```

### Pair Response
```
Topic: devices/{device_id}/pair/response
QoS: 1
Direction: Device → Backend
Purpose: Device pairing response
```

## Topic Patterns

### Wildcard Subscriptions

Backend subscribes to these wildcard patterns:

| Wildcard Pattern | Matches | Purpose |
|------------------|---------|---------|
| `devices/+/sensor` | `devices/ESP32-123/sensor` | Receive sensor data from all devices |
| `devices/+/command/response` | `devices/abc123/command/response` | Receive command responses (per command) |

### Dynamic Topics

These topics are created dynamically:

| Pattern | Example | Created By |
|---------|---------|------------|
| `devices/{device_id}/sensor` | `devices/ESP32-123/sensor` | Device firmware |
| `devices/{correlation_id}/command/response` | `devices/uuid-abc123/command/response` | Backend (temporary subscription) |

## QoS Levels

- **QoS 0**: At most once (test messages)
- **QoS 1**: At least once (all operational messages - device commands, sensor data, registration)
- **QoS 2**: Exactly once (not currently used)

## Topic Naming Conventions

1. **Hierarchical Structure**: Uses `/` as level separator
2. **Lowercase**: All topic names are lowercase
3. **Descriptive**: Topic names indicate purpose
4. **Consistent**: Device ID always in same position
5. **Wildcard-Friendly**: Designed for efficient wildcard subscriptions

---

**Previous**: [MQTT Overview](./overview) | **Next**: [Device Registration](../mqtt/registration) →
