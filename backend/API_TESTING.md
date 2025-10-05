# Bitcoin Tycoon - API Testing Guide

## Quick Start

### 1. Start the Backend
```bash
cd backend
npm run dev
```

### 2. Test Health Endpoint
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Bitcoin Tycoon Backend is running!",
  "tickEngine": {
    "tickNumber": 123,
    "btcPrice": 43250.5,
    "difficulty": 62500000000000,
    "networkHashrate": 450000000,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## Authentication Flow

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player1@example.com",
    "username": "player1",
    "password": "securepassword123"
  }'
```

Response:
```json
{
  "message": "User registered successfully",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "clx...",
    "email": "player1@example.com",
    "username": "player1",
    "companyId": "clx..."
  }
}
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "player1@example.com",
    "password": "securepassword123"
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Player Endpoints

**Note**: All player endpoints require `Authorization: Bearer YOUR_ACCESS_TOKEN` header.

### Get Profile
```bash
curl http://localhost:3000/api/player/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get Company Data
```bash
curl http://localhost:3000/api/player/company \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Response includes:
- Company info (name, balances, reputation)
- All sites with rigs and energy contracts
- Open trading positions
- Research progress
- Active quests
- Unread alerts

### Update Company
```bash
curl -X PUT http://localhost:3000/api/player/company \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Mining Empire",
    "description": "The best mining company in the world"
  }'
```

## Site Management

### Create New Site
```bash
curl -X POST http://localhost:3000/api/sites \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Texas Datacenter",
    "region": "US_WEST",
    "gridTier": 3,
    "coolingType": "LIQUID"
  }'
```

Cost: $10,000 USD

### Add Rig to Site
```bash
curl -X POST http://localhost:3000/api/sites/SITE_ID/rigs \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "ANTMINER_S19",
    "gridX": 0,
    "gridY": 0
  }'
```

Available rig types:
- `ANTMINER_S19` - 110 TH/s, $5,000
- `ANTMINER_S19_PRO` - 110 TH/s, $6,000
- `WHATSMINER_M30S` - 86 TH/s, $4,000
- `WHATSMINER_M50` - 114 TH/s, $7,000

### List All Sites
```bash
curl http://localhost:3000/api/sites \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Add Energy Contract
```bash
curl -X POST http://localhost:3000/api/sites/SITE_ID/energy \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "Texas Power Co",
    "pricePerKWh": 0.07,
    "capacity": 1000,
    "durationDays": 30
  }'
```

## Market Trading

### Get Current Market Data
```bash
curl http://localhost:3000/api/market/data \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Open Spot Position (Buy BTC)
```bash
curl -X POST http://localhost:3000/api/market/positions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "instrument": "BTC_SPOT",
    "side": "LONG",
    "quantity": 0.1
  }'
```

### Open Leveraged Position
```bash
curl -X POST http://localhost:3000/api/market/positions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "instrument": "BTC_PERP",
    "side": "LONG",
    "quantity": 1.0,
    "leverage": 5
  }'
```

### Close Position
```bash
curl -X POST http://localhost:3000/api/market/positions/POSITION_ID/close \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### List All Positions
```bash
curl http://localhost:3000/api/market/positions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Research & Development

### Get Available Research
```bash
curl http://localhost:3000/api/research/available \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Start Research
```bash
curl -X POST http://localhost:3000/api/research/start \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nodeId": "MINING_EFFICIENCY_1"
  }'
```

Available research nodes:
- `MINING_EFFICIENCY_1` - +5% efficiency, $5k
- `MINING_EFFICIENCY_2` - +10% efficiency, $15k (requires MINING_EFFICIENCY_1)
- `COOLING_OPTIMIZATION_1` - -10% cooling costs, $8k
- `FIRMWARE_TUNING_1` - +3% hashrate, $10k
- `TRADING_ALGORITHMS_1` - -5% trading fees, $12k
- `RISK_MANAGEMENT_1` - +10% margin efficiency, $15k
- `AUTOMATION_BASIC` - Unlock automation, $20k
- `COMPLIANCE_TOOLS_1` - +5 regulator rep, $10k

### Get Research Progress
```bash
curl http://localhost:3000/api/research \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Governance

### Get Active Proposals
```bash
curl http://localhost:3000/api/governance/proposals \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Vote on Proposal
```bash
curl -X POST http://localhost:3000/api/governance/proposals/PROPOSAL_ID/vote \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "choice": "FOR"
  }'
