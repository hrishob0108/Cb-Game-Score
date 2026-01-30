# Start Backend and Frontend Servers
# Run this script in PowerShell from the Game-score directory

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Game Score - Quick Start" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if both folders exist
if (-not (Test-Path "backend")) {
    Write-Host "Error: backend folder not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "vite-project")) {
    Write-Host "Error: vite-project folder not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Starting Backend Server..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Yellow
Write-Host ""

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit -Command cd backend; npm start"

Start-Sleep -Seconds 3

Write-Host "Starting Frontend Server..." -ForegroundColor Green
Write-Host "Frontend will run on: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit -Command cd vite-project; npm run dev"

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Servers are starting..." -ForegroundColor Cyan
Write-Host "Wait 15-20 seconds for full startup" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor Green
Write-Host "Health Check: http://localhost:5000/api/health" -ForegroundColor Green
