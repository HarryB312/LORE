#!/bin/bash

# NewLore Researcher - macOS/Linux Startup Script

# Set working directory to the script's location
cd "$(dirname "$0")"

echo "========================================"
echo "  NewLore Researcher: Private AI (Mac)"
echo "========================================"
echo ""

# 1. Check if Ollama is running
echo "[1/3] Checking AI Engine (Ollama)..."
if pgrep -x "ollama" > /dev/null
then
    echo "AI Engine is already running."
else
    echo "Starting Ollama..."
    open -a Ollama
    sleep 5
fi

# 2. Start Backend
echo "[2/3] Starting Python Processing Engine..."
if [ ! -d "backend" ]; then
    echo "ERROR: 'backend' directory not found!"
    exit 1
fi

cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing backend dependencies..."
    pip install -r requirements.txt
fi

# Launch backend in a new Terminal window
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && source venv/bin/activate && python3 main.py"'
cd ..

# 3. Start Frontend
echo "[3/3] Starting User Interface..."
if [ ! -d "frontend" ]; then
    echo "ERROR: 'frontend' directory not found!"
    exit 1
fi

cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Launch frontend in a new Terminal window
osascript -e 'tell app "Terminal" to do script "cd \"'$(pwd)'\" && npm run dev -- --host"'
cd ..

echo ""
echo "========================================"
echo "  SUCCESS: App is launching!"
echo "========================================"
echo ""
echo "Interface will be ready at: http://localhost:5173"
echo ""
echo "Keep the other two Terminal windows open while using the app."
echo ""
