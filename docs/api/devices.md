# Devices API

Device management endpoints.

## GET /api/devices
List all devices.

### Response (200)
```json
{
  "devices": [
    {
      "device_id": "ESP32-12345",
      "device_name": "Living Room Light",
      "device_type": "smart_switch",
      "last_heartbeat": "2024-01-15T10:30:00Z",
      "room_id": null
    }
  ]
}
```

## GET /api/devices/:id
Get device details.

## PUT /api/devices/:id
Update device information.

### Request
```json
{
  "device_name": "New Device Name"
}
```

---

**Previous**: [Authentication](./authentication) | **Next**: [Rooms API](./rooms) →
