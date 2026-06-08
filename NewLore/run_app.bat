@echo off
TITLE NewLore Researcher - Startup
SETLOCAL

echo ========================================
echo   NewLore Researcher: Private AI
echo ========================================
echo.

:: 1. Check if Ollama is running (simplified check)
echo [1/3] Checking AI Engine (Ollama)...
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo AI Engine is already running.
) else (
    echo Starting Ollama...
    start "" "ollama app.exe"
    timeout /t 5 >nul
)

:: 2. Start Backend
echo [2/3] Starting Python Processing Engine...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
)
start "NewLore Backend" cmd /k "call venv\Scripts\activate && python main.py"
cd ..

:: 3. Start Frontend
echo [3/3] Starting User Interface...
cd frontend
if not exist node_modules (
    echo Installing dependencies (this may take a minute)...
    npm install
)
:: Running with --host allows other computers on your wifi to connect if they know your IP
start "NewLore Frontend" cmd /k "npm run dev -- --host"
cd ..

echo.
echo ========================================
echo   SUCCESS: App is launching!
echo ========================================
echo.
echo Interface will be ready at: http://localhost:5173
echo.
echo Keep the other two windows open while using the app.
echo.
pause