```

Choices: `FOR`, `AGAINST`, `ABSTAIN`

Vote weight is based on average reputation (1-11).

### Create Proposal
```bash
curl -X POST http://localhost:3000/api/governance/proposals \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "REGULATION",
    "title": "Reduce Energy Costs",
    "description": "Subsidize energy costs for all miners by 10%",
    "durationHours": 24
  }'
```

## WebSocket Connection

### JavaScript Example
```javascript
const ws = new WebSocket('ws://localhost:3000/ws')

ws.onopen = () => {
  console.log('Connected to WebSocket')
  
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    data: { token: 'YOUR_ACCESS_TOKEN' }
  }))
}

ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  console.log('Received:', message)
  
  switch (message.type) {
    case 'auth_success':
      console.log('Authenticated!', message)
      break
      
    case 'tick:update':
      console.log('Tick:', message.data.tickNumber)
      console.log('BTC Price:', message.data.btcPrice)
      break
      
    case 'alert':
      console.log('Alert:', message.data)
      break
      
    case 'player:update':
      console.log('Player update:', message.data)
      break
  }
}

ws.onerror = (error) => {
  console.error('WebSocket error:', error)
}

ws.onclose = () => {
  console.log('Disconnected from WebSocket')
}

// Send ping
setInterval(() => {
  ws.send(JSON.stringify({ type: 'ping' }))
}, 30000)
```

### Node.js Example
```javascript
const WebSocket = require('ws')

const ws = new WebSocket('ws://localhost:3000/ws')

ws.on('open', () => {
  console.log('Connected')
  ws.send(JSON.stringify({
    type: 'auth',
    data: { token: process.env.ACCESS_TOKEN }
  }))
})

ws.on('message', (data) => {
  const message = JSON.parse(data)
  console.log('Received:', message)
})
```

## Complete User Flow Example

```bash
# 1. Register
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}')

# Extract token
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')

# 2. Get company data
curl http://localhost:3000/api/player/company \
  -H "Authorization: Bearer $TOKEN"

# 3. Create a site
curl -X POST http://localhost:3000/api/sites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My First Site","region":"US_WEST"}'

# 4. Add a rig (get site ID from previous response)
curl -X POST http://localhost:3000/api/sites/SITE_ID/rigs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"ANTMINER_S19","gridX":0,"gridY":0}'

# 5. Wait for mining to accumulate BTC (check tick updates)

# 6. Sell some BTC
curl -X POST http://localhost:3000/api/market/positions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"instrument":"BTC_SPOT","side":"SHORT","quantity":0.1}'

# 7. Start research
curl -X POST http://localhost:3000/api/research/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nodeId":"MINING_EFFICIENCY_1"}'
```

## Monitoring Tick Engine

The tick engine runs every 5 seconds. You can monitor it by:

1. **Health endpoint** - Shows current tick data
2. **WebSocket** - Receive tick updates in real-time
3. **Server logs** - Watch console output

Example log output:
```
🎮 Starting tick engine...
✅ Tick engine started (5s interval)
Tick 1: BTC $43,250.00
Tick 2: BTC $43,180.50
⚠️  Tick 3 took 1200ms (slow)
```

## Troubleshooting

### "Access token required"
- Make sure you're sending the `Authorization: Bearer TOKEN` header
- Check that your token hasn't expired (1 hour lifetime)
- Use refresh token to get a new access token

### "Insufficient funds"
- Check company balance: `GET /api/player/company`
- Wait for mining to generate BTC
- Sell BTC for USD if needed

### "Position already occupied"
- Each grid position can only have one rig
- Use different gridX/gridY coordinates

### "Prerequisites not met"
- Check research dependencies
- Complete prerequisite research first

### WebSocket not connecting
- Ensure backend is running
- Check WebSocket URL: `ws://localhost:3000/ws`
- Verify firewall settings

## Performance Testing

### Load Test with Apache Bench
```bash
# Test health endpoint
ab -n 1000 -c 10 http://localhost:3000/api/health

# Test authenticated endpoint (with token)
ab -n 1000 -c 10 -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/player/company
```

### Monitor Tick Performance
Watch server logs for tick duration warnings. Ticks should complete in < 1 second.

---

**Happy Testing!** 🚀

For more information, see:
- `PHASE3_COMPLETE.md` - Full backend documentation
- `backend.md` - Backend specification
- `project.md` - Game design document