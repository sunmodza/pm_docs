# Device Pairing

Device pairing protocol for authentication.

## Pair Request Topic
```
devices/{device_id}/pair/request
```

## Pair Request Payload

```json
{
  "device_key": "secret-key-12345"
}
```

**Fields**:
- `device_key`: Secret key for device authentication

## Pair Response Topic
```
devices/{device_id}/pair/response
```

## Pair Response Payload

```json
{
  "status": "success"
}
```

**Status Values**:
- `success`: Pairing successful
- `error`: Pairing failed

## Timeout
- **Pair Timeout**: 30 seconds

## Flow

1. Backend publishes pair request to `devices/{device_id}/pair/request`
2. Device validates `device_key`
3. Device publishes response to `devices/{device_id}/pair/response`
4. Backend receives response and completes pairing

---

**Previous**: [Commands](./commands) | **Next**: [MQTT Overview](./overview)**
