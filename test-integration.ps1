# Bitcoin Tycoon - Integration Test Script
# Tests the complete frontend-backend integration

Write-Host "🎮 Bitcoin Tycoon - Integration Test" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api"
$testEmail = "integration-test-$(Get-Random)@example.com"
$testPassword = "testpass123"
$testCompany = "Integration Test Co"

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "✅ Backend is healthy" -ForegroundColor Green
    Write-Host "   Tick: $($response.tickEngine.tickNumber)" -ForegroundColor Gray
    Write-Host "   BTC Price: `$$($response.tickEngine.btcPrice)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: User Registration
Write-Host "Test 2: User Registration" -ForegroundColor Yellow
try {
    $registerData = @{
        email = $testEmail
        password = $testPassword
        companyName = $testCompany
        region = "US_WEST"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    $accessToken = $response.accessToken
    $refreshToken = $response.refreshToken
    $userId = $response.user.id
    $companyId = $response.company.id
    
    Write-Host "✅ Registration successful" -ForegroundColor Green
    Write-Host "   User ID: $userId" -ForegroundColor Gray
    Write-Host "   Company: $($response.company.name)" -ForegroundColor Gray
    Write-Host "   Balance: `$$($response.company.balance)" -ForegroundColor Gray
    Write-Host "   Region: $($response.company.region)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Registration failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Get Profile
Write-Host "Test 3: Get Profile" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/player/profile" -Method Get -Headers $headers
    Write-Host "✅ Profile retrieved" -ForegroundColor Green
    Write-Host "   Email: $($response.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Profile retrieval failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 4: Get Company Data
Write-Host "Test 4: Get Company Data" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/player/company" -Method Get -Headers $headers
    Write-Host "✅ Company data retrieved" -ForegroundColor Green
    Write-Host "   Balance: `$$($response.balance)" -ForegroundColor Gray
    Write-Host "   BTC: $($response.btcBalance) BTC" -ForegroundColor Gray
    Write-Host "   Reputation: $($response.reputation)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Company data retrieval failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 5: Get Market Data
Write-Host "Test 5: Get Market Data" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/market/data" -Method Get -Headers $headers
    Write-Host "✅ Market data retrieved" -ForegroundColor Green
    Write-Host "   BTC Price: `$$($response.btcPrice)" -ForegroundColor Gray
    Write-Host "   Difficulty: $($response.difficulty)" -ForegroundColor Gray
    Write-Host "   Network Hashrate: $($response.networkHashrate) H/s" -ForegroundColor Gray
} catch {
    Write-Host "❌ Market data retrieval failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 6: Create Mining Site
Write-Host "Test 6: Create Mining Site" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $siteData = @{
        name = "Test Site 1"
        region = "US_WEST"
        gridTier = 1
        coolingType = "AIR"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/site" -Method Post -Body $siteData -ContentType "application/json" -Headers $headers
    $siteId = $response.id
    
    Write-Host "✅ Mining site created" -ForegroundColor Green
    Write-Host "   Site ID: $siteId" -ForegroundColor Gray
    Write-Host "   Name: $($response.name)" -ForegroundColor Gray
    Write-Host "   Region: $($response.region)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Site creation failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 7: Add Mining Rig
Write-Host "Test 7: Add Mining Rig" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $rigData = @{
        type = "ANTMINER_S19"
        gridX = 0
        gridY = 0
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/site/$siteId/rigs" -Method Post -Body $rigData -ContentType "application/json" -Headers $headers
    
    Write-Host "✅ Mining rig added" -ForegroundColor Green
    Write-Host "   Rig ID: $($response.id)" -ForegroundColor Gray
    Write-Host "   Type: $($response.type)" -ForegroundColor Gray
    Write-Host "   Hashrate: $($response.hashrate) H/s" -ForegroundColor Gray
    Write-Host "   Efficiency: $($response.efficiency) J/TH" -ForegroundColor Gray
} catch {
    Write-Host "❌ Rig addition failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 8: Get Available Research
Write-Host "Test 8: Get Available Research" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/research/available" -Method Get -Headers $headers
    Write-Host "✅ Research nodes retrieved" -ForegroundColor Green
    Write-Host "   Available nodes: $($response.Count)" -ForegroundColor Gray
    if ($response.Count -gt 0) {
        Write-Host "   First node: $($response[0].name)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Research retrieval failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 9: Get Sites List
Write-Host "Test 9: Get Sites List" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/site" -Method Get -Headers $headers
    Write-Host "✅ Sites list retrieved" -ForegroundColor Green
    Write-Host "   Total sites: $($response.Count)" -ForegroundColor Gray
    if ($response.Count -gt 0) {
        Write-Host "   Site 1: $($response[0].name)" -ForegroundColor Gray
        Write-Host "   Rigs: $($response[0].rigs.Count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Sites list retrieval failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 10: Logout
Write-Host "Test 10: Logout" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    
    $logoutData = @{
        refreshToken = $refreshToken
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/logout" -Method Post -Body $logoutData -ContentType "application/json" -Headers $headers
    Write-Host "✅ Logout successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Logout failed: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Summary
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ All Integration Tests Passed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test User Created:" -ForegroundColor Yellow
Write-Host "  Email: $testEmail" -ForegroundColor Gray
Write-Host "  Password: $testPassword" -ForegroundColor Gray
Write-Host "  Company: $testCompany" -ForegroundColor Gray
Write-Host ""
Write-Host "You can now test the frontend at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Login with the credentials above to see your mining site!" -ForegroundColor Cyan