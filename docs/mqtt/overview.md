# MQTT Protocol Overview

MQTT communication protocol for IoT devices.

## Topics Structure
```
devices/register                          # Device registration
devices/{device_id}/sensor                # Sensor data
devices/{device_id}/command/request       # Commands to device
devices/{device_id}/command/response      # Device command responses
devices/{device_id}/pair/request          # Pair request
devices/{device_id}/pair/response         # Pair response
```

## QoS Levels
- **QoS 0**: At most once (test messages)
- **QoS 1**: At least once (device commands, sensor data)
- **QoS 2**: Exactly once (critical operations)

---

**Next**: [Topics](../mqtt/topics) →
