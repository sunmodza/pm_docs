# Heartbeat Mechanism

Device heartbeat for health monitoring.

## Heartbeat Topic
```
devices/{device_id}/sensor
```

## Heartbeat Payload

```json
{
  "capability_type": "status",
  "control_type": "heartbeat",
  "value": "online"
}
```

**Backend Processing**:
- Detects heartbeat: `capability_type == "status" && control_type == "heartbeat"`
- Updates device heartbeat timestamp
- Does NOT record as sensor log

## Frequency
- **Interval**: 1 second
- **Purpose**: Device health monitoring
- **Offline Threshold**: 60 seconds

---

**Previous**: [Sensor Data](./sensor-data) | **Next**: [Pairing](./pairing) →
