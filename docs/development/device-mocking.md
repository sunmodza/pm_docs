# Device Mocking Guide

Complete guide for mocking IoT devices for testing MQTT flows and backend functionality.

## Overview

Device mocking simulates IoT device behavior to test backend functionality without physical devices. This is essential for:

- **Automated Testing**: Run tests in CI/CD without hardware
- **Load Testing**: Simulate thousands of devices
- **Edge Case Testing**: Test error conditions and timeouts
- **Development**: Develop frontend/backend without physical devices

---

## Tools for Device Mocking

### 1. mosquitto_pub / mosquitto_sub (CLI)
```bash
# Subscribe to commands
mosquitto_sub -h localhost -t "devices/ESP32-001/command/request" -q 1

# Publish sensor data
mosquitto_pub -h localhost -t "devices/ESP32-001/sensor" -m '{"capability_type":"temperature","control_type":"sensor","value":"25.5"}' -q 1
```

### 2. Python (paho-mqtt)
```python
import paho.mqtt.client as mqtt
import json
import time
import random

class MockDevice:
    def __init__(self, device_id, device_type="sensor"):
        self.device_id = device_id
        self.device_type = device_type
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        
    def on_connect(self, client, userdata, flags, rc):
        print(f"{self.device_id} connected")
        # Subscribe to commands
        client.subscribe(f"devices/{self.device_id}/command/request")
        client.subscribe(f"devices/{self.device_id}/pair/request")
        
    def on_message(self, client, userdata, msg):
        topic = msg.topic
        payload = json.loads(msg.payload)
        
        if "command" in topic:
            self.handle_command(payload)
        elif "pair" in topic:
            self.handle_pair(payload)
    
    def handle_command(self, payload):
        response = {"status": "success"}
        self.client.publish(
            f"devices/{self.device_id}/command/response",
            json.dumps(response)
        )
    
    def handle_pair(self, payload):
        if payload.get("device_key") == "valid-key":
            response = {"status": "success"}
        else:
            response = {"status": "error"}
        self.client.publish(
            f"devices/{self.device_id}/pair/response",
            json.dumps(response)
        )
    
    def send_sensor_data(self, capability_type, value):
        payload = {
            "capability_type": capability_type,
            "control_type": "sensor",
            "value": str(value)
        }
        self.client.publish(
            f"devices/{self.device_id}/sensor",
            json.dumps(payload)
        )
    
    def send_heartbeat(self):
        payload = {
            "capability_type": "status",
            "control_type": "heartbeat",
            "value": "online"
        }
        self.client.publish(
            f"devices/{self.device_id}/sensor",
            json.dumps(payload)
        )
    
    def register(self):
        payload = {
            "device_id": self.device_id,
            "device_name": f"Mock {self.device_type}",
            "device_type": self.device_type,
            "topic": f"devices/{self.device_id}/sensor"
        }
        self.client.publish("devices/register", json.dumps(payload))
    
    def run(self):
        self.client.connect("localhost", 1883)
        self.client.loop_start()
        self.register()
        
        try:
            while True:
                self.send_heartbeat()
                if self.device_type == "temperature_sensor":
                    self.send_sensor_data("temperature", random.uniform(20, 30))
                time.sleep(1)
        except KeyboardInterrupt:
            self.client.loop_stop()

# Usage
device = MockDevice("ESP32-MOCK-001", "temperature_sensor")
device.run()
```

