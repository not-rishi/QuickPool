<div align="center">

<img src="./frontend/assets/images/icon.gif" width="140"/>

# QuickPool

### Smart Ride Pooling Platform

<p align="center">
Intelligent route matching and group-based travel with safety systems, reputation management and automated ride formation.
</p>

<br>

<img src="https://img.shields.io/badge/React%20Native-Expo-a78bfa?style=for-the-badge">
<img src="https://img.shields.io/badge/Node.js-Express-a78bfa?style=for-the-badge">
<img src="https://img.shields.io/badge/MongoDB-Mongoose-a78bfa?style=for-the-badge">
<img src="https://img.shields.io/badge/Frontend-TypeScript-a78bfa?style=for-the-badge">
<img src="https://img.shields.io/badge/JWT-Authentication-a78bfa?style=for-the-badge">
<img src="https://img.shields.io/badge/LoC-23,166-a78bfa?style=for-the-badge">

<br><br>

<a href="#showcase">Showcase</a> •
<a href="#overview">Overview</a> •
<a href="#features">Features</a> •
<a href="#tech-stack">Tech Stack</a> •
<a href="#installation">Installation</a>

</div>

---

## Showcase

### Authentication

<div align="center">

<img src="./docs/screenshots/usn.jpg" height="500"/>
<img src="./docs/screenshots/email.png" height="500"/>
<img src="./docs/screenshots/otp.jpg" height="500"/>

<br><br>

Secure OTP-based authentication flow using university ID verification, email verification and login confirmation.

</div>

---

### Home

<div align="center">

<img src="./docs/screenshots/home.jpg" height="500"/>

<br><br>

Browse available ride routes, discover matching users and create personalized travel routes.

</div>

---

### Routes

<div align="center">

<img src="./docs/screenshots/route_top.jpg" height="500"/>
<img src="./docs/screenshots/route_bottom.jpg" height="500"/>

<br><br>

Choose your route and your time slot

</div>

---

### Groups

<div align="center">

<img src="./docs/screenshots/group.png" height="500"/>
<img src="./docs/screenshots/group-bottom.png" height="500"/>

<br><br>

Manage ride groups, send panic alerts, monitor members, request swaps and handle ride participation.

</div>

---

### History & Profile

<div align="center">

<img src="./docs/screenshots/history.jpg" height="500"/>
<img src="./docs/screenshots/profile.jpg" height="500"/>

<br><br>

View previous rides, track participants and maintain ride activity records.
Manage user information, reputation score and account details.

</div>

---

### Admin Panel

<div align="center">

<img src="./docs/screenshots/admin_panel.png" width="1000"/>
<img src="./docs/screenshots/admin-panel-alert.gif" width="1000"/>

<br><br>

Monitor Routes, get panic alerts and act directly!

</div>

---

## Overview

QuickPool is a full-stack ride pooling application that automatically matches users travelling on similar routes and forms optimized ride groups.

Core goals:

- Intelligent route matching
- Automated ride grouping
- Ride safety features
- Reputation management
- Ride history tracking
- Emergency support system

---

## Features

### Authentication

- OTP-based login
- Email verification
- JWT authentication
- Secure local storage

### Route System

```ts
QUICK_ROUTE
USER_ROUTE
```

Supports:

- Source and destination
- Time slots
- Capacity selection
- Dynamic route creation

### Matching System

```txt
FORMED
↓
STARTED
↓
COMPLETED
```

Automatically:

- Finds matching routes
- Creates ride groups
- Updates ride status

### Safety

- Panic reporting
- No-show reporting
- Reputation scoring

### Ride Management

- Group management
- Ride swapping
- Ride history

---

## Tech Stack

### Frontend

```txt
React Native
Expo
TypeScript
Expo Router
Secure Store
```

### Backend

```txt
Node.js
Express
MongoDB
Mongoose
JWT
Node Cron
Nodemailer
```

---

## Architecture


<div align="center">

<img src="./docs/architecture-diagram.png" width="500"/>

</div>

---

## Installation

### Clone repository

```bash
git clone https://github.com/not-rishi/QuickPool.git

cd QuickPool
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npx expo start
```

<div align="center">

<a href="./docs/architecture.md">
<img src="https://img.shields.io/badge/Architecture-a78bfa?style=for-the-badge">
</a>

<a href="./docs/api-contract.md">
<img src="https://img.shields.io/badge/API-a78bfa?style=for-the-badge">
</a>

</div>
