@echo off
setlocal
echo ==========================================
echo    Starting PropAI Platform Services
echo ==========================================

:: Start the Backend in a separate window
echo [OK] Starting Backend (Port 5000)...
start "PropAI Backend Host" cmd /k "cd backend && npm run dev"

:: Start the Frontend in a separate window
echo [OK] Starting Frontend (Port 3002)...
start "PropAI Frontend Host" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo    Both services are starting!
echo    Frontend: http://localhost:3002
echo    Backend:  http://localhost:5000
echo.
echo    You can now close this window.
echo ==========================================
pause
