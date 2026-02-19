#!/bin/bash
# Quick Start Script for Food Delivery React App

echo "=========================================="
echo "  Food Delivery - React Stack"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend (FastAPI)..."
cd "$(dirname "$0")"

if [ -d "venv" ]; then
    echo "✓ Virtual environment found"
    source venv/Scripts/activate
else
    echo "⚠️  Virtual environment not found"
    echo "   Run: python -m venv venv"
    echo "   Then: venv\\Scripts\\activate"
    exit 1
fi

echo ""
echo "🔄 Seeding database..."
python seed_db.py

echo ""
echo "=========================================="
echo "Starting Backend Server..."
echo "=========================================="
python -m uvicorn app.main:app --reload &
BACKEND_PID=$!

sleep 3

# Frontend Setup
echo ""
echo "=========================================="
echo "Starting Frontend Server..."
echo "=========================================="
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📥 Installing npm dependencies..."
    npm install
fi

echo ""
npm run dev

# Cleanup
trap "kill $BACKEND_PID" EXIT
