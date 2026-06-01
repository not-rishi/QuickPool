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

## Repository Structure 

```
QuickPool
│ 
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── emergencyController.js
│   │   ├── groupController.js
│   │   ├── routeController.js
│   │   └── userController.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models
│   │   ├── Group.js
│   │   ├── NoShowReport.js
│   │   ├── OTP.js
│   │   ├── PanicReport.js
│   │   ├── Queue.js
│   │   ├── RideHistory.js
│   │   ├── Route.js
│   │   ├── Swap.js
│   │   └── User.js
│   ├── routes
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── emergencyRoutes.js
│   │   ├── groupRoutes.js
│   │   ├── routeRoutes.js
│   │   └── userRoutes.js
│   ├── scripts
│   │   └── fetchOtp.js
│   ├── services
│   │   ├── emailService.js
│   │   └── matchingService.js
│   ├── templates
│   │   └── mailTemplate.js
│   ├── utils
│   │   ├── generateOTP.js
│   │   └── generateToken.js
│   ├── admin.html
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── docs
│   ├── screenshots
│   │   ├── admin_panel.png
│   │   ├── admin-panel-alert.gif
│   │   ├── email.png
│   │   ├── group-bottom.png
│   │   ├── group.png
│   │   ├── history.jpg
│   │   ├── home.jpg
│   │   ├── otp.jpg
│   │   ├── profile.jpg
│   │   ├── route_bottom.jpg
│   │   ├── route_top.jpg
│   │   └── usn.jpg
│   ├── api-contract.md
│   ├── architecture-diagram.png
│   └── architecture.md
├── frontend
│   ├── android
│   │   ├── app
│   │   │   ├── src
│   │   │   │   ├── debug
│   │   │   │   │   └── AndroidManifest.xml
│   │   │   │   ├── debugOptimized
│   │   │   │   │   └── AndroidManifest.xml
│   │   │   │   └── main
│   │   │   │       ├── java
│   │   │   │       │   └── com
│   │   │   │       │       └── anonymous
│   │   │   │       │           └── QuickPool
│   │   │   │       │               ├── MainActivity.kt
│   │   │   │       │               └── MainApplication.kt
│   │   │   │       ├── res
│   │   │   │       │   ├── drawable
│   │   │   │       │   │   ├── ic_launcher_background.xml
│   │   │   │       │   │   └── rn_edit_text_material.xml
│   │   │   │       │   ├── drawable-hdpi
│   │   │   │       │   │   └── splashscreen_logo.png
│   │   │   │       │   ├── drawable-mdpi
│   │   │   │       │   │   └── splashscreen_logo.png
│   │   │   │       │   ├── drawable-xhdpi
│   │   │   │       │   │   └── splashscreen_logo.png
│   │   │   │       │   ├── drawable-xxhdpi
│   │   │   │       │   │   └── splashscreen_logo.png
│   │   │   │       │   ├── drawable-xxxhdpi
│   │   │   │       │   │   └── splashscreen_logo.png
│   │   │   │       │   ├── mipmap-anydpi-v26
│   │   │   │       │   │   ├── ic_launcher_round.xml
│   │   │   │       │   │   └── ic_launcher.xml
│   │   │   │       │   ├── mipmap-hdpi
│   │   │   │       │   │   ├── ic_launcher_background.webp
│   │   │   │       │   │   ├── ic_launcher_foreground.webp
│   │   │   │       │   │   ├── ic_launcher_monochrome.webp
│   │   │   │       │   │   ├── ic_launcher_round.webp
│   │   │   │       │   │   └── ic_launcher.webp
│   │   │   │       │   ├── mipmap-mdpi
│   │   │   │       │   │   ├── ic_launcher_background.webp
│   │   │   │       │   │   ├── ic_launcher_foreground.webp
│   │   │   │       │   │   ├── ic_launcher_monochrome.webp
│   │   │   │       │   │   ├── ic_launcher_round.webp
│   │   │   │       │   │   └── ic_launcher.webp
│   │   │   │       │   ├── mipmap-xhdpi
│   │   │   │       │   │   ├── ic_launcher_background.webp
│   │   │   │       │   │   ├── ic_launcher_foreground.webp
│   │   │   │       │   │   ├── ic_launcher_monochrome.webp
│   │   │   │       │   │   ├── ic_launcher_round.webp
│   │   │   │       │   │   └── ic_launcher.webp
│   │   │   │       │   ├── mipmap-xxhdpi
│   │   │   │       │   │   ├── ic_launcher_background.webp
│   │   │   │       │   │   ├── ic_launcher_foreground.webp
│   │   │   │       │   │   ├── ic_launcher_monochrome.webp
│   │   │   │       │   │   ├── ic_launcher_round.webp
│   │   │   │       │   │   └── ic_launcher.webp
│   │   │   │       │   ├── mipmap-xxxhdpi
│   │   │   │       │   │   ├── ic_launcher_background.webp
│   │   │   │       │   │   ├── ic_launcher_foreground.webp
│   │   │   │       │   │   ├── ic_launcher_monochrome.webp
│   │   │   │       │   │   ├── ic_launcher_round.webp
│   │   │   │       │   │   └── ic_launcher.webp
│   │   │   │       │   ├── values
│   │   │   │       │   │   ├── colors.xml
│   │   │   │       │   │   ├── strings.xml
│   │   │   │       │   │   └── styles.xml
│   │   │   │       │   └── values-night
│   │   │   │       │       └── colors.xml
│   │   │   │       └── AndroidManifest.xml
│   │   │   ├── build.gradle
│   │   │   └── proguard-rules.pro
│   │   ├── gradle
│   │   │   └── wrapper
│   │   │       ├── gradle-wrapper.jar
│   │   │       └── gradle-wrapper.properties
│   │   ├── .gitignore
│   │   ├── build.gradle
│   │   ├── gradle.properties
│   │   ├── gradlew
│   │   ├── gradlew.bat
│   │   └── settings.gradle
│   ├── app
│   │   ├── (auth)
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   └── otp.tsx
│   │   ├── (tabs)
│   │   │   ├── _layout.tsx
│   │   │   ├── group.tsx
│   │   │   ├── history.tsx
│   │   │   ├── index.tsx
│   │   │   └── profile.tsx
│   │   ├── routes
│   │   │   └── [routeId].tsx
│   │   ├── _layout.tsx
│   │   ├── create-route.tsx
│   │   ├── index.tsx
│   │   └── modal.tsx
│   ├── assets
│   │   ├── animated
│   │   │   ├── group.gif
│   │   │   ├── group.mp4
│   │   │   ├── history.gif
│   │   │   ├── map_draw.gif
│   │   │   ├── profile.gif
│   │   │   ├── travel.gif
│   │   │   └── travel.mp4
│   │   └── images
│   │       ├── avatars
│   │       │   ├── avatar1.png
│   │       │   ├── avatar10.png
│   │       │   ├── avatar2.png
│   │       │   ├── avatar3.png
│   │       │   ├── avatar4.png
│   │       │   ├── avatar5.png
│   │       │   ├── avatar6.png
│   │       │   ├── avatar7.png
│   │       │   ├── avatar8.png
│   │       │   └── avatar9.png
│   │       ├── android-icon-background.png
│   │       ├── android-icon-foreground.png
│   │       ├── android-icon-monochrome.png
│   │       ├── background.png
│   │       ├── favicon.png
│   │       ├── group.png
│   │       ├── icon_b.gif
│   │       ├── icon_b.png
│   │       ├── icon_w.gif
│   │       ├── icon_w.png
│   │       ├── icon.gif
│   │       ├── icon.png
│   │       ├── map-placeholder.png
│   │       └── splash-icon.png
│   ├── components
│   │   ├── branding
│   │   │   └── quickpool-logo.tsx
│   │   ├── routes
│   │   │   └── route-card.tsx
│   │   ├── ui
│   │   │   ├── auth-input.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── icon-symbol.ios.tsx
│   │   │   ├── icon-symbol.tsx
│   │   │   ├── primary-button.tsx
│   │   │   └── screen-container.tsx
│   │   ├── external-link.tsx
│   │   ├── haptic-tab.tsx
│   │   ├── hello-wave.tsx
│   │   ├── parallax-scroll-view.tsx
│   │   ├── themed-text.tsx
│   │   └── themed-view.tsx
│   ├── config
│   │   └── api.ts
│   ├── constants
│   │   ├── api-endpoint.ts
│   │   ├── brand.ts
│   │   ├── theme.ts
│   │   └── validation.ts
│   ├── context
│   │   └── auth-context.tsx
│   ├── hooks
│   │   ├── use-color-scheme.ts
│   │   ├── use-color-scheme.web.ts
│   │   └── use-theme-color.ts
│   ├── scripts
│   │   └── reset-project.js
│   ├── services
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── routes.ts
│   ├── types
│   │   ├── group.ts
│   │   ├── history.ts
│   │   ├── queue.ts
│   │   ├── route.ts
│   │   └── user.ts
│   ├── utils
│   │   └── storage.ts
│   ├── .gitignore
│   ├── app.json
│   ├── eslint.config.js
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
├── README.md
└── start.bat
```

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
