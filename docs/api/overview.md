# API Overview

REST API endpoints reference for PM IoT System.

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.yourdomain.com/api
```

## Authentication Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message description"
}
```

---

**Next**: [Authentication Endpoints](./authentication) →
