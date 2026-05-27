# QuickPool API Contract

Base URL:

```text
http://localhost:5000/api
```

Authentication:

Protected routes require a JWT token:

```http
Authorization: Bearer <token>
```

---

# Authentication

## Send OTP

```http
POST /auth/send-otp
```

Description:
Send OTP to the user's email.

Request:

```json
{
  "email": "user@example.com"
}
```

Response:

```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

---

## Verify OTP

```http
POST /auth/verify-otp
```

Description:
Verifies OTP and logs user in.

Request:

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

Response:

```json
{
  "success": true,
  "token": "jwt_token",
  "user": {}
}
```

---

## Logout

```http
POST /auth/logout
```

Description:
Logs user out.

Response:

```json
{
  "success": true,
  "message": "Logged out"
}
```

---

# User Management

## Get Current User

```http
GET /users/me
```

Response:

```json
{
  "user": {}
}
```

---

## Update User Information

```http
PUT /users/me
```

Request:

```json
{
  "name": "Rishi",
  "avatar": "avatar1.png"
}
```

Response:

```json
{
  "success": true,
  "user": {}
}
```

---

## Get User Ride History

```http
GET /users/me/history
```

Response:

```json
{
  "history": []
}
```

---

# Route Management

## Create Route

```http
POST /routes
```

Request:

```json
{
  "source": "Location A",
  "destination": "Location B",
  "time": "2026-05-27T18:00:00Z"
}
```

Response:

```json
{
  "success": true,
  "route": {}
}
```

---

## Get All Routes

```http
GET /routes
```

Response:

```json
{
  "routes": []
}
```

---

## Get Route by ID

```http
GET /routes/:routeId
```

Response:

```json
{
  "route": {}
}
```

---

## Delete Route

```http
DELETE /routes/:routeId
```

Response:

```json
{
  "success": true
}
```

---

# User Route Management

## Join Route

```http
POST /routes/:routeId/join
```

Response:

```json
{
  "success": true
}
```

---

## Leave Route

```http
POST /routes/:routeId/leave
```

Response:

```json
{
  "success": true
}
```

---

## Queue Information

```http
GET /routes/:routeId/queue
```

Response:

```json
{
  "position": 3,
  "estimatedWait": "5 mins"
}
```

---

# Group Management

## Get Current Group

```http
GET /groups/current
```

Response:

```json
{
  "group": {}
}
```

---

## Get Group Details

```http
GET /groups/:groupId
```

Response:

```json
{
  "group": {},
  "members": []
}
```

---

## Leave Group

```http
POST /groups/:groupId/leave
```

Response:

```json
{
  "success": true
}
```

---

## Swap / Avoid Pairing

```http
POST /groups/:groupId/swap
```

Request:

```json
{
  "userId": "abc123"
}
```

Response:

```json
{
  "success": true
}
```

---

# No Show Reporting

## Report No Show

```http
POST /groups/:groupId/report
```

Request:

```json
{
  "reportedUserId": "abc123"
}
```

Response:

```json
{
  "success": true
}
```

---

## Report Status

```http
GET /groups/:groupId/report-status
```

Response:

```json
{
  "status": "pending"
}
```

---

# Emergency

## Panic Alert

```http
POST /groups/:groupId/panic
```

Request:

```json
{
  "message": "Emergency details"
}
```

Response:

```json
{
  "success": true
}
```

---

# Admin Endpoints

## Get All Users

```http
GET /admin/users
```

---

## Get All Routes

```http
GET /admin/routes
```

---

## Get Panic Reports

```http
GET /admin/panic-reports
```

---

## Update Reputation

```http
PATCH /admin/users/:userId/reputation
```

Request:

```json
{
  "reputation": 80
}
```

Response:

```json
{
  "success": true
}
```

---

# Standard Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```
