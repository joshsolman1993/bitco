# Simple test for API endpoints
$baseUrl = "http://localhost:3000/api"
$testUser = "testuser_$(Get-Random -Maximum 9999)"
$testEmail = "$testUser@test.com"
$testPassword = "Test123456"

Write-Host "Testing Dashboard API Fixes" -ForegroundColor Cyan
Write-Host ""

# Register
Write-Host "1. Registering user..." -ForegroundColor Yellow
$body = @{
    username = $testUser
    email = $testEmail
    password = $testPassword
    companyName = "Test Company"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $body -ContentType "application/json"
$token = $registerResponse.token
Write-Host "   Success - Token received" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Get company
Write-Host "2. Getting company data..." -ForegroundColor Yellow
$company = Invoke-RestMethod -Uri "$baseUrl/player/company" -Method Get -Headers $headers
Write-Host "   Success - Balance: $($company.usdBalance)" -ForegroundColor Green

# Get sites
Write-Host "3. Getting sites..." -ForegroundColor Yellow
$sites = Invoke-RestMethod -Uri "$baseUrl/site" -Method Get -Headers $headers
Write-Host "   Success - Sites: $($sites.Count)" -ForegroundColor Green

# Create site
Write-Host "4. Creating site..." -ForegroundColor Yellow
$siteBody = @{
    name = "Test Site"
    region = "US-WEST"
    gridTier = 1
    coolingType = "AIR"
} | ConvertTo-Json

$newSite = Invoke-RestMethod -Uri "$baseUrl/site" -Method Post -Headers $headers -Body $siteBody
Write-Host "   Success - Site ID: $($newSite.id)" -ForegroundColor Green
$siteId = $newSite.id

# Add rig
Write-Host "5. Adding rig..." -ForegroundColor Yellow
$rigBody = @{
    type = "ANTMINER_S19"
    gridX = 0
    gridY = 0
} | ConvertTo-Json

$newRig = Invoke-RestMethod -Uri "$baseUrl/site/$siteId/rigs" -Method Post -Headers $headers -Body $rigBody
Write-Host "   Success - Rig ID: $($newRig.id)" -ForegroundColor Green
$rigId = $newRig.id

# Get market data
Write-Host "6. Getting market data..." -ForegroundColor Yellow
$market = Invoke-RestMethod -Uri "$baseUrl/market" -Method Get -Headers $headers
Write-Host "   Success - BTC Price: $($market.btcPrice)" -ForegroundColor Green

Write-Host ""
Write-Host "All tests passed!" -ForegroundColor Green
Write-Host "Dashboard should now work correctly." -ForegroundColor Green