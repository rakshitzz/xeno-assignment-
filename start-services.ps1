Write-Host "🚀 Starting Both Services..." -ForegroundColor Green
Write-Host "===========================" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "Starting Backend (Real Shopify Data)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-backend'; node real-shopify-backend.js"

# Wait a moment
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend (Dashboard)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\Rakshit Sharma\Desktop\Fxeno\xeno-dashboard'; npm start"

Write-Host ""
Write-Host "✅ Both services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "  - Backend: http://localhost:4000" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Login Credentials:" -ForegroundColor Cyan
Write-Host "  - Email: admin@xeno.com" -ForegroundColor White
Write-Host "  - Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "📊 You'll see REAL data from your Shopify stores!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
