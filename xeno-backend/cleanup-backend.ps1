# Clean up xeno-backend directory - Remove all unnecessary files

Write-Host "🧹 Cleaning up xeno-backend directory..." -ForegroundColor Yellow

# Remove all test files
Write-Host "Removing test files..." -ForegroundColor Cyan
Get-ChildItem -Name "test-*.js" | Remove-Item -Force
Get-ChildItem -Name "check-*.js" | Remove-Item -Force
Get-ChildItem -Name "debug-*.js" | Remove-Item -Force
Get-ChildItem -Name "verify-*.js" | Remove-Item -Force
Get-ChildItem -Name "quick-*.js" | Remove-Item -Force
Get-ChildItem -Name "simple-*.js" | Remove-Item -Force
Get-ChildItem -Name "diagnose-*.js" | Remove-Item -Force
Get-ChildItem -Name "force-*.js" | Remove-Item -Force
Get-ChildItem -Name "run-*.js" | Remove-Item -Force
Get-ChildItem -Name "manage-*.js" | Remove-Item -Force
Get-ChildItem -Name "register-*.js" | Remove-Item -Force
Get-ChildItem -Name "setup-*.js" | Remove-Item -Force
Get-ChildItem -Name "working-*.js" | Remove-Item -Force
Get-ChildItem -Name "complete-*.js" | Remove-Item -Force
Get-ChildItem -Name "final-*.js" | Remove-Item -Force
Get-ChildItem -Name "fix-*.js" | Remove-Item -Force
Get-ChildItem -Name "real-*.js" | Remove-Item -Force
Get-ChildItem -Name "neon-*.js" | Remove-Item -Force
Get-ChildItem -Name "cron-*.js" | Remove-Item -Force
Get-ChildItem -Name "sync-*.js" | Remove-Item -Force

# Remove batch files
Write-Host "Removing batch files..." -ForegroundColor Cyan
Get-ChildItem -Name "start-*.bat" | Remove-Item -Force

# Remove old backend files
Write-Host "Removing old backend files..." -ForegroundColor Cyan
Remove-Item "fixed-backend.js" -Force -ErrorAction SilentlyContinue
Remove-Item "fixed-neon-backend.js" -Force -ErrorAction SilentlyContinue
Remove-Item "production-backend.js" -Force -ErrorAction SilentlyContinue
Remove-Item "deploy-config.js" -Force -ErrorAction SilentlyContinue
Remove-Item "complete-backend.js" -Force -ErrorAction SilentlyContinue
Remove-Item "simple-database-backend.js" -Force -ErrorAction SilentlyContinue
Remove-Item "real-shopify-backend.js" -Force -ErrorAction SilentlyContinue

# Remove directories
Write-Host "Removing unnecessary directories..." -ForegroundColor Cyan
Remove-Item "data" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "src" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "config" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "lib" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "prisma" -Recurse -Force -ErrorAction SilentlyContinue

# Remove other files
Write-Host "Removing other unnecessary files..." -ForegroundColor Cyan
Remove-Item "Dockerfile" -Force -ErrorAction SilentlyContinue
Remove-Item "railway.json" -Force -ErrorAction SilentlyContinue

Write-Host "✅ Backend cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Remaining files:" -ForegroundColor Yellow
Get-ChildItem | Select-Object Name, Length | Format-Table -AutoSize

Write-Host ""
Write-Host "🎯 Backend is now clean with only essential files!" -ForegroundColor Green
