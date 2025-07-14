@echo off
REM Voice AI Agents Backend Startup Script for Windows

echo 🚀 Starting Voice AI Agents Backend...

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Start the FastAPI server
echo 🌟 Starting FastAPI server...
uvicorn main:app --reload --host 0.0.0.0 --port 8000
