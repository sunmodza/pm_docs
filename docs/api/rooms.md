# Rooms API

Room management endpoints.

## GET /api/rooms
List all rooms.

### Response (200)
```json
{
  "rooms": [
    {
      "id": 1,
      "name": "Living Room",
      "devices_count": 5
    }
  ]
}
```

## POST /api/rooms
Create a new room.

### Request
```json
{
  "name": "Bedroom"
}
```

---

**Previous**: [Devices](./devices) | **Next**: [Widgets API](./widgets) →