### 3. Go (using paho.mqtt.golang)
```go
package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type MockDevice struct {
	DeviceID   string
	DeviceType string
	Client     mqtt.Client
}

func NewMockDevice(deviceID, deviceType string) *MockDevice {
	opts := mqtt.NewClientOptions().
		AddBroker("tcp://localhost:1883").
		SetClientID(deviceID)

	client := mqtt.NewClient(opts)
	return &MockDevice{
		DeviceID:   deviceID,
		DeviceType: deviceType,
		Client:     client,
	}
}

func (d *MockDevice) Connect() error {
	if token := d.Client.Connect(); token.Wait() && token.Error() != nil {
		return token.Error()
	}

	// Subscribe to commands and pair requests
	d.Client.Subscribe(fmt.Sprintf("devices/%s/command/request", d.DeviceID), 1, d.handleCommand)
	d.Client.Subscribe(fmt.Sprintf("devices/%s/pair/request", d.DeviceID), 1, d.handlePair)

	return nil
}

func (d *MockDevice) handleCommand(client mqtt.Client, msg mqtt.Message) {
	var cmd map[string]interface{}
	json.Unmarshal(msg.Payload(), &cmd)

	// Send response
	response := map[string]string{"status": "success"}
	payload, _ := json.Marshal(response)
	client.Publish(fmt.Sprintf("devices/%s/command/response", d.DeviceID), 1, false, payload)
}

func (d *MockDevice) handlePair(client mqtt.Client, msg mqtt.Message) {
	var req map[string]string
	json.Unmarshal(msg.Payload(), &req)

	status := "success"
	if req["device_key"] != "valid-key" {
		status = "error"
	}

	response := map[string]string{"status": status}
	payload, _ := json.Marshal(response)
	client.Publish(fmt.Sprintf("devices/%s/pair/response", d.DeviceID), 1, false, payload)
}

func (d *MockDevice) Register() {
	payload := map[string]string{
		"device_id":   d.DeviceID,
		"device_name": "Mock " + d.DeviceType,
		"device_type": d.DeviceType,
	}
	data, _ := json.Marshal(payload)
	d.Client.Publish("devices/register", 1, false, data)
}

func (d *MockDevice) SendSensorData(capabilityType, value string) {
	payload := map[string]string{
		"capability_type": capabilityType,
		"control_type":    "sensor",
		"value":           value,
	}
	data, _ := json.Marshal(payload)
	d.Client.Publish(fmt.Sprintf("devices/%s/sensor", d.DeviceID), 1, false, data)
}

func (d *MockDevice) SendHeartbeat() {
	payload := map[string]string{
		"capability_type": "status",
		"control_type":    "heartbeat",
		"value":           "online",
	}
	data, _ := json.Marshal(payload)
	d.Client.Publish(fmt.Sprintf("devices/%s/sensor", d.DeviceID), 1, false, data)
}

func (d *MockDevice) Run() {
	d.Connect()
	d.Register()

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		d.SendHeartbeat()
		if d.DeviceType == "temperature_sensor" {
			temp := 20.0 + rand.Float64()*10.0
			d.SendSensorData("temperature", fmt.Sprintf("%.2f", temp))
		}
	}
}

func main() {
	device := NewMockDevice("ESP32-MOCK-001", "temperature_sensor")
	device.Run()
}
```

---

## What to Mock

### 1. Device Registration
```json
// Publish to: devices/register
{
  "device_id": "ESP32-MOCK-001",
  "device_name": "Mock Temperature Sensor",
  "device_type": "temperature_sensor",
  "topic": "devices/ESP32-MOCK-001/sensor"
}
```

### 2. Heartbeat
```json
// Publish to: devices/{device_id}/sensor
{
  "capability_type": "status",
  "control_type": "heartbeat",
  "value": "online"
}
```

### 3. Sensor Data
```json
// Temperature Sensor
{
  "capability_type": "temperature",
  "control_type": "sensor",
  "value": "25.5"
}

// Humidity Sensor
{
  "capability_type": "humidity",
  "control_type": "sensor",
  "value": "65"
}

// Power Switch Status
{
  "capability_type": "power",
  "control_type": "sensor",
  "value": "ON"
}
```

### 4. Command Response
```json
// Publish to: devices/{device_id}/command/response
{
  "status": "success"
}
```

### 5. Pair Response
```json
// Publish to: devices/{device_id}/pair/response
{
  "status": "success"
}
```

---

## Test Flows

### 1. Device Registration Flow
```
1. Mock device publishes to devices/register
2. Verify device appears in database
3. Verify widgets are auto-created
```

### 2. Sensor Data Flow
```
1. Mock device registers
2. Mock device sends sensor data every second
3. Verify data stored in logs table
4. Verify frontend receives updates via WebSocket/API
```

### 3. Heartbeat Flow
```
1. Mock device sends heartbeat every second
2. Verify heartbeat timestamp updated
3. Stop heartbeat for 60+ seconds
4. Verify device marked as offline
```

### 4. Command Flow
```
1. Mock device registers and subscribes to command/request
2. Backend sends command to device/{id}/command/request
3. Mock device receives command and publishes to command/response
4. Verify backend receives response
```

### 5. Pair Flow
```
1. Backend sends pair request to device/{id}/pair/request
2. Mock device validates device_key
3. Mock device publishes response to pair/response
4. Verify pairing success/failure
```

