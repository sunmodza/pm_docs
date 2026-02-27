# Development Guidelines

Contributing and development guidelines.

## Code Style

### Go Guidelines
- Use `gofmt` for formatting
- Exported functions must have comments
- Handle errors explicitly
- Use meaningful variable names

### Dart Guidelines
- Follow effective dart guidelines
- Use `dart format` for formatting
- Document public APIs
- Use async/await properly

## Testing

### Backend Tests
```bash
go test ./...
go test -v -cover ./...
```

### Frontend Tests
```bash
flutter test
flutter test --coverage
```

## Git Workflow

1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## Commits

```
feat: Add device registration flow
fix: Resolve MQTT connection issue
docs: Update API documentation
refactor: Improve widget repository
test: Add unit tests for auth
```

---

**Previous**: [Code Style](./code-style) | **Next**: [Testing](./testing) →
