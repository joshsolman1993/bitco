# Bitcoin Tycoon - Quick Start Guide

## 🎮 What is Bitcoin Tycoon?

Bitcoin Tycoon is a real-time browser-based strategy/tycoon game where players build and manage a cryptocurrency mining empire. Players must balance mining operations, energy costs, market trading, research & development, and political influence to become the ultimate Bitcoin tycoon.

## 📁 Project Structure

```
bitcoin2/
├── frontend/          # React + TypeScript + Vite frontend
├── backend/           # Node.js + Express + Prisma backend
├── project.md         # Game specification
├── frontend.md        # Frontend specification
├── backend.md         # Backend specification
├── design.md          # Visual/UX design guidelines
├── prompt.md          # AI agent orchestration prompts
├── PHASE2_COMPLETE.md # Phase 2 completion summary
├── PHASE3_COMPLETE.md # Phase 3 backend documentation
├── PHASE3_SUCCESS.md  # Phase 3 success summary
└── API_TESTING.md     # API testing guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL (for backend, when implemented)
- Redis (for backend, when implemented)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173/`

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npx prisma generate
npx prisma db push
npm run dev
```

The backend will be available at `http://localhost:3000/`

## 📊 Current Status

### ✅ Phase 1: Initial Setup - COMPLETE
- React + TypeScript + Vite frontend scaffolded
- Node.js + Express + Prisma backend scaffolded
- ESLint + Prettier configured
- Tailwind CSS configured

### ✅ Phase 2: Frontend Development - COMPLETE
- All 7 main routes implemented
- State management with Zustand
- Reusable UI component library
- Landing page with marketing content
- Mock data for all features
- Design system fully applied

### ✅ Phase 3: Backend Development - COMPLETE
- ✅ Prisma schema with 16 game models
- ✅ Tick engine (5-second intervals)
- ✅ 30+ REST API endpoints
- ✅ WebSocket server for real-time updates
- ✅ JWT authentication system
- ✅ All game mechanics implemented

### 🔄 Phase 4: Design/UX - MOSTLY COMPLETE
- Design system implemented
- All main views styled
- Responsive layouts working
- TODO: Accessibility improvements

### 🔄 Phase 5: Integration - TODO
- Connect frontend to backend APIs
- Implement WebSocket client
- Replace mock data with real data
- Add authentication flow
- Error handling and loading states

### 🔄 Phase 6: QA & Testing - TODO
- Unit tests for components
- Backend API tests
- Integration tests
- Anti-cheat validation

### 🔄 Phase 7: Deployment - TODO
- Dockerize frontend and backend
- Set up docker-compose
- CI/CD pipeline
- Environment configuration

## 🎯 Key Features

### Mining Management
- Build and manage mining sites
- Install and upgrade ASIC rigs
- Optimize cooling and power efficiency
- Monitor uptime and hashrate

### Market Trading
- Trade Bitcoin spot, perpetuals, and options
- Hedge mining revenue
- Manage positions and margin
- Respond to market volatility

### Research & Development
- Unlock new technologies
- Improve mining efficiency
- Gain competitive advantages
- Upgrade existing research

### Governance
- Build reputation with factions
- Vote on proposals
- Influence game world direction
- Earn faction benefits

### Quest System
- Complete main storyline quests
- Daily and weekly challenges
- Special event quests
- Earn rewards and reputation

## 🎨 Design System

### Color Palette
- **Background**: Dark slate (#1E293B, #0F172A)
- **Primary**: Neon green (#22C55E)
- **Secondary**: Electric blue (#3B82F6)
- **Warning**: Amber (#F59E0B)
- **Critical**: Red (#EF4444)
- **Text**: Slate-100 to Slate-400

### Typography
- **Headings**: Orbitron or Rajdhani (techno feel)
- **Body**: Inter or system fonts
- **Monospace**: For numbers and data

### Components
- Glass-morphism effects with backdrop blur
- Neon accent borders on interactive elements
- Status-based color coding
- Responsive grid layouts

## 📱 Routes

### Public Routes
- `/` - Landing page with hero and features

### Protected Routes (Game)
- `/dashboard` - Company overview and metrics
- `/sites` - Mining site management
- `/market` - Trading interface
- `/research` - R&D tech tree
- `/governance` - Faction reputation and voting
- `/quests` - Quest log and challenges
- `/settings` - User preferences

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend (when implemented)
```bash
npm run dev          # Start development server
npm run build        # Build TypeScript
npm start            # Start production server
npx prisma studio    # Open Prisma Studio
npx prisma migrate   # Run migrations
```

## 📚 Documentation

- **project.md** - Complete game specification and mechanics
- **frontend.md** - Frontend architecture and component specs
- **backend.md** - Backend architecture and API specs
- **design.md** - Visual design guidelines and UI patterns
- **prompt.md** - AI agent orchestration prompts for each phase
- **PHASE3_COMPLETE.md** - Complete backend documentation (400+ lines)
- **PHASE3_SUCCESS.md** - Phase 3 success summary with test results
- **API_TESTING.md** - API testing guide with curl examples

## 🎮 Game Mechanics Overview

### Tick System
- Game updates every 5 seconds (1 tick)
- Mining yields calculated per tick
- Energy consumed per tick
- Market prices update
- Events can trigger

### Resource Management
- **USD Balance**: For purchasing equipment and energy
- **BTC Holdings**: Mined Bitcoin (can be sold or held)
- **Hashrate**: Total mining power across all sites
- **Power Usage**: Energy consumption (affects costs)

### Progression
1. Start with small mining operation
2. Earn BTC and sell for USD
3. Expand sites and upgrade rigs
4. Research new technologies
5. Trade to hedge and maximize profit
6. Build reputation and influence
7. Dominate the market

## 🐛 Known Issues / TODO

- [x] Authentication implemented (JWT tokens)
- [x] Backend API fully functional
- [x] Tick engine running
- [ ] WebSocket client not connected (server ready, client TODO)
- [ ] Frontend still using mock data (needs integration)
- [ ] No error handling or loading states in frontend
- [ ] No form validation in frontend
- [ ] Accessibility improvements needed
- [ ] Mobile optimization needed
- [ ] No tests written yet

## 🤝 Contributing

When working on this project:

1. Read the relevant `.md` specification files
2. Follow the design system in `design.md`
3. Use TypeScript with proper types
4. Follow the component structure established in Phase 2
5. Test your changes in the browser
6. Ensure responsive design works

## 📞 Support

For questions or issues:
- Check the specification files in the root directory
- Review `PHASE2_COMPLETE.md` for implementation details
- Refer to `prompt.md` for AI agent guidance

---

**Current Phase**: Phase 3 Complete ✅ | **Next Phase**: Phase 5 (Frontend-Backend Integration)

## 🎉 Quick Test

Test the backend is working:

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Run tests
cd backend
pwsh -File test-api.ps1

# Or check health
curl http://localhost:3000/api/health
```

Happy coding! 🚀