# JWT Authentication

JWT-based authentication system.

## Token Generation

```go
func generateJWT(user *User) (string, error) {
    claims := jwt.MapClaims{
        "user_id": user.ID,
        "email":   user.Email,
        "name":    user.Name,
        "role":    user.Role,
        "iat":     time.Now().Unix(),
        "exp":     time.Now().Add(24 * time.Hour).Unix(),
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
```

## Middleware

```go
func JWTMiddleware() fiber.Handler {
    return func(c *fiber.Ctx) error {
        authHeader := c.Get("Authorization")
        token := strings.TrimPrefix(authHeader, "Bearer ")

        claims, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
        }

        c.Locals("user_id", claims.(jwt.MapClaims)["user_id"])
        return c.Next()
    }
}
```

---

**Previous**: [MQTT](./mqtt) | **[Complete Backend Docs](./intro)**
