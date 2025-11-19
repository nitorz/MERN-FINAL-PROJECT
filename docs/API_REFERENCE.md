# API Reference

## Auth
- POST /api/auth/register
  - body: { name, email, password }
  - returns: user

- POST /api/auth/login
  - body: { email, password }
  - returns: { token }

## Habits
- GET /api/habits
  - returns: [habits]
- POST /api/habits (protected)
  - headers: Authorization: Bearer <token>
  - body: { title, category? }
  - returns: habit
