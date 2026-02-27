# MQTT Commands

Device command protocol and format.

## Command Request Topic
```
devices/{device_id}/command/request
```

## Command Request Payload

```json
{
  "capability_type": "power",
  "control_type": "toggle",
  "value": "ON",
  "reply_topic": "devices/ESP32-12345678/command/response"
}
```

**Fields**:
- `capability_type`: Type of capability (power, brightness, etc.)
- `control_type`: Control action (toggle, set, etc.)
- `value`: Command value
- `reply_topic`: Topic for device to send response (optional)

## Command Response Topic
```
devices/{device_id}/command/response
```

## Command Response Payload

```json
{
  "status": "success"
}
```

**Status Values**:
- `success`: Command executed successfully
- `error`: Command failed

## Timeout
- **Command Timeout**: 60 seconds

---

**Previous**: [MQTT Overview](./overview) | **Next**: [Pairing](./pairing) →
