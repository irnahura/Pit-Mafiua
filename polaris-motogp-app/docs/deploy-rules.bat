@echo off
REM Firebase Rules Deployment Script for Windows
REM This script deploys the updated Firestore security rules

echo.
echo ========================================
echo    Firebase Rules Deployment Script
echo ========================================
echo.

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Firebase CLI not found!
    echo.
    echo Install it with:
    echo   npm install -g firebase-tools
    echo.
    echo Or deploy manually:
    echo   1. Go to: https://console.firebase.google.com/project/polarisgp-fd2c3/firestore/rules
    echo   2. Copy content from firestore.rules
    echo   3. Paste and click 'Publish'
    echo.
    pause
    exit /b 1
)

echo [OK] Firebase CLI found
echo.

REM Check if logged in
echo [INFO] Checking Firebase authentication...
firebase projects:list >nul 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Not logged in to Firebase
    echo.
    echo Please login first:
    echo   firebase login
    echo.
    pause
    exit /b 1
)

echo [OK] Authenticated
echo.

REM Deploy rules
echo [INFO] Deploying Firestore security rules...
echo.

firebase deploy --only firestore:rules

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Rules deployed successfully!
    echo.
    echo Next steps:
    echo   1. Test the standings page: http://localhost:3000/standings
    echo   2. Add sample data (see STANDINGS_SETUP.md^)
    echo   3. Deploy to production
    echo.
) else (
    echo.
    echo [ERROR] Deployment failed!
    echo.
    echo Try manual deployment:
    echo   1. Go to: https://console.firebase.google.com/project/polarisgp-fd2c3/firestore/rules
    echo   2. Copy content from firestore.rules
    echo   3. Paste and click 'Publish'
    echo.
    pause
    exit /b 1
)

pause
