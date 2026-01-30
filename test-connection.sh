#!/bin/bash
# Connection Test Script for Game Score Application

echo "================================"
echo "Game Score - Connection Tester"
echo "================================"
echo ""

# Test Backend
echo "Testing Backend..."
echo "Checking if backend server is running on port 5000..."

# Try to connect to backend health endpoint
BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)

if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo "✓ Backend is running and healthy"
else
    echo "✗ Backend connection failed (HTTP $BACKEND_RESPONSE)"
    echo "  Make sure to run: cd backend && npm start"
fi

echo ""
echo "Testing Frontend..."

# Check if frontend is running on port 5173 (default Vite port)
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/)

if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo "✓ Frontend is running"
else
    echo "✗ Frontend is not running (HTTP $FRONTEND_RESPONSE)"
    echo "  Make sure to run: cd vite-project && npm run dev"
fi

echo ""
echo "Testing Database Connection..."

# Test if teams can be fetched from backend
TEAMS_RESPONSE=$(curl -s http://localhost:5000/api/admin)

if echo "$TEAMS_RESPONSE" | grep -q "data"; then
    echo "✓ Database connection successful"
    echo "  Teams in database: $TEAMS_RESPONSE" | head -c 100
    echo "..."
else
    echo "✗ Database query failed"
    echo "  Response: $TEAMS_RESPONSE" | head -c 100
fi

echo ""
echo "================================"
echo "Testing Complete!"
echo "================================"
