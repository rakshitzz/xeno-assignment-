Write-Host "🔍 TESTING LOGIN" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host ""

# Test Backend Health
Write-Host "1️⃣ Testing Backend Health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:4000/health" -Method GET -TimeoutSec 5
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Backend is running!" -ForegroundColor Green
        Write-Host "   📊 Health response: $($healthResponse.Content)" -ForegroundColor Cyan
        
        # Test Login
        Write-Host ""
        Write-Host "2️⃣ Testing Login..." -ForegroundColor Yellow
        
        $loginData = @{
            email = "admin@xeno.com"
            password = "admin123"
        } | ConvertTo-Json
        
        $loginResponse = Invoke-WebRequest -Uri "http://localhost:4000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 10
        
        if ($loginResponse.StatusCode -eq 200) {
            Write-Host "   ✅ Login successful!" -ForegroundColor Green
            $responseData = $loginResponse.Content | ConvertFrom-Json
            if ($responseData.token) {
                Write-Host "   🎫 Token received: $($responseData.token.Substring(0, 20))..." -ForegroundColor Cyan
            }
        } else {
            Write-Host "   ❌ Login failed! Status: $($loginResponse.StatusCode)" -ForegroundColor Red
            Write-Host "   📊 Response: $($loginResponse.Content)" -ForegroundColor Red
        }
    } else {
        Write-Host "   ❌ Backend returned status: $($healthResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Backend is NOT running!" -ForegroundColor Red
    Write-Host "   💡 Start backend with: cd xeno-backend && npm start" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 SUMMARY" -ForegroundColor Green
Write-Host "==========" -ForegroundColor Green
Write-Host "If backend is running but login fails:" -ForegroundColor Yellow
Write-Host "1. Check if admin user exists in database" -ForegroundColor White
Write-Host "2. Run: cd xeno-backend && node create-test-user.js" -ForegroundColor White
Write-Host "3. Try login again" -ForegroundColor White
