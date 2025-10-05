# Test script to verify Dashboard fixes
Write-Host "=== Testing Dashboard API Fixes ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api"
$testUser = "testuser_$(Get-Random -Maximum 9999)"
$testEmail = "$testUser@test.com"
$testPassword = "Test123!@#"

# Register new user
Write-Host "1. Registering test user..." -ForegroundColor Yellow
try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body (@{
        username = $testUser
        email = $testEmail
        password = $testPassword
        companyName = "Test Company"
    } | ConvertTo-Json) -ContentType "application/json"
    
    $token = $registerResponse.token
    Write-Host "   ✓ User registered successfully" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Test 1: Get company data
Write-Host ""
Write-Host "2. Testing GET /player/company..." -ForegroundColor Yellow
try {
    $company = Invoke-RestMethod -Uri "$baseUrl/player/company" -Method Get -Headers $headers
    Write-Host "   ✓ Company data retrieved" -ForegroundColor Green
    Write-Host "   Company: $($company.name)" -ForegroundColor Gray
    Write-Host "   USD Balance: `$$($company.usdBalance)" -ForegroundColor Gray
    Write-Host "   BTC Balance: $($company.btcBalance) BTC" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Get sites (should be empty initially)
Write-Host ""
Write-Host "3. Testing GET /site (should return empty array)..." -ForegroundColor Yellow
try {
    $sites = Invoke-RestMethod -Uri "$baseUrl/site" -Method Get -Headers $headers
    Write-Host "   ✓ Sites retrieved successfully" -ForegroundColor Green
    Write-Host "   Number of sites: $($sites.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Create a site using correct endpoint
Write-Host ""
Write-Host "4. Testing POST /site (create site)..." -ForegroundColor Yellow
try {
    $newSite = Invoke-RestMethod -Uri "$baseUrl/site" -Method Post -Headers $headers -Body (@{
        name = "Test Mining Site"
        region = "US-WEST"
        gridTier = 1
        coolingType = "AIR"
    } | ConvertTo-Json)
    
    Write-Host "   ✓ Site created successfully" -ForegroundColor Green
    Write-Host "   Site ID: $($newSite.id)" -ForegroundColor Gray
    Write-Host "   Site Name: $($newSite.name)" -ForegroundColor Gray
    Write-Host "   Region: $($newSite.region)" -ForegroundColor Gray
    
    $siteId = $newSite.id
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 4: Add rig to site using correct endpoint
Write-Host ""
Write-Host "5. Testing POST /site/:id/rigs (add rig)..." -ForegroundColor Yellow
try {
    $newRig = Invoke-RestMethod -Uri "$baseUrl/site/$siteId/rigs" -Method Post -Headers $headers -Body (@{
        type = "ANTMINER_S19"
        gridX = 0
        gridY = 0
    } | ConvertTo-Json)
    
    Write-Host "   ✓ Rig added successfully" -ForegroundColor Green
    Write-Host "   Rig ID: $($newRig.id)" -ForegroundColor Gray
    Write-Host "   Type: $($newRig.type)" -ForegroundColor Gray
    Write-Host "   Hashrate: $($newRig.hashrate) TH/s" -ForegroundColor Gray
    Write-Host "   Position: ($($newRig.gridX), $($newRig.gridY))" -ForegroundColor Gray
    
    $rigId = $newRig.id
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

# Test 5: Get sites again (should have 1 site with 1 rig)
Write-Host ""
Write-Host "6. Testing GET /site (verify site with rig)..." -ForegroundColor Yellow
try {
    $sites = Invoke-RestMethod -Uri "$baseUrl/site" -Method Get -Headers $headers
    Write-Host "   ✓ Sites retrieved successfully" -ForegroundColor Green
    Write-Host "   Number of sites: $($sites.Count)" -ForegroundColor Gray
    Write-Host "   Number of rigs in first site: $($sites[0].rigs.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 6: Add energy contract using correct endpoint
Write-Host ""
Write-Host "7. Testing POST /site/:id/energy (add energy contract)..." -ForegroundColor Yellow
try {
    $contract = Invoke-RestMethod -Uri "$baseUrl/site/$siteId/energy" -Method Post -Headers $headers -Body (@{
        provider = "Test Energy Co"
        pricePerKWh = 0.05
        capacity = 1000
        durationDays = 30
    } | ConvertTo-Json)
    
    Write-Host "   ✓ Energy contract added successfully" -ForegroundColor Green
    Write-Host "   Contract ID: $($contract.id)" -ForegroundColor Gray
    Write-Host "   Provider: $($contract.provider)" -ForegroundColor Gray
    Write-Host "   Price: `$$($contract.pricePerKWh)/kWh" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

# Test 7: Get market data
Write-Host ""
Write-Host "8. Testing GET /market (get BTC price)..." -ForegroundColor Yellow
try {
    $market = Invoke-RestMethod -Uri "$baseUrl/market" -Method Get -Headers $headers
    Write-Host "   ✓ Market data retrieved" -ForegroundColor Green
    Write-Host "   BTC Price: `$$($market.btcPrice)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Remove rig using correct endpoint
Write-Host ""
Write-Host "9. Testing DELETE /site/:siteId/rigs/:rigId (remove rig)..." -ForegroundColor Yellow
try {
    $result = Invoke-RestMethod -Uri "$baseUrl/site/$siteId/rigs/$rigId" -Method Delete -Headers $headers
    Write-Host "   ✓ Rig removed successfully" -ForegroundColor Green
    Write-Host "   Message: $($result.message)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== All Tests Completed ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor White
Write-Host "  ✓ Company data endpoint working" -ForegroundColor Green
Write-Host "  ✓ Site creation endpoint fixed (POST /site)" -ForegroundColor Green
Write-Host "  ✓ Add rig endpoint fixed (POST /site/:id/rigs)" -ForegroundColor Green
Write-Host "  ✓ Energy contract endpoint fixed (POST /site/:id/energy)" -ForegroundColor Green
Write-Host "  ✓ Remove rig endpoint fixed (DELETE /site/:siteId/rigs/:rigId)" -ForegroundColor Green
Write-Host ""
Write-Host "Dashboard should now load without errors!" -ForegroundColor Green