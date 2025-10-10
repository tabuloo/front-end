@echo off
echo ========================================
echo    TABULOO LOCAL DEVELOPMENT SERVER
echo ========================================
echo.
echo Current directory: %CD%
echo.
echo Starting Frontend Development Server...
start "Tabuloo Frontend" cmd /k "npm run dev"
echo.
echo Starting Firebase Emulators...
start "Firebase Emulators" cmd /k "firebase emulators:start"
echo.
echo ========================================
echo    SERVICES STARTING...
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔥 Firebase UI: http://localhost:4000
echo 📊 Firestore: http://localhost:8080
echo.
echo Press any key to close this window...
pause >nul
