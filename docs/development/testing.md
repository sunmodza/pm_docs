# Testing Strategies

Testing guidelines for the project.

## Backend Testing

### Unit Tests
```bash
go test ./...
go test -v ./...
go test -cover ./...
```

### Integration Tests
```bash
go test -tags=integration ./...
```

## Frontend Testing

### Unit Tests
```bash
flutter test
flutter test --coverage
```

### Widget Tests
```bash
flutter test test/widget/
```

### E2E Tests
```bash
flutter test integration_test/
```

## Coverage Goals

- **Backend**: >80% coverage
- **Frontend**: >70% coverage

---

**Previous**: [Code Style](./code-style) | **Next**: [Device Mocking Overview](./device-mocking-overview) →
