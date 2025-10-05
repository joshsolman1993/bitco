# Test WebSocket and Header Fixes
Write-Host "=== Testing WebSocket & Header Bug Fixes ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api"
$headers = @{ "Content-Type" = "application/json" }

# Generate unique email for testing
$timestamp = [DateTimeOffset]::Now.ToUnixTimeSeconds()
$testEmail = "test$timestamp@example.com"

Write-Host "1. Testing User Registration..." -ForegroundColor Yellow
$registerBody = @{
    email = $testEmail
    password = "password123"
    companyName = "WebSocket Test Co"
    region = "NORTH_AMERICA"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Headers $headers -Body $registerBody
    Write-Host "   ✓ Registration successful" -ForegroundColor Green
    Write-Host "   User: $($registerResponse.user.email)" -ForegroundColor Gray
    Write-Host "   Company: $($registerResponse.company.name)" -ForegroundColor Gray
    Write-Host "   Balance: `$$($registerResponse.company.balance)" -ForegroundColor Gray
    Write-Host "   BTC: $($registerResponse.company.btcBalance)" -ForegroundColor Gray
    
    # Check if accessToken exists
    if ($registerResponse.accessToken) {
        Write-Host "   ✓ Access token received (length: $($registerResponse.accessToken.Length))" -ForegroundColor Green
        $token = $registerResponse.accessToken
    } else {
        Write-Host "   ✗ No access token in response!" -ForegroundColor Red
        Write-Host "   Response keys: $($registerResponse.PSObject.Properties.Name -join ', ')" -ForegroundColor Gray
        exit 1
    }
    
    # Check reputation structure
    if ($registerResponse.company.reputation) {
        Write-Host "   ✓ Reputation structure correct:" -ForegroundColor Green
        Write-Host "     - Miners: $($registerResponse.company.reputation.miners)" -ForegroundColor Gray
        Write-Host "     - Traders: $($registerResponse.company.reputation.traders)" -ForegroundColor Gray
        Write-Host "     - Regulators: $($registerResponse.company.reputation.regulators)" -ForegroundColor Gray
        Write-Host "     - Anarchists: $($registerResponse.company.reputation.anarchists)" -ForegroundColor Gray
    } else {
        Write-Host "   ✗ Reputation structure missing!" -ForegroundColor Red
    }
    
} catch {
    Write-Host "   ✗ Registration failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2. Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Headers $headers -Body $loginBody
    Write-Host "   ✓ Login successful" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.user.email)" -ForegroundColor Gray
    Write-Host "   Company: $($loginResponse.company.name)" -ForegroundColor Gray
    
    if ($loginResponse.accessToken) {
        Write-Host "   ✓ Access token received" -ForegroundColor Green
        $token = $loginResponse.accessToken
    } else {
        Write-Host "   ✗ No access token in response!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "   ✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "3. Testing Authenticated API Calls..." -ForegroundColor Yellow
$authHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

try {
    # Test profile endpoint
    $profile = Invoke-RestMethod -Uri "$baseUrl/player/profile" -Method GET -Headers $authHeaders
    Write-Host "   ✓ Profile endpoint works" -ForegroundColor Green
    
    # Test company endpoint
    $company = Invoke-RestMethod -Uri "$baseUrl/player/company" -Method GET -Headers $authHeaders
    Write-Host "   ✓ Company endpoint works" -ForegroundColor Green
    Write-Host "   Company balance: `$$($company.usdBalance)" -ForegroundColor Gray
    Write-Host "   Company BTC: $($company.btcBalance)" -ForegroundColor Gray
    
    # Test market data endpoint
    $market = Invoke-RestMethod -Uri "$baseUrl/market/data" -Method GET -Headers $authHeaders
    Write-Host "   ✓ Market data endpoint works" -ForegroundColor Green
    Write-Host "   BTC Price: `$$($market.btcPrice)" -ForegroundColor Gray
    
} catch {
    Write-Host "   ✗ API call failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "4. Testing WebSocket Connection..." -ForegroundColor Yellow
Write-Host "   Note: WebSocket testing requires manual browser verification" -ForegroundColor Gray
Write-Host "   Expected console output:" -ForegroundColor Gray
Write-Host "   - [WS] Connecting to ws://localhost:3000/ws" -ForegroundColor DarkGray
Write-Host "   - [WS] Connected" -ForegroundColor DarkGray
Write-Host "   - [WS] Message received: connected" -ForegroundColor DarkGray
Write-Host "   - [WS] Connection acknowledged by server" -ForegroundColor DarkGray
Write-Host "   - [WS] Message received: auth_success" -ForegroundColor DarkGray
Write-Host "   - [WS] Authentication successful" -ForegroundColor DarkGray

Write-Host ""
Write-Host "=== All Backend Tests Passed! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open browser to http://localhost:5173" -ForegroundColor White
Write-Host "2. Login with:" -ForegroundColor White
Write-Host "   Email: $testEmail" -ForegroundColor Yellow
Write-Host "   Password: password123" -ForegroundColor Yellow
Write-Host "3. Check browser console for WebSocket messages" -ForegroundColor White
Write-Host "4. Verify Header displays balance without errors" -ForegroundColor White
Write-Host ""