### 6. Error Scenarios
```
1. Invalid JSON payload
2. Missing required fields
3. Device timeout (no response within 60s)
4. Network disconnection during operation
5. Duplicate device registration
```

---

## Performance Test Flows

### 1. Concurrent Device Registration
```python
import threading

def register_device(device_id):
    device = MockDevice(device_id)
    device.register()

# Test with 100, 500, 1000 concurrent devices
threads = []
for i in range(100):
    t = threading.Thread(target=register_device, args=(f"ESP32-PERF-{i}",))
    threads.append(t)
    t.start()

for t in threads:
    t.join()
```

### 2. High-Frequency Sensor Data
```python
# Test sensor data at various frequencies
def stress_test_sensor_data(device_id, frequency_hz):
    device = MockDevice(device_id)
    interval = 1.0 / frequency_hz
    
    start_time = time.time()
    count = 0
    while time.time() - start_time < 60:  # Run for 60 seconds
        device.send_sensor_data("temperature", random.uniform(20, 30))
        count += 1
        time.sleep(interval)
    
    print(f"Sent {count} messages in 60 seconds")

# Test scenarios:
# - 1 device @ 10 Hz
# - 10 devices @ 10 Hz each
# - 100 devices @ 1 Hz each
```

### 3. Command Response Time
```python
import time

def test_command_latency(device_id):
    device = MockDevice(device_id)
    device.connect()
    
    latencies = []
    for _ in range(100):
        start = time.time()
        # Send command and wait for response
        # ...
        latency = time.time() - start
        latencies.append(latency)
    
    avg_latency = sum(latencies) / len(latencies)
    max_latency = max(latencies)
    print(f"Average: {avg_latency*1000:.2f}ms, Max: {max_latency*1000:.2f}ms")
```

### 4. Memory Usage Test
```python
# Monitor backend memory with increasing device count
import psutil
import os

def memory_stress_test():
    process = psutil.Process(os.getpid())
    
    devices = []
    for i in range(1000):
        d = MockDevice(f"ESP32-MEM-{i}")
        d.connect()
        devices.append(d)
        
        if i % 100 == 0:
            mem_mb = process.memory_info().rss / 1024 / 1024
            print(f"Devices: {i}, Memory: {mem_mb:.2f} MB")
```

### 5. Connection Stability
```python
def test_connection_stability():
    """Test reconnect behavior"""
    device = MockDevice("ESP32-STABLE-001")
    device.connect()
    
    # Simulate network interruptions
    for i in range(10):
        time.sleep(5)
        device.disconnect()
        time.sleep(2)
        device.connect()
        print(f"Reconnection {i+1} successful")
```

---

## Test Scenarios Matrix

| Test Case | Devices | Frequency | Duration | Expected |
|-----------|---------|-----------|----------|----------|
| Baseline | 1 | 1 msg/s | 60s | Success |
| Light Load | 10 | 1 msg/s | 60s | Success |
| Medium Load | 100 | 1 msg/s | 60s | Success |
| Heavy Load | 1000 | 1 msg/s | 60s | Monitor CPU/Mem |
| Burst | 100 | 10 msg/s | 10s | Handle gracefully |
| Long Run | 50 | 1 msg/s | 1 hour | Stability |
| Command Stress | 10 | 1 cmd/s each | 60s | < 100ms latency |

---

## Best Practices

### 1. Use Unique Client IDs
```python
# Bad - will cause connection conflicts
client_id = "mock-device"

# Good - unique per instance
client_id = f"mock-device-{uuid.uuid4()}"
```

### 2. Clean Up Resources
```python
def cleanup():
    client.unsubscribe(f"devices/{device_id}/command/request")
    client.disconnect()
```

### 3. Handle Connection Failures
```python
max_retries = 5
for i in range(max_retries):
    try:
        client.connect()
        break
    except Exception as e:
        if i == max_retries - 1:
            raise
        time.sleep(2 ** i)  # Exponential backoff
```

### 4. Validate Payloads
```python
def validate_sensor_payload(payload):
    required = ["capability_type", "control_type", "value"]
    for field in required:
        if field not in payload:
            raise ValueError(f"Missing field: {field}")
```

---

**Previous**: [Device Mocking Overview](./device-mocking-overview) | **Next**: [Troubleshooting](./troubleshooting) →
