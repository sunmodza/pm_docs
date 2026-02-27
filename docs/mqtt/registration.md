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
- `device_id`: Unique device identifier
- `device_name`: Human-readable device name
- `device_type`: Type of device (smart_switch, sensor, etc.)
- `topic`: Topic for sensor data (optional)

## Auto-Widgets

Backend automatically creates widgets for each capability when device registers.

---

**Previous**: [Topics](./topics) | **Next**: [Sensor Data](./sensor-data) →
