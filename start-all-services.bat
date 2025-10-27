@echo off
echo ========================================
echo   AI-Learn Service Launcher
echo ========================================
echo.
echo Starting all services...
echo.

echo [1/3] Starting Backend Server (Port 5000)...
start "AI-Learn Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend (Port 3000)...
start "AI-Learn Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo [3/3] ML Service should already be running (Port 5001)
echo.
echo ========================================
echo   All services are starting...
echo ========================================
echo.
echo Open your browser to: http://localhost:3000
echo.
echo Press any key to check service status...
pause >nul

echo.
echo Checking service status...
netstat -ano | findstr ":5000 :3000 :5001" | findstr "LISTENING"
echo.
echo Services running on ports above (should see 5000, 3000, 5001)
echo.
pause
