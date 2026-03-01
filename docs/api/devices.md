# Devices API

Device management endpoints for the PM IoT System.

## Base URL
```
Development: http://localhost:3000/api/devices
Production: https://api.yourdomain.com/api/devices
```

## Authentication

Most endpoints require JWT authentication:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. List All Devices

Get a list of all devices in the system.

**Endpoint**: `GET /api/devices`

**Authentication**: Not required (or required based on your security policy)

**Response (200)**:
```json
{
  "status": "success",
  "data": [
    {
      "device_id": "ESP32-12345",
      "device_name": "Living Room Light",
      "device_type": "smart_switch",
      "last_heartbeat": "2024-01-15T10:30:00Z",
      "room_id": 1,
      "widgets": []
    },
    {
      "device_id": "ESP32-67890",
      "device_name": "Bedroom Sensor",
      "device_type": "environmental_sensor",
      "last_heartbeat": "2024-01-15T10:29:45Z",
      "room_id": 2,
      "widgets": []
    }
  ]
}
```

**Error Response (401)**:
```json
{
  "status": "error",
  "code": 401,
  "message": "Unauthorized",
  "errors": null
}
```

### 2. Get Device Details

Get detailed information about a specific device.

**Endpoint**: `GET /api/devices/:device_id`

**Parameters**:
- `device_id` (path parameter): The unique device identifier

**Authentication**: Not required

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "device_id": "ESP32-12345",
    "device_name": "Living Room Light",
    "device_type": "smart_switch",
    "last_heartbeat": "2024-01-15T10:30:00Z",
    "room_id": 1,
    "widgets": [
      {
        "id": 1,
        "widget_order": 1,
        "widget_status": "include",
        "value": "ON",
        "capability_id": 1
      }
    ]
  }
}
```

**Error Response (404)**:
```json
{
  "status": "error",
  "code": 404,
  "message": "Device not found",
  "errors": null
}
```

### 3. Update Device

Update device information.

**Endpoint**: `PUT /api/devices/:device_id`

**Parameters**:
- `device_id` (path parameter): The unique device identifier

**Authentication**: Required

**Request Body**:
```json
{
  "device_name": "Updated Device Name"
}
```

**Response (200)**:
```json
{
  "status": "success",
  "data": {
    "device_id": "ESP32-12345",
    "device_name": "Updated Device Name",
    "device_type": "smart_switch",
    "last_heartbeat": "2024-01-15T10:30:00Z",
    "room_id": 1
  }
}
```

**Error Response (400)**:
```json
{
  "status": "error",
  "code": 400,
  "message": "Invalid request data",
  "errors": ["device_name is required"]
}
```

### 4. Pair Device to Room

Pair a device to a specific room.

**Endpoint**: `POST /api/devices/:device_id/pair`

**Parameters**:
- `device_id` (path parameter): The unique device identifier

**Authentication**: Required

**Request Body**:
```json
{
  "room_id": 1
}
```

**Response (200)**:
```json
{
  "status": "success",
  "message": "Device paired successfully",
  "data": {
    "device_id": "ESP32-12345",
    "room_id": 1
  }
}
```

**Error Response (404)**:
```json
{
  "status": "error",
  "code": 404,
  "message": "Device or room not found",
  "errors": null
}
```

### 5. Unpair Device

Unpair a device from its current room.

**Endpoint**: `POST /api/devices/:device_id/unpair`

**Parameters**:
- `device_id` (path parameter): The unique device identifier

**Authentication**: Required

**Response (200)**:
```json
{
  "status": "success",
  "message": "Device unpaired successfully",
  "data": {
    "device_id": "ESP32-12345",
    "room_id": null
  }
}
```

**Error Response (404)**:
```json
{
  "status": "error",
  "code": 404,
  "message": "Device not found",
  "errors": null
}
```

## Data Models

### Device Object

```json
{
  "device_id": "string",           // Unique device identifier (MAC address or custom ID)
  "device_name": "string",         // Human-readable device name
  "device_type": "string",         // Device type (e.g., "smart_switch", "sensor")
  "last_heartbeat": "datetime",    // ISO 8601 timestamp of last communication
  "room_id": "integer | null",     // Associated room ID (null if unpaired)
  "widgets": "array"               // Array of widget objects
}
```

### Device Summary Object

```json
{
  "device_id": "string",
  "device_name": "string",
  "device_type": "string",
  "last_heartbeat": "datetime"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing JWT token |
| 404 | Not Found - Device does not exist |
| 500 | Internal Server Error - Server-side error |

## MQTT Integration

Devices communicate with the backend via MQTT:

**Device Registration Topic**: `devices/register`

**Device Registration Payload**:
```json
{
  "device_id": "ESP32-12345",
  "device_name": "Living Room Light",
  "device_type": "smart_switch"
}
```

**Sensor Data Topic**: `device/{device_id}/sensor`

**Sensor Data Payload**:
```json
{
  "capability_type": "temperature",
  "control_type": "sensor",
  "value": "25.5"
}
```

**Command Topic**: `device/{device_id}/command`

**Command Payload**:
```json
{
  "capability_type": "power",
  "control_type": "toggle",
  "value": "ON",
  "reply_topic": "device/ESP32-12345/response"
}
```

## Usage Examples

### cURL Examples

**List all devices**:
```bash
curl -X GET http://localhost:3000/api/devices
```

**Get device details**:
```bash
curl -X GET http://localhost:3000/api/devices/ESP32-12345
```

**Update device**:
```bash
curl -X PUT http://localhost:3000/api/devices/ESP32-12345 \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"device_name": "New Device Name"}'
```

**Pair device to room**:
```bash
curl -X POST http://localhost:3000/api/devices/ESP32-12345/pair \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"room_id": 1}'
```

**Unpair device**:
```bash
curl -X POST http://localhost:3000/api/devices/ESP32-12345/unpair \
  -H "Authorization: Bearer <jwt_token>"
```

### JavaScript/Fetch Examples

**List all devices**:
```javascript
const response = await fetch('http://localhost:3000/api/devices');
const data = await response.json();
console.log(data);
```

**Update device**:
```javascript
const response = await fetch('http://localhost:3000/api/devices/ESP32-12345', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ device_name: 'New Device Name' }),
});
const data = await response.json();
```

---

**Previous**: [Authentication API](./authentication) | **Next**: [Rooms API](./rooms) →
