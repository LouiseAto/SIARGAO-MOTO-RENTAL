@echo off
echo ========================================
echo Siargao Moto Rental - Setup and Run
echo ========================================
echo.

echo [1/2] Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo.
echo [2/2] Starting development server...
echo.
echo ========================================
echo Application will open at:
echo http://localhost:3000
echo ========================================
echo.
echo Login with:
echo Email: admin@siargao-moto.com
echo Password: Admin123!
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev

pause
