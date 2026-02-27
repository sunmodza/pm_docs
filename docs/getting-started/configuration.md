# Configuration Guide

คำแนะนำการตั้งค่าและปรับแต่งระบบ PM IoT

Configuration and customization guide for the PM IoT System.

## 🔧 Backend Configuration

### Environment Variables (.env)

```env
# ==========================================
# DATABASE CONFIGURATION
# ==========================================
DB_HOST=localhost
DB_PORT=5432
DB_USER=pm_user
DB_PASSWORD=secure_password
DB_NAME=pm_iot
DB_SSLMODE=disable

# ==========================================
# MQTT BROKER CONFIGURATION
# ==========================================
MQTT_BROKER=tcp://localhost:1883
MQTT_CLIENT_ID=go-backend-server
MQTT_QOS=1

# ==========================================
# JWT AUTHENTICATION
# ==========================================
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=168h

# ==========================================
# FIREBASE CONFIGURATION
# ==========================================
FIREBASE_PROJECT_ID=your_firebase_project
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/serviceAccountKey.json

# ==========================================
# SERVER CONFIGURATION
# ==========================================
SERVER_PORT=3000
SERVER_HOST=0.0.0.0

# ==========================================
# CORS CONFIGURATION
# ==========================================
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080,exp://192.168.*:*
```

### Database Configuration

#### PostgreSQL Setup

```sql
-- Create database
CREATE DATABASE pm_iot;

-- Create user
CREATE USER pm_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE pm_iot TO pm_user;

-- Connect to database
\c pm_iot

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO pm_user;
```

#### Connection Pool Settings

In `internal/database/database.go`:

```go
sqlDB, err := gormDB.DB()
if err != nil {
    return nil
}

// Connection pool settings
sqlDB.SetMaxIdleConns(10)
sqlDB.SetMaxOpenConns(100)
sqlDB.SetConnMaxLifetime(time.Hour)
```

### MQTT Configuration

#### Topic Structure

```
devices/register                    # Device registration
device/{device_id}/sensor           # Sensor data publish
device/{device_id}/command          # Command to device
device/{device_id}/response         # Device response
```

#### QoS Levels

- **QoS 0**: Fire and forget (test messages)
- **QoS 1**: At least once (device commands)
- **QoS 2**: Exactly once (critical operations)

## 📱 Frontend Configuration

### Environment Variables (.env)

```env
# ==========================================
# API CONFIGURATION
# ==========================================
BACKEND_API_URL=http://localhost:3000
API_TIMEOUT=30000

# ==========================================
# FIREBASE CONFIGURATION
# ==========================================
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=1:your-app-id

# ==========================================
# POLLING CONFIGURATION
# ==========================================
POLLING_INTERVAL_SENSOR=1000     # 1 second
POLLING_INTERVAL_FULL=5000       # 5 seconds
PENDING_VALUE_TTL=10000          # 10 seconds

# ==========================================
# UI CONFIGURATION
# ==========================================
DEFAULT_THEME=light
ANIMATION_DURATION=300
```

### Platform-Specific Configuration

#### Android (`android/app/build.gradle`)

```gradle
android {
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }

    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt')
        }
    }
}
```

#### iOS (`ios/Runner/Info.plist`)

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.123456</string>
        </array>
    </dict>
</array>
```

## 🚀 Production Configuration

### Backend Production Settings

```env
# Use production database
DB_HOST=production-db.example.com
DB_SSLMODE=require

# Strong JWT secret
JWT_SECRET=<generate-strong-secret>

# Production MQTT
MQTT_BROKER=tcp://mqtt.example.com:1883

# Enable HTTPS
SERVER_PORT=443
TLS_CERT=/path/to/cert.pem
TLS_KEY=/path/to/key.pem
```

### Frontend Production Build

```bash
# Android
flutter build apk --release
flutter build appbundle --release

# iOS
flutter build ios --release

# Web
flutter build web --release
```

### Firebase Production Setup

1. **Create production Firebase project**
2. **Add production apps** with correct bundle identifiers
3. **Configure production SHA fingerprints**
4. **Enable required Firebase services**:
   - Authentication (Google Sign-In)
   - Firestore (if needed)
   - Cloud Messaging (if needed)
   - Crashlytics (recommended)

## 🔒 Security Configuration

### JWT Best Practices

```go
// Generate secure JWT secret
func generateSecret() string {
    b := make([]byte, 32)
    rand.Read(b)
    return hex.EncodeToString(b)
}
```

### Database Security

```sql
-- Enable SSL
ALTER DATABASE pm_iot SET sslmode = require;

-- Create read-only user for monitoring
CREATE USER pm_readonly WITH PASSWORD 'readonly_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pm_readonly;
```

### CORS Configuration

```go
app.Use(cors.New(cors.Config{
    AllowOrigins:     strings.Split(os.Getenv("CORS_ALLOWED_ORIGINS"), ","),
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH"},
    AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
    ExposeHeaders:    []string{"Content-Length"},
    AllowCredentials: true,
    MaxAge:          12 * time.Hour,
}))
```

## 📊 Monitoring Configuration

### Logging Configuration

```go
// Configure structured logging
logger := logrus.New()
logger.SetFormatter(&logrus.JSONFormatter{})
logger.SetLevel(logrus.InfoLevel)

// Production
logger.SetLevel(logrus.WarnLevel)
```

### Health Check Endpoint

```go
app.Get("/health", func(c *fiber.Ctx) error {
    return c.JSON(fiber.Map{
        "status": "healthy",
        "timestamp": time.Now(),
        "database": checkDatabase(),
        "mqtt": checkMQTT(),
    })
})
```

## 🧪 Testing Configuration

### Backend Test Configuration

```go
// tests/integration/setup.go
testDB, _ := sql.Open("postgres", "postgres://test_user@test_db/pm_iot_test")
migrations.Up(testDB)
```

### Frontend Test Configuration

```dart
// test_config.dart
const testConfig = {
  'BACKEND_API_URL': 'http://localhost:3001', // Test server
  'POLLING_INTERVAL_SENSOR': 100,
  'POLLING_INTERVAL_FULL': 500,
};
```

## 📝 Configuration Checklist

### Pre-Production Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT secret
- [ ] Configure production database
- [ ] Set up production MQTT broker
- [ ] Configure Firebase production project
- [ ] Enable SSL/TLS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Review CORS settings
- [ ] Test all authentication flows
- [ ] Verify MQTT connections
- [ ] Test API endpoints

---

**Previous**: [Installation](./installation) | **Next**: [Architecture Overview](../architecture/overview) →
