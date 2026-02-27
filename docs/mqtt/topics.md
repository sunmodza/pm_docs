# MQTT Topics

Complete MQTT topic reference.

## Topic Structure
```
devices/register
devices/{device_id}/sensor
devices/{device_id}/command/request
devices/{device_id}/command/response
devices/{device_id}/pair/request
devices/{device_id}/pair/response
```

## Usage

### Device Registration
```
Topic: devices/register
QoS: 1
Direction: Device → Backend
```

### Sensor Data
```
Topic: devices/{device_id}/sensor
QoS: 1
Direction: Device → Backend
Frequency: 1 second
```

### Commands
```
Topic: devices/{device_id}/command/request
QoS: 1
Direction: Backend → Device
```

### Command Response
```
Topic: devices/{device_id}/command/response
QoS: 1
Direction: Device → Backend
```

### Pair Request
```
Topic: devices/{device_id}/pair/request
QoS: 1
Direction: Backend → Device
```

### Pair Response
```
Topic: devices/{device_id}/pair/response
QoS: 1
Direction: Device → Backend
```

---

**Previous**: [MQTT Overview](./overview) | **Next**: [Device Registration](../mqtt/registration) →
