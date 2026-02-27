# Installation Guide

วิธีการติดตั้งและตั้งค่าระบบ PM IoT ทั้ง Frontend และ Backend

Step-by-step installation and setup guide for the PM IoT System.

## 📋 Prerequisites

### Required Software

| Component | Minimum Version | Download Link |
|-----------|----------------|---------------|
| Flutter SDK | 3.7.0+ | [flutter.dev](https://flutter.dev/docs/get-started/install) |
| Go | 1.25+ | [golang.org](https://go.dev/dl/) |
| PostgreSQL | 13+ | [postgresql.org](https://www.postgresql.org/download/) |
| MQTT Broker | Latest | [mosquitto.org](https://mosquitto.org/download/) |
| Git | Latest | [git-scm.com](https://git-scm.com/downloads) |

### Development Tools (Optional)

- **VS Code** or **Android Studio** for Flutter development
- **GoLand** or **VS Code** with Go extension for backend development
- **Postman** or **cURL** for API testing
- **MQTT Explorer** for MQTT testing

## 🚀 Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/your-org/project-management-iot.git
cd project-management-iot
```

Project structure:
```
project-management-iot/
├── PM_Mobile_Frontend/      # Flutter mobile app
├── project-management-backend/  # Go backend API
└── docs/                     # Documentation (you are here)
```

### 2. Backend Setup

#### 2.1 Install Go Dependencies

```bash
cd project-management-backend
go mod download
```

#### 2.2 Configure Environment

Create `.env` file from example:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=pm_iot

# MQTT
MQTT_BROKER=tcp://localhost:1883

# JWT
JWT_SECRET=your_secret_key_here

# Firebase (for verification)
FIREBASE_PROJECT_ID=your_project_id
```

#### 2.3 Setup Database

```bash
# Create database
createdb pm_iot

# Run migrations (handled automatically on first run)
# Or manually:
psql pm_iot < schema.sql
```

#### 2.4 Start Backend

```bash
# Development mode
go run cmd/app/main.go

# Or build and run
go build -o main cmd/app/main.go
./main
```

Backend will start on `http://localhost:3000`

### 3. Frontend Setup

#### 3.1 Install Flutter Dependencies

```bash
cd ../PM_Mobile_Frontend
flutter pub get
```

#### 3.2 Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Backend API URL
BACKEND_API_URL=http://localhost:3000

# Firebase Configuration (from Firebase Console)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

#### 3.3 Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → **Google** sign-in provider
4. Add your Flutter app to the project
5. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
6. Place them in the appropriate folders

#### 3.4 Run Flutter App

```bash
# Check connected devices
flutter devices

# Run on connected device/emulator
flutter run

# Or specific platform
flutter run -d chrome         # Web
flutter run -d windows        # Windows
flutter run -d macos          # macOS
```

### 4. MQTT Broker Setup

#### Using Mosquitto (Windows)

1. Download and install [Mosquitto](https://mosquitto.org/download/)
2. Start the broker:

```bash
mosquitto -v
```

Default port: `1883`

#### Using Docker

```bash
docker run -it -p 1883:1883 eclipse-mosquitto:2
```

## ✅ Verification

### Test Backend API

```bash
curl http://localhost:3000/
# Should return: Hello, World!
```

### Test MQTT Connection

```bash
# Subscribe to test topic
mosquitto_sub -h localhost -t "test/topic"

# Publish to test topic
mosquitto_pub -h localhost -t "test/topic" -m "Hello MQTT"
```

### Test Frontend Connection

1. Open the Flutter app
2. Click "Sign in with Google"
3. Complete Google authentication
4. You should see the home screen with room/device options

## 🔧 Troubleshooting

### Backend Issues

**Problem**: `database connection failed`

**Solution**:
```bash
# Check PostgreSQL is running
pg_ctl status

# Check connection
psql -U postgres -d pm_iot
```

**Problem**: `MQTT connection failed`

**Solution**:
```bash
# Check Mosquitto is running
# Windows: Check Services
# Or test connection:
telnet localhost 1883
```

### Frontend Issues

**Problem**: `Firebase authentication failed`

**Solution**:
- Verify SHA-1/SHA-256 fingerprints in Firebase Console
- Check `.env` configuration
- Enable Google Sign-In in Firebase Console

**Problem**: `API connection refused`

**Solution**:
- Verify backend is running on port 3000
- Check `BACKEND_API_URL` in `.env`
- For Android emulator, use `http://10.0.2.2:3000`
- For iOS simulator, use `http://localhost:3000`

## 📚 Next Steps

- **[Configuration Guide](./configuration)** - Detailed configuration options
- **[Architecture Overview](../architecture/overview)** - Understanding the system
- **[API Reference](../api/overview)** - API endpoints documentation

## 🆘 Need Help?

- Check [Troubleshooting Guide](../development/troubleshooting)
- Open an issue on GitHub
- Contact the development team

---

**Previous**: [Introduction](./introduction) | **Next**: [Configuration](./configuration) →
