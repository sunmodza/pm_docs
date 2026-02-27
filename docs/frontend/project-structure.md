# Frontend Project Structure

โครงสร้างโปรเจค Flutter Frontend อย่างละเอียด

Detailed structure of the Flutter Frontend project.

## 📁 Complete File Tree

```
PM_Mobile_Frontend/
├── lib/
│   ├── main.dart                          # Application entry point
│   │
│   ├── data/                              # Data layer (repositories)
│   │   ├── device_repository.dart          # Device data access
│   │   ├── room_repository.dart            # Room data access
│   │   └── widget_repository.dart          # Widget data access
│   │
│   └── features/                           # Feature modules
│       │
│       ├── auth/                           # Authentication feature
│       │   ├── bloc/
│       │   │   ├── auth_bloc.dart           # Auth BLoC
│       │   │   ├── auth_event.dart          # Auth events
│       │   │   └── auth_state.dart          # Auth states
│       │   ├── data/
│       │   │   ├── auth_api.dart            # Auth API client
│       │   │   ├── auth_repository.dart     # Auth repository
│       │   │   └── token_storage.dart       # Token storage service
│       │   └── ui/
│       │       ├── pages/
│       │       │   └── sign_in_page.dart     # Sign-in screen
│       │       └── widgets/
│       │           ├── auth_background.dart  # Background widget
│       │           └── pill_text_field.dart  # Custom text field
│       │
│       ├── home/                           # Home screen feature
│       │   ├── bloc/
│       │   │   ├── devices_bloc.dart        # Devices BLoC
│       │   │   ├── devices_event.dart       # Device events
│       │   │   └── devices_state.dart       # Device states
│       │   ├── data/
│       │   │   └── widget_repository.dart    # Widget repository
│       │   ├── models/
│       │   │   ├── device.dart              # Device model
│       │   │   ├── device_widget.dart       # Widget model
│       │   │   ├── room.dart                # Room model
│       │   │   ├── capability.dart         # Capability model
│       │   │   ├── sensor_history.dart      # Sensor history model
│       │   │   └── sensor_log.dart          # Sensor log model
│       │   └── ui/
│       │       ├── pages/
│       │       │   ├── home_page.dart        # Main home screen
│       │       │   ├── add_device_page.dart  # Add device screen
│       │       │   └── sensor_detail_page.dart # Sensor detail view
│       │       ├── widgets/
│       │       │   ├── components/
│       │       │   │   ├── home_widget_grid.dart    # Widget grid
│       │       │   │   ├── room_selector.dart       # Room dropdown
│       │       │   │   └── top_tabs.dart            # Top tab bar
│       │       │   ├── cards/
│       │       │   │   ├── device_card.dart         # Device card
│       │       │   │   ├── sensor_card.dart         # Sensor card
│       │       │   │   └── widget_card.dart         # Widget card
│       │       │   ├── bottom_sheets/
│       │       │   │   ├── home_actions_sheet.dart  # Action menu
│       │       │   │   ├── widget_picker_sheet.dart  # Widget picker
│       │       │   │   └── mode_picker_sheet.dart    # Mode selector
│       │       │   ├── dialogs/
│       │       │   │   └── text_command_dialog.dart  # Text input dialog
│       │       │   └── charts/
│       │       │       └── sensor_chart.dart          # Sensor data chart
│       │       └── view_models/
│       │           └── home_view_model.dart           # Home view model
│       │
│       ├── device/                         # Device management
│       │   ├── device_setup_page.dart        # Device setup screen
│       │   └── manage_devices_page.dart     # Device list screen
│       │
│       ├── room/                           # Room management
│       │   ├── bloc/
│       │   │   ├── rooms_bloc.dart          # Rooms BLoC
│       │   │   ├── rooms_event.dart         # Room events
│       │   │   └── rooms_state.dart         # Room states
│       │   ├── data/
│       │   │   └── room_repository.dart      # Room repository
│       │   └── ui/
│       │       └── pages/
│       │           └── manage_homes_page.dart # Room management screen
│       │
│       └── me/                             # User profile
│           └── me_page.dart                # Profile screen
│
├── .env                                   # Environment variables
├── pubspec.yaml                           # Dependencies
└── firebase_options.dart                  # Firebase configuration
```

## 🎯 Feature Modules

### 1. Authentication Module

**Purpose**: Handle user authentication

**Key Files**:
- `auth_bloc.dart` - Authentication state management
- `sign_in_page.dart` - Sign-in UI
- `auth_repository.dart` - Auth data access

**Flow**:
```dart
Firebase Sign-In → ID Token → Backend API → JWT → Secure Storage
```

### 2. Home Module

**Purpose**: Main dashboard and widget management

**Key Files**:
- `devices_bloc.dart` - Device and widget state
- `home_page.dart` - Home screen UI
- `widget_repository.dart` - Widget data access

