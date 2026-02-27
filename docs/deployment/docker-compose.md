# Docker Compose Setup

Complete Docker Compose configuration.

## docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./project-management-backend
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=pm_user
      - DB_PASSWORD=pm_password
      - DB_NAME=pm_iot
      - MQTT_BROKER=tcp://mqtt:1883
      - JWT_SECRET=your_secret_here
      - FIREBASE_PROJECT_ID=your_project_id
    depends_on:
      - postgres
      - mqtt
    networks:
      - pm-network

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: pm_iot
      POSTGRES_USER: pm_user
      POSTGRES_PASSWORD: pm_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - pm-network

  mqtt:
    image: eclipse-mosquitto:2
    ports:
      - "1883:1883"
    networks:
      - pm-network

volumes:
  postgres_data:

networks:
  pm-network:
    driver: bridge
```

## Usage

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

---

**Previous**: [Docker](./docker.md) | **Next**: [Production Setup](./production) →
