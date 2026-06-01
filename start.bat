@echo off
title QuickPool Launcher

echo Starting Frontend...
start "QuickPool Frontend" cmd /k "cd /d %~dp0frontend && npx expo start"

timeout /t 1 > nul

echo Starting Backend...
start "QuickPool Backend" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 5 > nul

echo Opening admin panel...
start http://localhost:5000/admin.html

exit

