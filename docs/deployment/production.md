# Production Deployment

Production deployment considerations.

## Environment Variables

```env
SERVER_PORT=443
DB_HOST=production-db.example.com
DB_SSLMODE=require
JWT_SECRET=<strong-random-secret>
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

## Security

- Enable SSL/TLS
- Use strong passwords
- Enable firewall
- Regular updates

## Monitoring

- Application logs
- Database backups
- Health checks
- Performance metrics

---

**Previous**: [Docker Compose](./docker-compose.md) | **[Complete Deployment Guide](./docker.md)**
