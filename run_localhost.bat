@echo off
set "PATH=C:\Program Files\nodejs;C:\Program Files\Git\cmd;%PATH%"
title NOVACHATE Launcher
echo ===================================================
echo Starting NOVACHATE (Backend + Frontend)...
echo ===================================================

echo Starting Backend Server on http://localhost:5000...
start "NOVACHATE Backend (Port 5000)" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd /d %~dp0server && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Client on http://localhost:5173...
start "NOVACHATE Frontend (Port 5173)" cmd /k "set PATH=C:\Program Files\nodejs;%%PATH%% && cd /d %~dp0client && npm run dev"

echo ===================================================
echo Servers are running!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ===================================================
echo Opening Novachate in your browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173
