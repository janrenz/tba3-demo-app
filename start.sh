#!/bin/bash

# TBA3 Demo App - Startup Script

echo "🚀 Starting TBA3 Demo Application..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start dev server
echo "▶️  Starting frontend dev server..."
echo "   URL: http://localhost:5175 (or next available port)"
echo ""
echo "⚠️  Note: Mock server must be started separately!"
echo "   cd ../tba3-repo/mock-server"
echo "   python3.11 -m venv venv && source venv/bin/activate"
echo "   pip install -r requirements.txt"
echo "   uvicorn server:app --reload --port 8000"
echo ""
echo "Press Ctrl+C to stop the dev server"
echo "─────────────────────────────────────────"

npm run dev
