# Heartbeat Mechanism

Device heartbeat for health monitoring.

## Heartbeat Topic
```
devices/{device_id}/sensor
```

**Note**: Heartbeat messages use the same topic as regular sensor data but are processed differently based on their payload.

## Heartbeat Payload

```json
{
  "capability_type": "status",
  "control_type": "heartbeat",
  "value": "online",
  "actor": "sensor"
}
```

**Required Fields**:
- `capability_type`: Must be "status" for heartbeat detection
- `control_type`: Must be "heartbeat" for heartbeat detection
- `value**: Status value (typically "online")
- `actor`: Source identifier (typically "sensor")

## Backend Processing

**Detection Logic**:
```go
// internal/infrastructure/mqtt/sensor_handler.go
if payload.CapabilityType == "status" && payload.ControlType == "heartbeat" {
    // Update device heartbeat timestamp
    _ = h.deviceUC.UpdateHeartbeat(deviceID)
    return  // Do NOT create log entry
}
```

**Processing Steps**:
1. Backend receives message on `devices/{device_id}/sensor`
2. Checks if `capability_type == "status"` AND `control_type == "heartbeat"`
3. If true: Updates `last_heartbeat` timestamp in devices table
4. Returns without creating a log entry
5. If false: Processes as regular sensor data (creates log entry)

## Frequency & Timing

- **Interval**: 1 second (recommended)
- **Purpose**: Real-time device health monitoring
- **Offline Threshold**: 60 seconds (devices not sending heartbeat for 60s are considered offline)

## Device Implementation Example

```cpp
// Pseudo-code for device firmware
void sendHeartbeat() {
    DynamicJsonDocument doc(256);
    doc["capability_type"] = "status";
    doc["control_type"] = "heartbeat";
    doc["value"] = "online";
    doc["actor"] = "sensor";

    String payload;
    serializeJson(doc, payload);

    String topic = "devices/" + DEVICE_ID + "/sensor";
    mqttClient.publish(topic, payload);
}

void loop() {
    // Send heartbeat every second
    if (millis() - lastHeartbeat > 1000) {
        sendHeartbeat();
        lastHeartbeat = millis();
    }
}
```

## Health Monitoring

**Frontend Polling**:
- Frontend polls devices every 10 seconds
- Compares `last_heartbeat` with current time
- Shows device as "offline" if `last_heartbeat` > 60 seconds ago

**Backend Processing**:
- Updates heartbeat timestamp immediately upon receipt
- No database writes for logs (reduces database load)
- Efficient real-time status tracking

---

**Previous**: [Sensor Data](./sensor-data) | **Next**: [Pairing](./pairing) →
