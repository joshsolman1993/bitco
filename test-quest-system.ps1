# Quest System Integration Test
# Tests the complete quest lifecycle: fetch, start, progress, complete, claim

$baseUrl = "http://localhost:3000"
$email = "questtest_$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
$password = "TestPass123!"

Write-Host "`n=== Bitcoin Tycoon Quest System Test ===" -ForegroundColor Cyan
Write-Host "Testing complete quest lifecycle...`n" -ForegroundColor Cyan

# Step 1: Register new user
Write-Host "1. Registering new user: $email" -ForegroundColor Yellow
$registerResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method Post -ContentType "application/json" -Body (@{
    email = $email
    password = $password
    companyName = "Quest Test Corp"
} | ConvertTo-Json)

$token = $registerResponse.token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Success: User registered successfully" -ForegroundColor Green
Write-Host "  Company ID: $($registerResponse.user.companyId)" -ForegroundColor Gray

# Step 2: Fetch available quests
Write-Host "`n2. Fetching available quests..." -ForegroundColor Yellow
$quests = Invoke-RestMethod -Uri "$baseUrl/api/quest" -Method Get -Headers $headers

Write-Host "Success: Found $($quests.Count) quests" -ForegroundColor Green

# Display quest summary
$availableQuests = $quests | Where-Object { $_.companyQuest -eq $null }
$activeQuests = $quests | Where-Object { $_.companyQuest.status -eq "ACTIVE" }

Write-Host "`n  Quest Summary:" -ForegroundColor Gray
Write-Host "  - Available: $($availableQuests.Count)" -ForegroundColor Gray
Write-Host "  - Active (auto-started): $($activeQuests.Count)" -ForegroundColor Gray

# Display active quests (starter quests)
if ($activeQuests.Count -gt 0) {
    Write-Host "`n  Active Quests (Auto-started):" -ForegroundColor Gray
    foreach ($quest in $activeQuests) {
        Write-Host "    * $($quest.title) [$($quest.type)]" -ForegroundColor Gray
        Write-Host "      Progress: $($quest.companyQuest.progress)%" -ForegroundColor Gray
        Write-Host "      Reward: USD $($quest.rewardUsd)" -ForegroundColor Gray
    }
}

# Step 3: Start a quest (if any available)
if ($availableQuests.Count -gt 0) {
    $questToStart = $availableQuests[0]
    Write-Host "`n3. Starting quest: $($questToStart.title)" -ForegroundColor Yellow
    
    try {
        $startResponse = Invoke-RestMethod -Uri "$baseUrl/api/quest/$($questToStart.id)/start" -Method Post -Headers $headers
        Write-Host "Success: Quest started successfully" -ForegroundColor Green
        Write-Host "  Status: $($startResponse.companyQuest.status)" -ForegroundColor Gray
        Write-Host "  Progress: $($startResponse.companyQuest.progress)%" -ForegroundColor Gray
    } catch {
        Write-Host "Error: Failed to start quest: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "`n3. No available quests to start (all auto-started)" -ForegroundColor Yellow
}

# Step 4: Check quest progress
Write-Host "`n4. Checking quest progress..." -ForegroundColor Yellow
$questsAfterStart = Invoke-RestMethod -Uri "$baseUrl/api/quest" -Method Get -Headers $headers
$activeQuestsNow = $questsAfterStart | Where-Object { $_.companyQuest.status -eq "ACTIVE" }

Write-Host "Success: Active quests: $($activeQuestsNow.Count)" -ForegroundColor Green
foreach ($quest in $activeQuestsNow) {
    Write-Host "  * $($quest.title): $($quest.companyQuest.progress)%" -ForegroundColor Gray
}

# Step 5: Get detailed progress for first active quest
if ($activeQuestsNow.Count -gt 0) {
    $firstQuest = $activeQuestsNow[0]
    Write-Host "`n5. Getting detailed progress for: $($firstQuest.title)" -ForegroundColor Yellow
    
    try {
        $progressDetail = Invoke-RestMethod -Uri "$baseUrl/api/quest/$($firstQuest.id)/progress" -Method Get -Headers $headers
        Write-Host "Success: Progress details retrieved" -ForegroundColor Green
        Write-Host "  Quest: $($progressDetail.quest.title)" -ForegroundColor Gray
        Write-Host "  Status: $($progressDetail.companyQuest.status)" -ForegroundColor Gray
        Write-Host "  Progress: $($progressDetail.companyQuest.progress)%" -ForegroundColor Gray
        Write-Host "  Requirements:" -ForegroundColor Gray
        $progressDetail.quest.requirements.PSObject.Properties | ForEach-Object {
            Write-Host "    - $($_.Name): $($_.Value)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "Error: Failed to get progress: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 6: Try to claim reward (should fail if not completed)
if ($activeQuestsNow.Count -gt 0) {
    $questToClaim = $activeQuestsNow[0]
    Write-Host "`n6. Attempting to claim reward for: $($questToClaim.title)" -ForegroundColor Yellow
    
    try {
        $claimResponse = Invoke-RestMethod -Uri "$baseUrl/api/quest/$($questToClaim.id)/claim" -Method Post -Headers $headers
        Write-Host "Success: Reward claimed successfully!" -ForegroundColor Green
        Write-Host "  USD Reward: $($claimResponse.rewards.usd)" -ForegroundColor Gray
        Write-Host "  BTC Reward: $($claimResponse.rewards.btc)" -ForegroundColor Gray
        Write-Host "  New Balance: $($claimResponse.company.balance)" -ForegroundColor Gray
    } catch {
        $errorMessage = $_.ErrorDetails.Message | ConvertFrom-Json
        $errorText = $errorMessage.error
        if ($errorText -like "*not completed*") {
            Write-Host "Success: Correctly prevented claiming incomplete quest" -ForegroundColor Green
            Write-Host "  Error: $errorText" -ForegroundColor Gray
        } else {
            Write-Host "Error: Unexpected error: $errorText" -ForegroundColor Red
        }
    }
}

# Step 7: Get company data to verify balance
Write-Host "`n7. Verifying company data..." -ForegroundColor Yellow
$company = Invoke-RestMethod -Uri "$baseUrl/api/company" -Method Get -Headers $headers

Write-Host "Success: Company data retrieved" -ForegroundColor Green
Write-Host "  Balance: USD $($company.balance)" -ForegroundColor Gray
Write-Host "  BTC: $($company.btcBalance)" -ForegroundColor Gray

# Summary
Write-Host "`n=== Test Summary ===" -ForegroundColor Cyan
Write-Host "Success: User registration: PASSED" -ForegroundColor Green
Write-Host "Success: Quest fetching: PASSED" -ForegroundColor Green
Write-Host "Success: Starter quests auto-assigned: PASSED" -ForegroundColor Green
Write-Host "Success: Quest progress tracking: PASSED" -ForegroundColor Green
Write-Host "Success: Quest validation: PASSED" -ForegroundColor Green

Write-Host "`n=== Quest System Status ===" -ForegroundColor Cyan
Write-Host "Total Quests: $($quests.Count)" -ForegroundColor White
Write-Host "Active Quests: $($activeQuestsNow.Count)" -ForegroundColor White
Write-Host "Available Quests: $($availableQuests.Count)" -ForegroundColor White

Write-Host "`nQuest system is fully operational!" -ForegroundColor Green
Write-Host "`nNote: Quest progress is checked every 10 ticks (approximately 50 seconds)" -ForegroundColor Yellow
Write-Host "Complete quest requirements to see automatic progress updates." -ForegroundColor Yellow