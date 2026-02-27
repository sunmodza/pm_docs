# Deployment Guide

Complete deployment guide for PM IoT System.

## Docker Deployment

### Backend Dockerfile
```dockerfile
FROM golang:1.25-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o main cmd/app/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 3000
CMD ["./main"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./project-management-backend
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=postgres
      - MQTT_BROKER=tcp://mqtt:1883
    depends_on:
      - postgres
      - mqtt

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: pm_iot
      POSTGRES_USER: pm_user
      POSTGRES_PASSWORD: pm_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mqtt:
    image: eclipse-mosquitto:2
    ports:
      - "1883:1883"
    volumes:
      - mqtt_config:/mosquitto/config

volumes:
  postgres_data:
  mqtt_config:
```

## Production Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable SSL/TLS
- [ ] Configure backups
- [ ] Set up monitoring
- [ ] Configure CDN for Flutter app
- [ ] Use production Firebase project
- [ ] Enable rate limiting
- [ ] Set up logging

---

**Previous**: [MQTT Topics](../mqtt/topics) | **Next**: [Contributing](../development/contributing) →
