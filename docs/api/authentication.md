# Authentication API

Authentication endpoints for user management.

## POST /api/auth/register
Register a new user account.

### Request
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

### Response (201)
```json
{
  "user_id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "USER",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## POST /api/auth/login
Login with Firebase ID token.

### Request
```json
{
  "id_token": "firebase_id_token_here"
}
```

### Response (200)
```json
{
  "token": "jwt_token_here",
  "user": {
    "user_id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

**Previous**: [API Overview](./overview) | **Next**: [Devices API](./devices) →