**Flow**:
```dart
Load Widgets → Display Grid → User Interaction → Send Command → Update UI
```

### 3. Device Module

**Purpose**: Device setup and management

**Key Files**:
- `device_setup_page.dart` - Add new device
- `manage_devices_page.dart` - Device list

### 4. Room Module

**Purpose**: Room creation and management

**Key Files**:
- `rooms_bloc.dart` - Room state management
- `manage_homes_page.dart` - Room management UI

## 📦 Data Layer

### Repository Pattern

```
Repository Interface
    ↓
Repository Implementation
    ↓
API Client
    ↓
HTTP Request
```

### Example: DeviceRepository

```dart
class DeviceRepository {
  final String baseUrl;
  final http.Client httpClient;

  Future<List<Device>> fetchDevices() async {
    final response = await httpClient.get(
      Uri.parse('$baseUrl/api/devices'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      final List<dynamic> json = jsonDecode(response.body);
      return json.map((e) => Device.fromJson(e)).toList();
    }

    throw Exception('Failed to load devices');
  }
}
```

## 🎨 UI Layer

### Widget Tree Structure

```dart
MyApp
└── MaterialApp
    └── AuthGate (StreamBuilder)
        ├── SignInPage (if unauthenticated)
        └── HomePage (if authenticated)
            ├── Scaffold
            │   ├── AppBar
            │   │   ├── RoomSelector
            │   │   └── TopTabs
            │   ├── Body
            │   │   └── HomeWidgetGrid
            │   │       └── [WidgetCard, ...]
            │   └── FloatingActionButton
            └── BottomSheet
```

### Page Structure

**HomePage**:
```dart
Scaffold(
  appBar: AppBar(
    title: RoomSelector(),
    actions: [HomeActions()],
  ),
  body: HomeWidgetGrid(),
  floatingActionButton: FloatingActionButton(
    onPressed: () => showAddMenu(),
  ),
)
```

## 🔧 Configuration Files

### pubspec.yaml

```yaml
name: pm_mobile_frontend
description: A new Flutter project.

environment:
  sdk: ^3.7.0

dependencies:
  flutter:
    sdk: flutter

  # State Management
  flutter_bloc: ^9.1.1
  equatable: ^2.0.8

  # Authentication
  firebase_core: ^2.27.0
  firebase_ui_auth: ^1.13.0
  firebase_ui_oauth_google: ^1.3.2
  firebase_auth: ^4.20.0
  google_sign_in: ^6.3.0
  flutter_secure_storage: ^9.2.2

  # UI Components
  flutter_svg: ^2.2.2
  reorderables: ^0.6.0

  # Utilities
  flutter_dotenv: ^5.1.0
```

### .env

```env
BACKEND_API_URL=http://localhost:3000

FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

## 🔄 Communication Flow

### Between Modules

```
Auth Module (Firebase)
    ↓
JWT Token
    ↓
All Modules (API Headers)
```

### Within Modules

```
UI Widget
    ↓
Event (User Action)
    ↓
BLoC (State Management)
    ↓
Repository (Data Access)
    ↓
API Client (HTTP Request)
    ↓
Backend API
```

## 📱 Platform-Specific Code

### Android

```
android/
├── app/
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── kotlin/ (if using Kotlin)
│       └── res/ (resources)
├── build.gradle
└── google-services.json
```

### iOS

```
ios/
├── Runner/
│   ├── Info.plist
│   ├── AppDelegate.swift
│   └── GoogleService-Info.plist
└── Runner.xcworkspace
```

## 🧪 Testing Structure

```
test/
├── features/
│   ├── auth/
│   │   ├── bloc/
│   │   │   ├── auth_bloc_test.dart
│   │   │   └── auth_state_test.dart
│   │   └── data/
│   │       └── auth_repository_test.dart
│   └── home/
│       └── bloc/
│           └── devices_bloc_test.dart
└── unit/
    └── models/
        └── device_test.dart
```

## 📊 File Organization Principles

### 1. Feature-Based Organization

```
✅ GOOD: features/auth, features/home
❌ BAD: screens, models, services
```

### 2. barrel exports (index.dart)

```dart
// features/auth/auth.dart
export 'bloc/auth_bloc.dart';
export 'data/auth_repository.dart';
export 'ui/pages/sign_in_page.dart';
```

### 3. Clear Separation

```
bloc/    - State logic
data/    - Data access
ui/      - UI components
models/  - Data models
```

## 🚀 Build Outputs

### Debug Build
```
build/
└── app/
    └── intermediates/
        └── ...
```

### Release Build
```
build/
└── app/
    └── outputs/
        ├── flutter-apk/
        │   └── app-release.apk
        └── app-bundle/
            └── app-release.aab
```

---

**Previous**: [Introduction](./intro) | **Next**: [BLoC Pattern](./bloc-pattern) →
