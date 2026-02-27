# JWT Authentication

Backend JWT authentication system using username/password.

## Overview

The system uses JWT (JSON Web Tokens) for API authentication:

1. User provides username and password
2. Backend validates credentials (bcrypt password comparison)
3. Backend returns JWT token
4. Client includes JWT token in subsequent requests

## JWT Configuration

### Token Claims

```go
claims := jwt.MapClaims{
    "user_id": user.ID,
    "exp":     time.Now().Add(time.Hour * 72).Unix(),
}
```

**Claims**:
- `user_id`: User's database ID
- `exp`: Expiration time (72 hours from issue)

### Token Lifetime

- **Access Token**: 72 hours (3 days)

## Authentication Flow

### 1. Login

**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response (Success)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error)**:
- `400 Bad Request`: Invalid JSON
- `401 Unauthorized`: Invalid credentials

### 2. Register

**Endpoint**: `POST /api/auth/register`

**Request**:
```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response**:
- `201 Created`: User created successfully
- `400 Bad Request`: Invalid JSON
- `500 Internal Server Error`: Database error

### 3. Protected Endpoints

Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Implementation

### Auth Handler

```go
// internal/auth/handler.go
type AuthHandler struct {
    authService *AuthService
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
    user := new(UserAccount)
    if err := c.BodyParser(user); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "cannot parse JSON",
        })
    }
    
    token, err := h.authService.Login(user.Username, user.Password)
    if err != nil {
        return c.SendStatus(fiber.StatusUnauthorized)
    }

    return c.JSON(fiber.Map{
        "token": token,
    })
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
    user := new(UserAccount)
    if err := c.BodyParser(user); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "cannot parse JSON",
        })
    }
    
    err := h.authService.Register(user.Username, user.Password)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": "cannot register user",
        })
    }
    
    return c.SendStatus(fiber.StatusCreated)
}
```

### Auth Service

```go
// internal/auth/service.go
type AuthService struct {
    repo *Repository
}

func (s *AuthService) Login(username, password string) (string, error) {
    user, err := s.repo.getByUsername(username)
    if err != nil {
        return "", err
    }

    // Verify password with bcrypt
    if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
        return "", err
    }

    // Generate JWT
    claims := jwt.MapClaims{
        "user_id": user.ID,
        "exp":     time.Now().Add(time.Hour * 72).Unix(),
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

    return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}

func (s *AuthService) Register(username, password string) error {
    // Hash password with bcrypt
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }
    
    user := &UserAccount{
        Username: username,
        Password: string(hashedPassword),
    }
    return s.repo.createUser(user)
}
```

### JWT Middleware

```go
// internal/middleware/jwt_middleware.go
func JWTMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        authHeader := c.Get("Authorization")
        if authHeader == "" {
            return c.Status(401).JSON(fiber.Map{"error": "Missing token"})
        }

        tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
        }

        claims := token.Claims.(jwt.MapClaims)
        c.Locals("user_id", claims["user_id"])

        return c.Next()
    }
}
```

### Models

```go
// internal/auth/model.go
type UserAccount struct {
    ID       uint   `gorm:"primaryKey"`
    Username string `gorm:"unique"`
    Password string
}
```

## Security Considerations

### Password Hashing

- Passwords are hashed using **bcrypt** with default cost (10)
- Never store plain text passwords
- Unique username constraint prevents duplicates

### JWT Security

- Store JWT secret in environment variable (`JWT_SECRET`)
- Use strong, random secret (minimum 256 bits)
- Token expires after 72 hours
- Validate token on every protected request
- Use HTTPS in production

### Environment Variables

```env
JWT_SECRET=your-secret-key-here
```

## Protected Routes Example

```go
// cmd/app/router.go
func SetupRoutes(app *fiber.App, handlers *AppHandlers) {
    // Public routes
    authGroup := app.Group("/api/auth")
    authGroup.Post("/login", handlers.Auth.Login)
    authGroup.Post("/register", handlers.Auth.Register)
    
    // Protected routes
    api := app.Group("/api", middleware.JWTMiddleware())
    
    devices := api.Group("/devices")
    devices.Get("/", handlers.Device.ListDevices)
    // ...
}
```

## Testing

### Login Test

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass"
  }'
```

### Access Protected Endpoint

```bash
curl http://localhost:3000/api/devices \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

**Previous**: [Infrastructure Layer](./infrastructure-layer) | **Next**: [MQTT Integration](./mqtt) →
