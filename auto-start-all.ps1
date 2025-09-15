Write-Host "🚀 AUTO-STARTING MULTI-TENANT DASHBOARD" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Function to check if port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Check if services are already running
Write-Host "🔍 Checking current status..." -ForegroundColor Yellow
$backendRunning = Test-Port 4000
$frontendRunning = Test-Port 3000

if ($backendRunning) {
    Write-Host "   ✅ Backend is already running on port 4000" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend is not running on port 4000" -ForegroundColor Red
}

if ($frontendRunning) {
    Write-Host "   ✅ Frontend is already running on port 3000" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend is not running on port 3000" -ForegroundColor Red
}

# Start Backend if not running
if (-not $backendRunning) {
    Write-Host ""
    Write-Host "1️⃣ Starting Backend Server..." -ForegroundColor Yellow
    Write-Host "   📁 Changing to backend directory..." -ForegroundColor Cyan
    
    $backendPath = "C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend"
    if (Test-Path $backendPath) {
        Set-Location $backendPath
        Write-Host "   🚀 Starting backend with npm start..." -ForegroundColor Cyan
        
        # Start backend in background
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🚀 Starting Backend Server...' -ForegroundColor Green; npm start"
        
        Write-Host "   ⏳ Waiting for backend to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    } else {
        Write-Host "   ❌ Backend directory not found: $backendPath" -ForegroundColor Red
    }
}

# Start Frontend if not running
if (-not $frontendRunning) {
    Write-Host ""
    Write-Host "2️⃣ Starting Frontend Dashboard..." -ForegroundColor Yellow
    Write-Host "   📁 Changing to frontend directory..." -ForegroundColor Cyan
    
    $frontendPath = "C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-dashboard"
    if (Test-Path $frontendPath) {
        Set-Location $frontendPath
        Write-Host "   🚀 Starting frontend with npm start..." -ForegroundColor Cyan
        
        # Start frontend in background
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🚀 Starting Frontend Dashboard...' -ForegroundColor Green; npm start"
        
        Write-Host "   ⏳ Waiting for frontend to start..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    } else {
        Write-Host "   ❌ Frontend directory not found: $frontendPath" -ForegroundColor Red
    }
}

# Create admin user
Write-Host ""
Write-Host "3️⃣ Ensuring admin user exists..." -ForegroundColor Yellow
$backendPath = "C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "   🔧 Creating/verifying admin user..." -ForegroundColor Cyan
    node fix-login.js
}

# Wait a bit more for services to fully start
Write-Host ""
Write-Host "⏳ Waiting for services to fully start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Final check
Write-Host ""
Write-Host "🔍 Final status check..." -ForegroundColor Yellow
$backendRunning = Test-Port 4000
$frontendRunning = Test-Port 3000

if ($backendRunning -and $frontendRunning) {
    Write-Host ""
    Write-Host "🎉 SUCCESS! Both services are running!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Dashboard URL: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔑 Login Credentials:" -ForegroundColor Cyan
    Write-Host "   Email: admin@xeno.com" -ForegroundColor White
    Write-Host "   Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Opening dashboard in your browser..." -ForegroundColor Green
    Start-Process "http://localhost:3000"
    
    # Also open the auto-login helper
    $autoLoginPath = "C:\Users\Rakshit Sharma\Desktop\Fxeno\auto-login.html"
    if (Test-Path $autoLoginPath) {
        Start-Process $autoLoginPath
    }
} else {
    Write-Host ""
    Write-Host "❌ Some services failed to start" -ForegroundColor Red
    Write-Host "===============================" -ForegroundColor Red
    Write-Host "Backend running: $backendRunning" -ForegroundColor $(if($backendRunning) {"Green"} else {"Red"})
    Write-Host "Frontend running: $frontendRunning" -ForegroundColor $(if($frontendRunning) {"Green"} else {"Red"})
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
