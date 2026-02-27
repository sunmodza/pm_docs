# Device Mocking Overview

บทสรุปภาพรวมการ Mock Device สำหรับการทดสอบระบบ MQTT

---

## 1. อุปกรณ์ที่ต้อง Mock

### 1.1 Smart Switch (สวิตช์ไฟอัจฉริยะ)

| ข้อมูล | รายละเอียด |
|--------|-----------|
| **ลักษณะ** | เปิด/ปิดไฟ ผ่านแอป |
| **ความสามารถ** | power (toggle) |
| **ข้อมูลที่ส่ง** | สถานะ ON/OFF |
| **คำสั่งที่รับ** | เปิด, ปิด, toggle |

**Flow การทำงาน:**
```
1. ลงทะเบียน → Backend สร้าง Widget
2. ส่ง Heartbeat ทุก 1 วินาที
3. ส่งสถานะ ON/OFF เมื่อมีการกดสวิตช์
4. รอรับคำสั่งจาก Backend → ตอบกลับ success/error
```

---

### 1.2 Temperature Sensor (เซ็นเซอร์อุณหภูมิ)

| ข้อมูล | รายละเอียด |
|--------|-----------|
| **ลักษณะ** | วัดอุณหภูมิห้อง |
| **ความสามารถ** | temperature (sensor) |
| **ข้อมูลที่ส่ง** | ค่าอุณหภูมิ (°C) |
| **คำสั่งที่รับ** | ไม่มี (read-only) |

**Flow การทำงาน:**
```
1. ลงทะเบียน → Backend สร้าง Widget
2. ส่ง Heartbeat ทุก 1 วินาที
3. ส่งข้อมูลอุณหภูมิ ทุก 1-5 วินาที
4. ไม่รับคำสั่งควบคุม
```

---

### 1.3 Humidity Sensor (เซ็นเซอร์ความชื้น)

| ข้อมูล | รายละเอียด |
|--------|-----------|
| **ลักษณะ** | วัดความชื้นในอากาศ |
| **ความสามารถ** | humidity (sensor) |
| **ข้อมูลที่ส่ง** | เปอร์เซ็นต์ความชื้น (0-100%) |
| **คำสั่งที่รับ** | ไม่มี (read-only) |

**Flow การทำงาน:** เหมือน Temperature Sensor

---

### 1.4 Smart Light (หลอดไฟอัจฉริยะ)

| ข้อมูล | รายละเอียด |
|--------|-----------|
| **ลักษณะ** | ปรับความสว่าง/สีได้ |
| **ความสามารถ** | power (toggle), brightness (set), color (set) |
| **ข้อมูลที่ส่ง** | สถานะ, ความสว่าง, สี |
| **คำสั่งที่รับ** | เปิด/ปิด, ปรับความสว่าง (0-100%), เปลี่ยนสี |

**Flow การทำงาน:**
```
1. ลงทะเบียน → Backend สร้าง Widgets หลายตัว (power, brightness, color)
2. ส่ง Heartbeat ทุก 1 วินาที
3. ส่งสถานะปัจจุบันเมื่อมีการเปลี่ยนแปลง
4. รับคำสั่ง: ON/OFF, brightness=50, color=#FF5733
```

---

### 1.5 Door Sensor (เซ็นเซอร์ประตู)

| ข้อมูล | รายละเอียด |
|--------|-----------|
| **ลักษณะ** | ตรวจจับการเปิด/ปิดประตู |
| **ความสามารถ** | contact (sensor) |
| **ข้อมูลที่ส่ง** | OPEN / CLOSED |
| **คำสั่งที่รับ** | ไม่มี (read-only) |

**Flow การทำงาน:**
```
1. ลงทะเบียน → Backend สร้าง Widget
2. ส่ง Heartbeat ทุก 1 วินาที
3. ส่ง OPEN เมื่อเปิดประตู, ส่ง CLOSED เมื่อปิด
```

---

### 1.6 Motion Sensor (เซ็นเซอร์ตรวจจับการเคลื่อนไหว)

| ข้อมูล | รายละเอียด |
|--------|-----------|
| **ลักษณะ** | ตรวจจับการเคลื่อนไหว |
| **ความสามารถ** | motion (sensor) |
| **ข้อมูลที่ส่ง** | DETECTED / CLEAR |
| **คำสั่งที่รับ** | ไม่มี (read-only) |

