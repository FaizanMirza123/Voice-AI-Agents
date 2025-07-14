#!/bin/bash

# Voice AI Agents Backend Startup Script

echo "🚀 Starting Voice AI Agents Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Start the FastAPI server
echo "🌟 Starting FastAPI server..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000
