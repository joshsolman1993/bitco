# Login and check balance
$loginBody = @{
    email = "testplayer@example.com"
    password = "password123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $login.accessToken

$headers = @{
    Authorization = "Bearer $token"
}

$company = Invoke-RestMethod -Uri "http://localhost:3000/api/player/company" -Method Get -Headers $headers

Write-Host "Company Data:" -ForegroundColor Cyan
$company | ConvertTo-Json -Depth 3