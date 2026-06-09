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

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "Shutting down NewLore..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Trap Ctrl+C (SIGINT) and exit (SIGTERM)
trap cleanup SIGINT SIGTERM

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
else
    source venv/bin/activate
fi

echo "Launching Backend..."
python3 main.py > backend.log 2>&1 &
BACKEND_PID=$!
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

echo "Launching Frontend..."
npm run dev -- --host > frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "  SUCCESS: App is running!"
echo "========================================"
echo ""
echo "Interface: http://localhost:5173"
echo ""
echo ">>> PRESS CTRL+C TO SHUT DOWN EVERYTHING <<<"
echo ""

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
