@echo off
TITLE NewLore Researcher - Startup
SETLOCAL EnableExtensions

:: Set working directory to the script's location
cd /d "%~dp0"

echo ========================================
echo   NewLore Researcher: Private AI
echo ========================================
echo.

:: 1. Check if Ollama is running
echo [1/3] Checking AI Engine (Ollama)...
tasklist /FI "IMAGENAME eq ollama.exe" 2>NUL | find /I /N "ollama.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo AI Engine is already running.
) else (
    echo Starting Ollama...
    :: Use 'ollama' instead of 'ollama app.exe' which is more standard for CLI
    start "" "ollama" serve
    timeout /t 5 >nul
)

:: 2. Start Backend
echo [2/3] Starting Python Processing Engine...
if not exist "backend" (
    echo ERROR: 'backend' directory not found!
    goto :error
)

pushd backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment.
        popd
        goto :error
    )
    call venv\Scripts\activate
    echo Installing backend dependencies...
    pip install -r requirements.txt
)
echo Launching Backend...
start "NewLore Backend" cmd /k "call venv\Scripts\activate && python main.py"
popd

:: 3. Start Frontend
echo [3/3] Starting User Interface...
if not exist "frontend" (
    echo ERROR: 'frontend' directory not found!
    goto :error
)

pushd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies - this may take a minute...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed.
        popd
        goto :error
    )
)
echo Launching Frontend...
start "NewLore Frontend" cmd /k "npm run dev -- --host"
popd

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
exit /b 0

:error
echo.
echo ========================================
echo   FAILURE: Something went wrong.
echo ========================================
echo.
pause
exit /b 1
