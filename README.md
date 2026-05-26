
```
QuickPool
├─ backend
│  ├─ .env
│  ├─ config
│  │  └─ db.js
│  ├─ controllers
│  │  ├─ adminController.js
│  │  ├─ authController.js
│  │  ├─ emergencyController.js
│  │  ├─ groupController.js
│  │  ├─ routeController.js
│  │  └─ userController.js
│  ├─ middleware
│  │  ├─ authMiddleware.js
│  │  └─ errorMiddleware.js
│  ├─ models
│  │  ├─ Group.js
│  │  ├─ NoShowReport.js
│  │  ├─ OTP.js
│  │  ├─ PanicReport.js
│  │  ├─ Queue.js
│  │  ├─ RideHistory.js
│  │  ├─ Route.js
│  │  ├─ Swap.js
│  │  └─ User.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ route-contract.txt
│  ├─ routes
│  │  ├─ adminRoutes.js
│  │  ├─ authRoutes.js
│  │  ├─ emergencyRoutes.js
│  │  ├─ groupRoutes.js
│  │  ├─ routeRoutes.js
│  │  └─ userRoutes.js
│  ├─ scripts
│  │  └─ fetchOtp.js
│  ├─ server.js
│  ├─ services
│  │  ├─ emailService.js
│  │  └─ matchingService.js
│  ├─ templates
│  │  └─ otpTemplate.js
│  └─ utils
│     ├─ generateOTP.js
│     └─ generateToken.js
└─ frontend
   ├─ .claude
   │  └─ settings.json
   ├─ .env
   ├─ .env.example
   ├─ .expo
   │  ├─ cache
   │  │  └─ eslint
   │  │     └─ .cache_vm90f8
   │  ├─ devices.json
   │  ├─ README.md
   │  ├─ types
   │  │  └─ router.d.ts
   │  └─ web
   │     └─ cache
   │        └─ production
   │           └─ images
   │              └─ favicon
   │                 ├─ favicon-a4e030697a7571b3e95d31860e4da55d2f98e5e861e2b55e414f45a8556828ba-contain-transparent
   │                 │  └─ favicon-48.png
   │                 └─ favicon-bf70310af2440e95414af45eef748dc978380bbb30ba2d91533ef4b8c5e4d8d3-contain-transparent
   │                    └─ favicon-48.png
   ├─ AGENTS.md
   ├─ app
   │  ├─ (auth)
   │  │  ├─ login.tsx
   │  │  ├─ otp.tsx
   │  │  └─ _layout.tsx
   │  ├─ (tabs)
   │  │  ├─ group.tsx
   │  │  ├─ history.tsx
   │  │  ├─ index.tsx
   │  │  ├─ profile.tsx
   │  │  └─ _layout.tsx
   │  ├─ create-route.tsx
   │  ├─ index.tsx
   │  ├─ modal.tsx
   │  ├─ routes
   │  │  └─ [routeId].tsx
   │  └─ _layout.tsx
   ├─ app.json
   ├─ assets
   │  ├─ animated
   │  │  ├─ group.gif
   │  │  ├─ group.mp4
   │  │  ├─ history.gif
   │  │  ├─ profile.gif
   │  │  ├─ travel.gif
   │  │  └─ travel.mp4
   │  └─ images
   │     ├─ android-icon-background.png
   │     ├─ android-icon-foreground.png
   │     ├─ android-icon-monochrome.png
   │     ├─ avatars
   │     │  ├─ avatar1.png
   │     │  ├─ avatar10.png
   │     │  ├─ avatar2.png
   │     │  ├─ avatar3.png
   │     │  ├─ avatar4.png
   │     │  ├─ avatar5.png
   │     │  ├─ avatar6.png
   │     │  ├─ avatar7.png
   │     │  ├─ avatar8.png
   │     │  └─ avatar9.png
   │     ├─ background.png
   │     ├─ favicon.png
   │     ├─ icon.gif
   │     ├─ icon.png
   │     ├─ icon_b.gif
   │     ├─ icon_b.png
   │     ├─ icon_w.gif
   │     ├─ icon_w.png
   │     ├─ map-placeholder.png
   │     ├─ partial-react-logo.png
   │     ├─ react-logo.png
   │     ├─ react-logo@2x.png
   │     ├─ react-logo@3x.png
   │     └─ splash-icon.png
   ├─ CLAUDE.md
   ├─ components
   │  ├─ branding
   │  │  └─ quickpool-logo.tsx
   │  ├─ external-link.tsx
   │  ├─ haptic-tab.tsx
   │  ├─ hello-wave.tsx
   │  ├─ parallax-scroll-view.tsx
   │  ├─ routes
   │  │  └─ route-card.tsx
   │  ├─ themed-text.tsx
   │  ├─ themed-view.tsx
   │  └─ ui
   │     ├─ auth-input.tsx
   │     ├─ collapsible.tsx
   │     ├─ icon-symbol.ios.tsx
   │     ├─ icon-symbol.tsx
   │     ├─ primary-button.tsx
   │     └─ screen-container.tsx
   ├─ config
   │  └─ api.ts
   ├─ constants
   │  ├─ api.ts
   │  ├─ brand.ts
   │  ├─ theme.ts
   │  └─ validation.ts
   ├─ context
   │  └─ auth-context.tsx
   ├─ eslint.config.js
   ├─ expo-env.d.ts
   ├─ hooks
   │  ├─ use-color-scheme.ts
   │  ├─ use-color-scheme.web.ts
   │  └─ use-theme-color.ts
   ├─ package-lock.json
   ├─ package.json
   ├─ README.md
   ├─ scripts
   │  └─ reset-project.js
   ├─ services
   │  ├─ api.ts
   │  ├─ auth.ts
   │  └─ routes.ts
   ├─ tsconfig.json
   └─ types
      ├─ group.ts
      ├─ history.ts
      ├─ queue.ts
      ├─ route.ts
      └─ user.ts

```
```
QuickPool
├─ backend
│  ├─ .env
│  ├─ config
│  │  └─ db.js
│  ├─ controllers
│  │  ├─ adminController.js
│  │  ├─ authController.js
│  │  ├─ emergencyController.js
│  │  ├─ groupController.js
│  │  ├─ routeController.js
│  │  └─ userController.js
│  ├─ middleware
│  │  ├─ authMiddleware.js
│  │  └─ errorMiddleware.js
│  ├─ models
│  │  ├─ Group.js
│  │  ├─ NoShowReport.js
│  │  ├─ OTP.js
│  │  ├─ PanicReport.js
│  │  ├─ Queue.js
│  │  ├─ RideHistory.js
│  │  ├─ Route.js
│  │  ├─ Swap.js
│  │  └─ User.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ route-contract.txt
│  ├─ routes
│  │  ├─ adminRoutes.js
│  │  ├─ authRoutes.js
│  │  ├─ emergencyRoutes.js
│  │  ├─ groupRoutes.js
│  │  ├─ routeRoutes.js
│  │  └─ userRoutes.js
│  ├─ scripts
│  │  └─ fetchOtp.js
│  ├─ server.js
│  ├─ services
│  │  ├─ emailService.js
│  │  └─ matchingService.js
│  ├─ templates
│  │  └─ otpTemplate.js
│  └─ utils
│     ├─ generateOTP.js
│     └─ generateToken.js
├─ frontend
│  ├─ .claude
│  │  └─ settings.json
│  ├─ .env
│  ├─ .env.example
│  ├─ .expo
│  │  ├─ cache
│  │  │  └─ eslint
│  │  │     └─ .cache_vm90f8
│  │  ├─ devices.json
│  │  ├─ README.md
│  │  ├─ types
│  │  │  └─ router.d.ts
│  │  └─ web
│  │     └─ cache
│  │        └─ production
│  │           └─ images
│  │              └─ favicon
│  │                 ├─ favicon-a4e030697a7571b3e95d31860e4da55d2f98e5e861e2b55e414f45a8556828ba-contain-transparent
│  │                 │  └─ favicon-48.png
│  │                 └─ favicon-bf70310af2440e95414af45eef748dc978380bbb30ba2d91533ef4b8c5e4d8d3-contain-transparent
│  │                    └─ favicon-48.png
│  ├─ AGENTS.md
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ login.tsx
│  │  │  ├─ otp.tsx
│  │  │  └─ _layout.tsx
│  │  ├─ (tabs)
│  │  │  ├─ group.tsx
│  │  │  ├─ history.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ profile.tsx
│  │  │  └─ _layout.tsx
│  │  ├─ create-route.tsx
│  │  ├─ index.tsx
│  │  ├─ modal.tsx
│  │  ├─ routes
│  │  │  └─ [routeId].tsx
│  │  └─ _layout.tsx
│  ├─ app.json
│  ├─ assets
│  │  ├─ animated
│  │  │  ├─ group.gif
│  │  │  ├─ group.mp4
│  │  │  ├─ history.gif
│  │  │  ├─ profile.gif
│  │  │  ├─ travel.gif
│  │  │  └─ travel.mp4
│  │  └─ images
│  │     ├─ android-icon-background.png
│  │     ├─ android-icon-foreground.png
│  │     ├─ android-icon-monochrome.png
│  │     ├─ avatars
│  │     │  ├─ avatar1.png
│  │     │  ├─ avatar10.png
│  │     │  ├─ avatar2.png
│  │     │  ├─ avatar3.png
│  │     │  ├─ avatar4.png
│  │     │  ├─ avatar5.png
│  │     │  ├─ avatar6.png
│  │     │  ├─ avatar7.png
│  │     │  ├─ avatar8.png
│  │     │  └─ avatar9.png
│  │     ├─ background.png
│  │     ├─ favicon.png
│  │     ├─ icon.gif
│  │     ├─ icon.png
│  │     ├─ icon_b.gif
│  │     ├─ icon_b.png
│  │     ├─ icon_w.gif
│  │     ├─ icon_w.png
│  │     ├─ map-placeholder.png
│  │     ├─ partial-react-logo.png
│  │     ├─ react-logo.png
│  │     ├─ react-logo@2x.png
│  │     ├─ react-logo@3x.png
│  │     └─ splash-icon.png
│  ├─ CLAUDE.md
│  ├─ components
│  │  ├─ branding
│  │  │  └─ quickpool-logo.tsx
│  │  ├─ external-link.tsx
│  │  ├─ haptic-tab.tsx
│  │  ├─ hello-wave.tsx
│  │  ├─ parallax-scroll-view.tsx
│  │  ├─ routes
│  │  │  └─ route-card.tsx
│  │  ├─ themed-text.tsx
│  │  ├─ themed-view.tsx
│  │  └─ ui
│  │     ├─ auth-input.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ icon-symbol.ios.tsx
│  │     ├─ icon-symbol.tsx
│  │     ├─ primary-button.tsx
│  │     └─ screen-container.tsx
│  ├─ config
│  │  └─ api.ts
│  ├─ constants
│  │  ├─ api.ts
│  │  ├─ brand.ts
│  │  ├─ theme.ts
│  │  └─ validation.ts
│  ├─ context
│  │  └─ auth-context.tsx
│  ├─ eslint.config.js
│  ├─ expo-env.d.ts
│  ├─ hooks
│  │  ├─ use-color-scheme.ts
│  │  ├─ use-color-scheme.web.ts
│  │  └─ use-theme-color.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  ├─ scripts
│  │  └─ reset-project.js
│  ├─ services
│  │  ├─ api.ts
│  │  ├─ auth.ts
│  │  └─ routes.ts
│  ├─ tsconfig.json
│  └─ types
│     ├─ group.ts
│     ├─ history.ts
│     ├─ queue.ts
│     ├─ route.ts
│     └─ user.ts
└─ README.md

```
```
QuickPool
├─ backend
│  ├─ .env
│  ├─ config
│  │  └─ db.js
│  ├─ controllers
│  │  ├─ adminController.js
│  │  ├─ authController.js
│  │  ├─ emergencyController.js
│  │  ├─ groupController.js
│  │  ├─ routeController.js
│  │  └─ userController.js
│  ├─ middleware
│  │  ├─ authMiddleware.js
│  │  └─ errorMiddleware.js
│  ├─ models
│  │  ├─ Group.js
│  │  ├─ NoShowReport.js
│  │  ├─ OTP.js
│  │  ├─ PanicReport.js
│  │  ├─ Queue.js
│  │  ├─ RideHistory.js
│  │  ├─ Route.js
│  │  ├─ Swap.js
│  │  └─ User.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ route-contract.txt
│  ├─ routes
│  │  ├─ adminRoutes.js
│  │  ├─ authRoutes.js
│  │  ├─ emergencyRoutes.js
│  │  ├─ groupRoutes.js
│  │  ├─ routeRoutes.js
│  │  └─ userRoutes.js
│  ├─ scripts
│  │  └─ fetchOtp.js
│  ├─ server.js
│  ├─ services
│  │  ├─ emailService.js
│  │  └─ matchingService.js
│  ├─ templates
│  │  └─ otpTemplate.js
│  └─ utils
│     ├─ generateOTP.js
│     └─ generateToken.js
├─ frontend
│  ├─ .env
│  ├─ .env.example
│  ├─ .expo
│  │  ├─ cache
│  │  │  └─ eslint
│  │  │     └─ .cache_vm90f8
│  │  ├─ devices.json
│  │  ├─ README.md
│  │  ├─ types
│  │  │  └─ router.d.ts
│  │  └─ web
│  │     └─ cache
│  │        └─ production
│  │           └─ images
│  │              └─ favicon
│  │                 ├─ favicon-a4e030697a7571b3e95d31860e4da55d2f98e5e861e2b55e414f45a8556828ba-contain-transparent
│  │                 │  └─ favicon-48.png
│  │                 └─ favicon-bf70310af2440e95414af45eef748dc978380bbb30ba2d91533ef4b8c5e4d8d3-contain-transparent
│  │                    └─ favicon-48.png
│  ├─ AGENTS.md
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ login.tsx
│  │  │  ├─ otp.tsx
│  │  │  └─ _layout.tsx
│  │  ├─ (tabs)
│  │  │  ├─ group.tsx
│  │  │  ├─ history.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ profile.tsx
│  │  │  └─ _layout.tsx
│  │  ├─ create-route.tsx
│  │  ├─ index.tsx
│  │  ├─ modal.tsx
│  │  ├─ routes
│  │  │  └─ [routeId].tsx
│  │  └─ _layout.tsx
│  ├─ app.json
│  ├─ assets
│  │  ├─ animated
│  │  │  ├─ group.gif
│  │  │  ├─ group.mp4
│  │  │  ├─ history.gif
│  │  │  ├─ profile.gif
│  │  │  ├─ travel.gif
│  │  │  └─ travel.mp4
│  │  └─ images
│  │     ├─ android-icon-background.png
│  │     ├─ android-icon-foreground.png
│  │     ├─ android-icon-monochrome.png
│  │     ├─ avatars
│  │     │  ├─ avatar1.png
│  │     │  ├─ avatar10.png
│  │     │  ├─ avatar2.png
│  │     │  ├─ avatar3.png
│  │     │  ├─ avatar4.png
│  │     │  ├─ avatar5.png
│  │     │  ├─ avatar6.png
│  │     │  ├─ avatar7.png
│  │     │  ├─ avatar8.png
│  │     │  └─ avatar9.png
│  │     ├─ background.png
│  │     ├─ favicon.png
│  │     ├─ icon.gif
│  │     ├─ icon.png
│  │     ├─ icon_b.gif
│  │     ├─ icon_b.png
│  │     ├─ icon_w.gif
│  │     ├─ icon_w.png
│  │     ├─ map-placeholder.png
│  │     ├─ partial-react-logo.png
│  │     ├─ react-logo.png
│  │     ├─ react-logo@2x.png
│  │     ├─ react-logo@3x.png
│  │     └─ splash-icon.png
│  ├─ CLAUDE.md
│  ├─ components
│  │  ├─ branding
│  │  │  └─ quickpool-logo.tsx
│  │  ├─ external-link.tsx
│  │  ├─ haptic-tab.tsx
│  │  ├─ hello-wave.tsx
│  │  ├─ parallax-scroll-view.tsx
│  │  ├─ routes
│  │  │  └─ route-card.tsx
│  │  ├─ themed-text.tsx
│  │  ├─ themed-view.tsx
│  │  └─ ui
│  │     ├─ auth-input.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ icon-symbol.ios.tsx
│  │     ├─ icon-symbol.tsx
│  │     ├─ primary-button.tsx
│  │     └─ screen-container.tsx
│  ├─ config
│  │  └─ api.ts
│  ├─ constants
│  │  ├─ api.ts
│  │  ├─ brand.ts
│  │  ├─ theme.ts
│  │  └─ validation.ts
│  ├─ context
│  │  └─ auth-context.tsx
│  ├─ eslint.config.js
│  ├─ expo-env.d.ts
│  ├─ hooks
│  │  ├─ use-color-scheme.ts
│  │  ├─ use-color-scheme.web.ts
│  │  └─ use-theme-color.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  ├─ scripts
│  │  └─ reset-project.js
│  ├─ services
│  │  ├─ api.ts
│  │  ├─ auth.ts
│  │  └─ routes.ts
│  ├─ tsconfig.json
│  └─ types
│     ├─ group.ts
│     ├─ history.ts
│     ├─ queue.ts
│     ├─ route.ts
│     └─ user.ts
└─ README.md

```
```
QuickPool
├─ backend
│  ├─ .env
│  ├─ admin.html
│  ├─ config
│  │  └─ db.js
│  ├─ controllers
│  │  ├─ adminController.js
│  │  ├─ authController.js
│  │  ├─ emergencyController.js
│  │  ├─ groupController.js
│  │  ├─ routeController.js
│  │  └─ userController.js
│  ├─ middleware
│  │  ├─ authMiddleware.js
│  │  └─ errorMiddleware.js
│  ├─ models
│  │  ├─ Group.js
│  │  ├─ NoShowReport.js
│  │  ├─ OTP.js
│  │  ├─ PanicReport.js
│  │  ├─ Queue.js
│  │  ├─ RideHistory.js
│  │  ├─ Route.js
│  │  ├─ Swap.js
│  │  └─ User.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ route-contract.txt
│  ├─ routes
│  │  ├─ adminRoutes.js
│  │  ├─ authRoutes.js
│  │  ├─ emergencyRoutes.js
│  │  ├─ groupRoutes.js
│  │  ├─ routeRoutes.js
│  │  └─ userRoutes.js
│  ├─ scripts
│  │  └─ fetchOtp.js
│  ├─ server.js
│  ├─ services
│  │  ├─ emailService.js
│  │  └─ matchingService.js
│  ├─ templates
│  │  └─ otpTemplate.js
│  └─ utils
│     ├─ generateOTP.js
│     └─ generateToken.js
├─ frontend
│  ├─ .env
│  ├─ .expo
│  │  ├─ cache
│  │  │  └─ eslint
│  │  │     └─ .cache_vm90f8
│  │  ├─ devices.json
│  │  ├─ README.md
│  │  ├─ types
│  │  │  └─ router.d.ts
│  │  └─ web
│  │     └─ cache
│  │        └─ production
│  │           └─ images
│  │              └─ favicon
│  │                 ├─ favicon-a4e030697a7571b3e95d31860e4da55d2f98e5e861e2b55e414f45a8556828ba-contain-transparent
│  │                 │  └─ favicon-48.png
│  │                 └─ favicon-bf70310af2440e95414af45eef748dc978380bbb30ba2d91533ef4b8c5e4d8d3-contain-transparent
│  │                    └─ favicon-48.png
│  ├─ app
│  │  ├─ (auth)
│  │  │  ├─ login.tsx
│  │  │  ├─ otp.tsx
│  │  │  └─ _layout.tsx
│  │  ├─ (tabs)
│  │  │  ├─ group.tsx
│  │  │  ├─ history.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ profile.tsx
│  │  │  └─ _layout.tsx
│  │  ├─ create-route.tsx
│  │  ├─ index.tsx
│  │  ├─ modal.tsx
│  │  ├─ routes
│  │  │  └─ [routeId].tsx
│  │  └─ _layout.tsx
│  ├─ app.json
│  ├─ assets
│  │  ├─ animated
│  │  │  ├─ group.gif
│  │  │  ├─ group.mp4
│  │  │  ├─ history.gif
│  │  │  ├─ map_draw.gif
│  │  │  ├─ profile.gif
│  │  │  ├─ travel.gif
│  │  │  └─ travel.mp4
│  │  └─ images
│  │     ├─ android-icon-background.png
│  │     ├─ android-icon-foreground.png
│  │     ├─ android-icon-monochrome.png
│  │     ├─ avatars
│  │     │  ├─ avatar1.png
│  │     │  ├─ avatar10.png
│  │     │  ├─ avatar2.png
│  │     │  ├─ avatar3.png
│  │     │  ├─ avatar4.png
│  │     │  ├─ avatar5.png
│  │     │  ├─ avatar6.png
│  │     │  ├─ avatar7.png
│  │     │  ├─ avatar8.png
│  │     │  └─ avatar9.png
│  │     ├─ background.png
│  │     ├─ favicon.png
│  │     ├─ icon.gif
│  │     ├─ icon.png
│  │     ├─ icon_b.gif
│  │     ├─ icon_b.png
│  │     ├─ icon_w.gif
│  │     ├─ icon_w.png
│  │     ├─ map-placeholder.png
│  │     ├─ partial-react-logo.png
│  │     ├─ react-logo.png
│  │     ├─ react-logo@2x.png
│  │     ├─ react-logo@3x.png
│  │     └─ splash-icon.png
│  ├─ components
│  │  ├─ branding
│  │  │  └─ quickpool-logo.tsx
│  │  ├─ external-link.tsx
│  │  ├─ haptic-tab.tsx
│  │  ├─ hello-wave.tsx
│  │  ├─ parallax-scroll-view.tsx
│  │  ├─ routes
│  │  │  └─ route-card.tsx
│  │  ├─ themed-text.tsx
│  │  ├─ themed-view.tsx
│  │  └─ ui
│  │     ├─ auth-input.tsx
│  │     ├─ collapsible.tsx
│  │     ├─ icon-symbol.ios.tsx
│  │     ├─ icon-symbol.tsx
│  │     ├─ primary-button.tsx
│  │     └─ screen-container.tsx
│  ├─ config
│  │  └─ api.ts
│  ├─ constants
│  │  ├─ api.ts
│  │  ├─ brand.ts
│  │  ├─ theme.ts
│  │  └─ validation.ts
│  ├─ context
│  │  └─ auth-context.tsx
│  ├─ eslint.config.js
│  ├─ hooks
│  │  ├─ use-color-scheme.ts
│  │  ├─ use-color-scheme.web.ts
│  │  └─ use-theme-color.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  ├─ scripts
│  │  └─ reset-project.js
│  ├─ services
│  │  ├─ api.ts
│  │  ├─ auth.ts
│  │  └─ routes.ts
│  ├─ tsconfig.json
│  ├─ types
│  │  ├─ group.ts
│  │  ├─ history.ts
│  │  ├─ queue.ts
│  │  ├─ route.ts
│  │  └─ user.ts
│  └─ utils
│     └─ storage.ts
├─ readme assets
│  ├─ admin_panel.png
│  ├─ group.png
│  ├─ history.jpg
│  ├─ home.jpg
│  ├─ otp.jpg
│  ├─ profile.jpg
│  ├─ route_bottom.jpg
│  ├─ route_top.jpg
│  └─ usn.jpg
└─ README.md

```