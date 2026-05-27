@echo off
title QuickPool Launcher

echo Starting Backend...
start "QuickPool Backend" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 2 > nul

echo Starting Frontend...
start "QuickPool Frontend" cmd /k "cd /d %~dp0frontend && npx expo start"

timeout /t 5 > nul

echo Opening Admin Panel...
start http://127.0.0.1:5500/backend/admin.html

exit