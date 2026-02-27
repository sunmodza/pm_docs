# Widgets API

Widget management endpoints.

## GET /api/rooms/:room_id/widgets
Get all widgets for a room.

## POST /api/widgets/:id/command
Send command to a device.

### Request
```json
{
  "value": "ON"
}
```

---

**Previous**: [Rooms](./rooms) | **Next**: [Users API](./users) →
