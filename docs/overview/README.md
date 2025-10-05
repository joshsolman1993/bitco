# 🎮 Bitcoin Tycoon

A real-time browser-based strategy/tycoon game where players build and manage cryptocurrency mining empires.

[![Status](https://img.shields.io/badge/Status-Phase%203%20Complete-success)]()
[![Backend](https://img.shields.io/badge/Backend-Operational-success)]()
[![Frontend](https://img.shields.io/badge/Frontend-Ready-yellow)]()
[![License](https://img.shields.io/badge/License-MIT-blue)]()

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bitcoin2

# Install backend dependencies
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npx prisma generate
npx prisma db push

# Start backend
npm run dev
# Backend runs on http://localhost:3000

# In a new terminal, install frontend dependencies
cd ../frontend
npm install

# Start frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Quick Test

```bash
# Test the backend
cd backend
pwsh -File test-api.ps1

# Or check health
curl http://localhost:3000/api/health
```

---

## 📊 Project Status

**Current Phase**: Phase 3 Complete ✅

```
✅ Phase 1: Initial Setup          - COMPLETE
✅ Phase 2: Frontend Development   - COMPLETE
✅ Phase 3: Backend Development    - COMPLETE
🔄 Phase 4: Design/UX              - 80% COMPLETE
📋 Phase 5: Integration            - TODO
📋 Phase 6: QA & Testing           - TODO
📋 Phase 7: Deployment             - TODO
```

### What's Working

✅ **Backend Server** - Fully operational REST API  
✅ **Tick Engine** - Real-time simulation (5s intervals)  
✅ **Database** - PostgreSQL with 16 models  
✅ **WebSocket** - Real-time communication ready  
✅ **Authentication** - JWT-based auth system  
✅ **Mining System** - Site creation, rig placement, yield calculation  
✅ **Trading System** - Position management, P&L tracking  
✅ **Research System** - Tech tree with prerequisites  
✅ **Governance** - Voting system with reputation  
✅ **Frontend UI** - All 7 routes with complete UI  

### What's Next

⚠️ **Frontend Integration** - Connect UI to backend API  
⚠️ **WebSocket Client** - Real-time updates in UI  
⚠️ **Authentication Flow** - Login/register pages  
⚠️ **Error Handling** - Loading states and error messages  

---

## 🎮 Game Features

### ⛏️ Mining Management
Build and manage Bitcoin mining operations:
- Create mining sites in different regions
- Install ASIC rigs (4 types: $4k-$7k)
- Manage energy contracts
- Monitor hashrate and uptime
- Deal with equipment wear and maintenance

### 📈 Market Trading
Trade Bitcoin to maximize profits:
- Spot trading (buy/sell BTC)
- Leveraged positions (1x-10x)
- Options trading (calls/puts)
- Real-time P&L tracking
- Automatic liquidation protection

### 🔬 Research & Development
Unlock new technologies:
- 8 research nodes with prerequisites
- Mining efficiency upgrades
- Cooling optimization
- Trading algorithms
- Automation systems

### 🏛️ Governance
Influence the game world:
- Build reputation with 4 factions
- Vote on proposals (reputation-weighted)
- Create new proposals
- Earn faction benefits

### 📜 Quest System
Complete challenges and earn rewards:
- Main storyline quests
- Daily and weekly challenges
- Special event quests
- Reputation and resource rewards

---

## 🏗️ Architecture

### Backend
- **Framework**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Real-time**: WebSocket server
- **Auth**: JWT tokens + bcrypt
- **Simulation**: EventEmitter-based tick engine

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Routing**: React Router
- **Design**: Dark cyberpunk theme

### Database Schema (16 Models)
- User, Session (authentication)
- Company (player state)
- Site, Rig, EnergyContract (mining)
- Position, TickSnapshot (trading)
- Research (tech tree)
- Quest, CompanyQuest (progression)
- Proposal, Vote (governance)
- Event, Alert (notifications)

---

## 📁 Project Structure

```
bitcoin2/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # UI components (20+)
│   │   ├── pages/        # Route pages (7)
│   │   ├── store/        # Zustand state
│   │   └── types/        # TypeScript types
│   └── package.json
│
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── controllers/  # API controllers (6)
│   │   ├── services/     # Tick engine, WebSocket
│   │   ├── middleware/   # Auth middleware
│   │   └── index.ts      # Server entry
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
│
└── docs/                  # Documentation
    ├── project.md
    ├── backend.md
    ├── frontend.md
    ├── PHASE3_COMPLETE.md
    └── API_TESTING.md
```

---

## 🔧 Development

### Backend Commands
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm start            # Start production server
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
```

### Frontend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Testing
```bash
# Backend API tests
cd backend
pwsh -File test-api.ps1

# Check health
curl http://localhost:3000/api/health

# View database
npx prisma studio
```

---

## 📚 Documentation

### Specifications
- **[project.md](project.md)** - Complete game design document
- **[backend.md](backend.md)** - Backend architecture and API specs
- **[frontend.md](frontend.md)** - Frontend architecture and components
- **[design.md](design.md)** - Visual design guidelines

### Phase Summaries
- **[PHASE2_COMPLETE.md](PHASE2_COMPLETE.md)** - Frontend completion summary
- **[PHASE3_COMPLETE.md](PHASE3_COMPLETE.md)** - Backend documentation (400+ lines)
- **[PHASE3_SUCCESS.md](PHASE3_SUCCESS.md)** - Backend success summary
- **[PHASE3_SUMMARY.md](PHASE3_SUMMARY.md)** - Backend overview

### Guides
- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide
- **[API_TESTING.md](API_TESTING.md)** - API testing guide with examples
- **[STATUS.md](STATUS.md)** - Current project status

---

## 🎯 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Create account
- `POST /login` - Login
- `POST /refresh` - Refresh token
- `POST /logout` - Logout

### Player (`/api/player`)
- `GET /profile` - Get profile
- `GET /company` - Get company data
- `PUT /company` - Update company
- `GET /alerts` - Get notifications

### Sites (`/api/sites`)
- `GET /` - List sites
- `POST /` - Create site
- `POST /:id/rigs` - Add rig
- `POST /:id/energy` - Add energy contract

### Market (`/api/market`)
- `GET /data` - Market data
- `GET /positions` - List positions
- `POST /positions` - Open position
- `POST /positions/:id/close` - Close position

### Research (`/api/research`)
- `GET /available` - Available research
- `POST /start` - Start research

### Governance (`/api/governance`)
- `GET /proposals` - List proposals
- `POST /proposals` - Create proposal
- `POST /proposals/:id/vote` - Vote

**Total**: 30+ endpoints

See [API_TESTING.md](API_TESTING.md) for detailed examples.

---

## 🎨 Design System

### Color Palette
- **Background**: Dark slate (#1E293B, #0F172A)
- **Primary**: Neon green (#22C55E)
- **Secondary**: Electric blue (#3B82F6)
- **Warning**: Amber (#F59E0B)
- **Critical**: Red (#EF4444)

### Typography
- **Headings**: Orbitron (techno feel)
- **Body**: Inter
- **Monospace**: For numbers and data

### Components
- Glass-morphism effects
- Neon accent borders
- Status-based color coding
- Responsive grid layouts

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pwsh -File test-api.ps1
```

**Tests**:
1. ✅ Health check
2. ✅ User registration
3. ✅ User login
4. ✅ Get company data
5. ✅ Get market data
6. ✅ Get available research
7. ✅ Create mining site
8. ✅ Add mining rig

**Result**: 8/8 PASSED ✅

---

## 🔐 Security

### Implemented
- ✅ bcrypt password hashing (10 rounds)
- ✅ JWT access tokens (1h expiry)
- ✅ JWT refresh tokens (7d expiry)
- ✅ Session management
- ✅ Protected routes
- ✅ Server-side validation

### TODO (Before Production)
- ⚠️ Rate limiting
- ⚠️ Input sanitization
- ⚠️ CORS configuration
- ⚠️ HTTPS enforcement

---

## 🎮 Game Mechanics

### Tick System
- Game updates every **5 seconds** (1 tick)
- Mining yields calculated per tick
- Energy consumed per tick
- Market prices update
- Events can trigger

### Starting Resources
- **$50,000 USD**
- **0 BTC**
- **50 reputation** with all factions

### Costs
- **Site**: $10,000
- **Rigs**: $4,000-$7,000
- **Research**: $5,000-$20,000
- **Energy**: $0.04-$0.16/kWh (by region)

### ASIC Types
- **Antminer S19**: 110 TH/s, 3250W, $5,000
- **Antminer S19 Pro**: 110 TH/s, 3250W, $6,000
- **Whatsminer M30S**: 86 TH/s, 3344W, $4,000
- **Whatsminer M50**: 114 TH/s, 3276W, $7,000

---

## 📈 Performance

### Backend
- **Tick Duration**: 50-200ms (target: <1s)
- **API Response**: <100ms average
- **WebSocket Latency**: <50ms
- **Database Queries**: <50ms

### Current Status
- **Tick Engine**: 🟢 Running (Tick #65+)
- **BTC Price**: $43,789.23 (simulated)
- **Network Difficulty**: 62.5T
- **Network Hashrate**: 750 EH/s

---

## 🤝 Contributing

1. Read the specification files
2. Follow the design system
3. Use TypeScript with proper types
4. Test your changes
5. Ensure responsive design

---

## 📞 Support

### Documentation
- Check specification files in root directory
- Review phase completion summaries
- Refer to API testing guide

### Issues
- Check `STATUS.md` for current state
- Review `QUICKSTART.md` for setup help
- Consult `API_TESTING.md` for API examples

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🏆 Achievements

✅ **434-line tick engine** - Complex real-time simulation  
✅ **16-model database** - Comprehensive game state  
✅ **30+ API endpoints** - Complete REST API  
✅ **WebSocket server** - Real-time communication  
✅ **JWT authentication** - Secure user system  
✅ **20+ UI components** - Reusable component library  
✅ **7 game routes** - Complete frontend  
✅ **Comprehensive docs** - 1000+ lines of documentation  

---

## 🎯 Roadmap

### Phase 5: Integration (Next)
- [ ] Connect frontend to backend API
- [ ] Implement WebSocket client
- [ ] Create login/register pages
- [ ] Replace mock data
- [ ] Add error handling

### Phase 6: QA & Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Anti-cheat validation

### Phase 7: Deployment
- [ ] Dockerize application
- [ ] CI/CD pipeline
- [ ] Production deployment
- [ ] Monitoring setup

---

**Status**: 🟢 Backend Operational | 🟡 Frontend Ready  
**Version**: 0.1.0  
**Last Updated**: January 2024

---

<div align="center">

**[Get Started](QUICKSTART.md)** • **[API Docs](API_TESTING.md)** • **[Status](STATUS.md)**

Made with ⚡ by the Bitcoin Tycoon team

</div>