**Flow การทำงาน:**
```
1. ลงทะเบียน → Backend สร้าง Widget
2. ส่ง Heartbeat ทุก 1 วินาที
3. ส่ง DETECTED เมื่อมีคนเดินผ่าน
4. ส่ง CLEAR หลังไม่มีการเคลื่อนไหว 30 วินาที
```

---

## 2. Topics ที่ต้องใช้

### 2.1 Publish (Device → Backend)

| Topic | อธิบาย | ความถี่ |
|-------|--------|---------|
| `devices/register` | ลงทะเบียนอุปกรณ์ครั้งแรก | ครั้งเดียว |
| `devices/{id}/sensor` | ส่งข้อมูล sensor / heartbeat | ทุก 1 วินาที |
| `devices/{id}/command/response` | ตอบกลับคำสั่ง | เมื่อได้รับคำสั่ง |
| `devices/{id}/pair/response` | ตอบกลับการ pair | เมื่อได้รับคำขอ pair |

### 2.2 Subscribe (Backend → Device)

| Topic | อธิบาย | ใช้เมื่อ |
|-------|--------|---------|
| `devices/{id}/command/request` | รับคำสั่งจาก Backend | อุปกรณ์ที่รับคำสั่งได้ |
| `devices/{id}/pair/request` | รับคำขอ pair | ทุกอุปกรณ์ |

---

## 3. Message Format ที่ต้องส่ง

### 3.1 Registration
```json
{
  "device_id": "ESP32-001",
  "device_name": "Living Room Light",
  "device_type": "smart_light",
  "topic": "devices/ESP32-001/sensor"
}
```

### 3.2 Heartbeat
```json
{
  "capability_type": "status",
  "control_type": "heartbeat",
  "value": "online"
}
```

### 3.3 Sensor Data
```json
// Temperature
{
  "capability_type": "temperature",
  "control_type": "sensor",
  "value": "25.5"
}

// Power Status
{
  "capability_type": "power",
  "control_type": "sensor",
  "value": "ON"
}
```

### 3.4 Command Response
```json
{
  "status": "success"
}
```

---

## 4. Test Scenarios ที่ต้องทดสอบ

### 4.1 Functional Tests

| หัวข้อ | รายละเอียด | ผลลัพธ์ที่คาดหวัง |
|--------|-----------|------------------|
| **Registration** | ลงทะเบียนอุปกรณ์ใหม่ | ปรากฏใน Device List, สร้าง Widgets อัตโนมัติ |
| **Heartbeat** | ส่ง heartbeat ต่อเนื่อง | สถานะอุปกรณ์แสดง "Online" |
| **Offline Detection** | หยุดส่ง heartbeat 60 วินาที | สถานะเปลี่ยนเป็น "Offline" |
| **Sensor Data** | ส่งข้อมูล sensor | แสดงใน Dashboard / Graph |
| **Command Execution** | ส่งคำสั่ง ON/OFF | อุปกรณ์ตอบกลับ success, สถานะเปลี่ยน |
| **Command Timeout** | ไม่ตอบกลับคำสั่ง | Backend แสดง error "timeout" |
| **Pair Success** | ส่ง device_key ถูกต้อง | Pairing สำเร็จ |
| **Pair Fail** | ส่ง device_key ผิด | Pairing ล้มเหลว |

### 4.2 Performance Tests

| หัวข้อ | รายละเอียด | เกณฑ์ผ่าน |
|--------|-----------|-----------|
| **Concurrent Devices** | ลงทะเบียน 1000 devices พร้อมกัน | ไม่มี error, ทุก device ปรากฏในระบบ |
| **Message Rate** | 100 devices ส่งข้อมูล 10 msg/s | Backend รองรับได้, ไม่ drop message |
| **Command Latency** | ส่งคำสั่งแล้วรอ response | เฉลี่ย < 100ms |
| **Long Running** | 50 devices ทำงานต่อเนื่อง 1 ชั่วโมง | ไม่มี memory leak, connection stable |
| **Reconnection** | ขาดการเชื่อมต่อแล้ว reconnect | Reconnect สำเร็จ, ส่งข้อมูลต่อได้ |

### 4.3 Edge Cases

| หัวข้อ | รายละเอียด | ผลลัพธ์ที่คาดหวัง |
|--------|-----------|------------------|
| **Invalid JSON** | ส่ง payload ที่ไม่ใช่ JSON | Backend ไม่ crash, log error |
| **Missing Fields** | ส่ง JSON ขาด field สำคัญ | Backend ไม่ crash, log error |
| **Duplicate Device** | ลงทะเบียน device_id ซ้ำ | Handle ตาม logic ของระบบ |
| **Rapid Connect/Disconnect** | เชื่อมต่อ/ตัดการเชื่อมต่อ บ่อยๆ | ระบบทนทาน, ไม่ crash |
| **Large Payload** | ส่งข้อมูลขนาดใหญ่เกินไป | Backend ปฏิเสธหรือตัดข้อมูล |

