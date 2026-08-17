# API Contract

Base URL (local dev): `http://localhost:5000`

All request/response bodies are JSON. All protected routes require an `Authorization: Bearer <accessToken>` header.

---

## Auth

### `POST /api/auth/register`

Creates a new user account.

**Request body:**
```json
{
  "name": "Test Patient",
  "email": "patient@test.com",
  "password": "password123",
  "role": "PATIENT"
}
```
- `role` must be one of: `PATIENT`, `PRACTITIONER`, `ADMIN`
- `password` must be at least 8 characters

**Success response — `201 Created`:**
```json
{
  "user": {
    "id": "c46a738c-b042-492c-9684-4d90ac9c1424",
    "email": "patient@test.com",
    "role": "PATIENT",
    "name": "Test Patient",
    "createdAt": "2026-08-17T16:34:45.842Z"
  }
}
```
Note: the password is never returned, hashed or otherwise.

**Error responses:**
- `400 Bad Request` — validation failed (bad email format, short password, missing field, etc.):
```json
{
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```
- `409 Conflict` — email already registered:
```json
{ "message": "Email already in use" }
```

---

### `POST /api/auth/login`

Authenticates an existing user and issues tokens.

**Request body:**
```json
{
  "email": "patient@test.com",
  "password": "password123"
}
```

**Success response — `200 OK`:**
```json
{
  "user": {
    "id": "c46a738c-b042-492c-9684-4d90ac9c1424",
    "email": "patient@test.com",
    "role": "PATIENT",
    "name": "Test Patient",
    "createdAt": "2026-08-17T16:34:45.842Z"
  },
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```
- `accessToken` expires in 15 minutes — send it on every subsequent request to a protected route
- `refreshToken` expires in 7 days — not yet consumed by any endpoint (a `/api/auth/refresh` endpoint is planned for a future phase)

**Error response:**
- `401 Unauthorized` — wrong email or password (same message for both, deliberately, to avoid leaking which emails are registered):
```json
{ "message": "Invalid email or password" }
```

---

### `GET /api/auth/me`

Returns the decoded identity of the currently authenticated user. Requires a valid access token.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success response — `200 OK`:**
```json
{
  "user": {
    "id": "c46a738c-b042-492c-9684-4d90ac9c1424",
    "role": "PATIENT",
    "iat": 1786984798,
    "exp": 1786985698
  }
}
```
Note: this is the raw token payload (id + role + issued-at/expiry timestamps), not a full database lookup.

**Error responses:**
- `401 Unauthorized` — missing header:
```json
{ "message": "No token provided" }
```
- `401 Unauthorized` — invalid or expired token:
```json
{ "message": "Invalid or expired token" }
```

---

### `GET /api/auth/admin-only`

Example route demonstrating role-gated access. Requires a valid access token **and** the `ADMIN` role.

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success response — `200 OK`:**
```json
{ "message": "Welcome, admin" }
```

**Error response:**
- `403 Forbidden` — valid token, but wrong role:
```json
{ "message": "Access denied" }
```

---

## Status code summary

| Code | Meaning | Used when |
|---|---|---|
| 200 | OK | Successful login, or a successful GET |
| 201 | Created | Successful registration |
| 400 | Bad Request | Request body failed validation |
| 401 | Unauthorized | Missing/invalid/expired token, or bad login credentials |
| 403 | Forbidden | Valid token, but role not permitted |
| 409 | Conflict | Email already registered |
| 500 | Internal Server Error | Unexpected server-side error |
