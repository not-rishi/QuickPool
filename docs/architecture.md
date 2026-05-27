# QuickPool Architecture

## Overview

QuickPool is a full-stack ride pooling platform built with:

- Frontend: React Native + Expo + TypeScript
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: OTP + JWT
- Email Service: Nodemailer

---

## High-Level Flow

```text
+------------------+
| React Native App |
+--------+---------+
         |
         | HTTP Requests
         ↓
+------------------+
| Express Backend  |
+--------+---------+
         |
         |
         ├──────── Controllers
         │
         ├──────── Middleware
         │
         ├──────── Services
         │
         └──────── Models
                   |
                   ↓
            +-------------+
            | MongoDB     |
            +-------------+
```

---

## Backend Architecture

```text
backend/src/

controllers/
    Handles request logic

routes/
    API endpoints

middleware/
    Authentication
    Error handling

models/
    MongoDB schemas

services/
    Business logic
    Email services
    Matching engine

utils/
    Shared helper functions

templates/
    Email templates

config/
    Database configuration
```

---

## Frontend Architecture

```text
frontend/

app/
    Screens and navigation

components/
    Reusable UI components

services/
    API requests

context/
    Authentication state

hooks/
    Shared hooks

types/
    TypeScript interfaces

assets/
    Images and animations
```

---

## Authentication Flow

```text
User enters email
        ↓
Send OTP request
        ↓
OTP generated
        ↓
Email service sends OTP
        ↓
User verifies OTP
        ↓
JWT token generated
        ↓
Token stored locally
        ↓
Authenticated API requests
```

---

## Route Matching Flow

```text
User creates route
        ↓
Route stored
        ↓
Matching service checks
        ↓
Users grouped together
        ↓
Queue updated
        ↓
Group assigned
```

---

## Emergency Flow

```text
User presses panic button
        ↓
Emergency report created
        ↓
Stored in database
        ↓
Admin notified
```

---

## Database Collections

- Users
- Routes
- Groups
- RideHistory
- Queue
- OTP
- PanicReport
- NoShowReport
- Swap