---

## 5. Checklist ก่อนเริ่มทดสอบ

### 5.1 Environment Setup
- [ ] MQTT Broker ทำงาน (port 1883)
- [ ] Backend API ทำงาน
- [ ] Database พร้อมใช้งาน
- [ ] Dashboard/Frontend เปิดได้

### 5.2 Mock Device Ready
- [ ] เลือก tool ที่จะใช้ (Python/Go/CLI)
- [ ] ตั้งค่า Client ID ไม่ซ้ำกัน
- [ ] ตรวจสอบ topic patterns ถูกต้อง
- [ ] เตรียม test data (ค่าอุณหภูมิ, สถานะต่างๆ)

### 5.3 Monitoring
- [ ] Database logs/query ตรวจสอบข้อมูล
- [ ] Backend logs ดู error
- [ ] MQTT Broker logs (ถ้ามี)
- [ ] System metrics (CPU, Memory)

---

## 6. Quick Start สำหรับ Tester

### ขั้นตอนที่ 1: ทดสอบ 1 Device
```
1. สร้าง mock device (ใช้ Python/Go script)
2. ลงทะเบียน → ตรวจสอบใน Dashboard
3. ส่ง sensor data → ตรวจสอบ graph
4. ส่งคำสั่งจาก Dashboard → ตรวจสอบ device ได้รับ
5. หยุด heartbeat → ตรวจสอบสถานะเปลี่ยนเป็น offline
```

### ขั้นตอนที่ 2: ทดสอบหลาย Devices
```
1. สร้าง 10 devices แบบต่างๆ (switch, sensor, light)
2. ให้ทุก device ส่งข้อมูลพร้อมกัน
3. ตรวจสอบ Dashboard แสดงผลถูกต้อง
4. ส่งคำสั่งควบคุมทีละอุปกรณ์
```

### ขั้นตอนที่ 3: Performance Test
```
1. ค่อยๆ เพิ่มจำนวน device (10 → 50 → 100 → 500 → 1000)
2. Monitor CPU/Memory ของ Backend
3. ตรวจสอบ message ไม่ drop
4. วัด latency ของคำสั่ง
```

---

## 7. ตัวอย่าง Test Plan

### Test Plan: Smart Home System

| Test ID | รายการ | Priority | Expected Result |
|---------|--------|----------|-----------------|
| TC-001 | Register 1 Smart Switch | High | Device + Widget สร้างสำเร็จ |
| TC-002 | Send ON command | High | Device ได้รับ, ตอบกลับ success |
| TC-003 | Device timeout test | Medium | Backend แจ้ง timeout หลัง 60s |
| TC-004 | 100 concurrent devices | Medium | ทุก device online, ไม่มี error |
| TC-005 | Heartbeat offline detection | High | สถานะเปลี่ยน offline หลัง 60s |
| TC-006 | Pair with valid key | High | Pairing success |
| TC-007 | Pair with invalid key | High | Pairing fail |
| TC-008 | 1 hour stability test | Low | ไม่มี memory leak, connection stable |

---

## 8. การวัดผลการทดสอบ

### Metrics ที่ต้องเก็บ

| Metric | วิธีวัด | ค่าที่ดี |
|--------|--------|---------|
| **Registration Success Rate** | จำนวน device ที่ register สำเร็จ / ทั้งหมด | > 99% |
| **Command Success Rate** | คำสั่งที่สำเร็จ / ทั้งหมด | > 99% |
| **Command Latency (avg)** | เวลารอ response เฉลี่ย | < 100ms |
| **Command Latency (p99)** | เวลารอ response 99th percentile | < 500ms |
| **Message Drop Rate** | ข้อความที่สูญหาย / ทั้งหมด | < 0.1% |
| **Memory Usage** | RAM ที่ใช้โดย Backend | คงที่ไม่เพิ่มขึ้น |
| **CPU Usage** | CPU ที่ใช้ | < 70% |
| **Connection Stability** | จำนวน reconnect / ชั่วโมง | < 1 |

---

**Next**: [Device Mocking Detail](./device-mocking) → (รายละเอียดโค้ดตัวอย่าง)
