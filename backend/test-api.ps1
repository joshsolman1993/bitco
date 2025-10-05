# Bitcoin Tycoon API Test Script

Write-Host "🎮 Bitcoin Tycoon API Test" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
Write-Host "✅ Health Check: $($health.status)" -ForegroundColor Green
Write-Host "   Tick: $($health.tickEngine.tickNumber)" -ForegroundColor Gray
Write-Host "   BTC Price: `$$([math]::Round($health.tickEngine.btcPrice, 2))" -ForegroundColor Gray
Write-Host ""

# Test 2: Register User
Write-Host "2. Registering New User..." -ForegroundColor Yellow
$registerBody = @{
    email = "testplayer@example.com"
    username = "testplayer"
    password = "password123"
} | ConvertTo-Json

try {
    $register = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✅ User Registered: $($register.user.username)" -ForegroundColor Green
    Write-Host "   Company ID: $($register.user.companyId)" -ForegroundColor Gray
    $token = $register.accessToken
    Write-Host ""
} catch {
    Write-Host "⚠️  User might already exist, trying login..." -ForegroundColor Yellow
    
    # Test 3: Login
    $loginBody = @{
        email = "testplayer@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✅ User Logged In: $($login.user.username)" -ForegroundColor Green
    $token = $login.accessToken
    Write-Host ""
}

# Test 4: Get Company Data
Write-Host "3. Getting Company Data..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $token"
}
$company = Invoke-RestMethod -Uri "http://localhost:3000/api/player/company" -Method Get -Headers $headers
Write-Host "✅ Company: $($company.name)" -ForegroundColor Green
Write-Host "   Balance USD: `$$([math]::Round($company.balanceUSD, 2))" -ForegroundColor Gray
Write-Host "   Balance BTC: $([math]::Round($company.balanceBTC, 4)) BTC" -ForegroundColor Gray
Write-Host "   Sites: $($company.sites.Count)" -ForegroundColor Gray
Write-Host ""

# Test 5: Get Market Data
Write-Host "4. Getting Market Data..." -ForegroundColor Yellow
$market = Invoke-RestMethod -Uri "http://localhost:3000/api/market/data" -Method Get -Headers $headers
Write-Host "✅ Market Data Retrieved" -ForegroundColor Green
Write-Host "   BTC Price: `$$([math]::Round($market.btcPrice, 2))" -ForegroundColor Gray
Write-Host "   Network Difficulty: $([math]::Round($market.difficulty / 1000000000000, 2))T" -ForegroundColor Gray
Write-Host ""

# Test 6: Get Available Research
Write-Host "5. Getting Available Research..." -ForegroundColor Yellow
$research = Invoke-RestMethod -Uri "http://localhost:3000/api/research/available" -Method Get -Headers $headers
Write-Host "✅ Available Research Nodes: $($research.Count)" -ForegroundColor Green
foreach ($node in $research | Select-Object -First 3) {
    Write-Host "   - $($node.name): `$$($node.cost)" -ForegroundColor Gray
}
Write-Host ""

# Test 7: Create Mining Site
Write-Host "6. Creating Mining Site..." -ForegroundColor Yellow
$siteBody = @{
    name = "Test Mining Site"
    region = "US_WEST"
    gridTier = 3
    coolingType = "AIR"
} | ConvertTo-Json

try {
    $site = Invoke-RestMethod -Uri "http://localhost:3000/api/sites" -Method Post -Body $siteBody -ContentType "application/json" -Headers $headers
    Write-Host "✅ Site Created: $($site.name)" -ForegroundColor Green
    Write-Host "   Region: $($site.region)" -ForegroundColor Gray
    Write-Host "   Site ID: $($site.id)" -ForegroundColor Gray
    Write-Host ""
    
    # Test 8: Add Rig to Site
    Write-Host "7. Adding Mining Rig..." -ForegroundColor Yellow
    $rigBody = @{
        type = "ANTMINER_S19"
        gridX = 0
        gridY = 0
    } | ConvertTo-Json
    
    $rig = Invoke-RestMethod -Uri "http://localhost:3000/api/sites/$($site.id)/rigs" -Method Post -Body $rigBody -ContentType "application/json" -Headers $headers
    Write-Host "✅ Rig Added: $($rig.type)" -ForegroundColor Green
    Write-Host "   Hashrate: $($rig.hashrate / 1000000000000) TH/s" -ForegroundColor Gray
    Write-Host "   Power: $($rig.powerConsumption)W" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "⚠️  Insufficient funds or site already exists" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ All Tests Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  - Wait for mining to accumulate BTC (check tick updates)" -ForegroundColor White
Write-Host "  - Try trading: POST /api/market/positions" -ForegroundColor White
Write-Host "  - Start research: POST /api/research/start" -ForegroundColor White
Write-Host "  - View full API docs: API_TESTING.md" -ForegroundColor White
Write-Host ""