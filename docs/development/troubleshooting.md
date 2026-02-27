# Troubleshooting

Common issues and solutions.

## Backend Issues

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_ctl status

# Check connection
psql -U postgres -d pm_iot
```

### MQTT Connection Failed
```bash
# Check Mosquitto
netstat -an | grep 1883

# Test connection
mosquitto_sub -h localhost -t test/topic
```

## Frontend Issues

### Firebase Auth Failed
- Verify SHA fingerprints
- Check Firebase configuration
- Enable Google Sign-In in Firebase Console

### API Connection Refused
- Verify backend is running
- Check BACKEND_API_URL in .env
- For Android emulator: use `http://10.0.2.2:3000`

## Build Issues

### Flutter Build Failed
```bash
flutter clean
flutter pub get
flutter run
```

---

**Previous**: [Testing](./testing) | **[Complete Development Guide](./contributing)**
