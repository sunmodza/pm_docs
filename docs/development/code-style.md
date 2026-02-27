# Code Style Guidelines

Coding standards for Go and Dart/Flutter.

## Go Style Guide

### Formatting
- Use `gofmt` for all code
- Maximum line length: 120 characters
- Use tabs for indentation

### Naming
- PascalCase for exported
- camelCase for private
- Constant: PascalCase or UPPER_SNAKE_CASE

### Example
```go
// ✅ Good
type DeviceService struct {}
func GetDeviceByID(id string) (*Device, error) {}
const MaxRetries = 3

// ❌ Bad
type deviceService struct {}
func get_device_by_id(id string) (*Device, error) {}
const MAX_RETRIES = 3
```

## Dart Style Guide

### Formatting
- Use `dart format`
- Maximum line length: 80 characters
- Use 2 spaces for indentation

### Naming
- camelCase for variables and methods
- PascalCase for types and classes
- lowercase_with_underscores for private

### Example
```dart
// ✅ Good
class DeviceService {}
Device getDeviceById(String id) {}
const maxRetries = 3;

// ❌ Bad
class deviceService {}
Device Get_Device_By_Id(String id) {}
const MAX_RETRIES = 3;
```

---

**Previous**: [Contributing](./contributing) | **Next**: [Testing Guidelines](./testing) →
