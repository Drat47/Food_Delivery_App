@echo off
REM Quick Start Script for Food Delivery React App (Windows)

echo ==========================================
echo   Food Delivery - React Stack
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed
    echo Please download from: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Node.js found: %NODE_VERSION%
echo.

REM Backend Setup
echo Seeding database with sample data...
python seed_db.py

echo.
echo ==========================================
echo Starting Backend Server...
echo ==========================================
echo Backend will run on: http://127.0.0.1:8000
echo.
start cmd /k "cd %cd% && python -m uvicorn app.main:app --reload"

REM Wait for backend to start
timeout /t 3

REM Frontend Setup
echo.
echo ==========================================
echo Starting Frontend Server...
echo ==========================================
echo Frontend will run on: http://localhost:5173
echo.

cd frontend

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)

echo.
call npm run dev

echo.
echo ==========================================
echo Application is running!
echo ==========================================
echo Frontend: http://localhost:5173
echo Backend:  http://127.0.0.1:8000
echo.
pause
