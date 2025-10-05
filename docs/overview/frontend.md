# Bitcoin Tycoon — Frontend Specification (frontend.md)

## 1) Overview
The **frontend** of Bitcoin Tycoon is a browser-based client built with **React + TypeScript** using **Vite** for development and bundling. Styling is handled by **Tailwind CSS**, while state management is coordinated via **Zustand** (or Redux if scaling requires). The UI emphasizes real-time dashboards, clear data visualization, and intuitive controls for complex simulations.

Goals:
- Present complex simulation data in an understandable and visually engaging way.
- Provide responsive, modular, and scalable UI components.
- Ensure smooth live updates via WebSocket integration with backend tick engine.
- Optimize for accessibility, performance, and mobile compatibility.

## 2) Core Frontend Architecture
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + custom components
- **State Management**: Zustand or Redux
- **Communication**: REST for CRUD actions, WebSockets for live updates
- **Routing**: React Router (single-page app)
- **Visualization**: Recharts/D3.js for graphs, Heatmaps for monitoring

## 3) Major Views & Components

### 3.1 Authentication & Onboarding
- **Login / Register / Guest Mode**
- **Tutorial Overlay**: step-by-step interactive onboarding for mining, trading, and R&D basics.

### 3.2 Dashboard (Global Overview)
- Displays company finances, uptime %, mining output, active trades, research progress, and alerts.
- Graphs: BTC price, hashrate trends, PnL timeline.
- Notifications: energy warnings, liquidation alerts, hardware failures.

### 3.3 Sites View
- Interactive grid layouts showing racks, rigs, cooling systems, energy contracts.
- Per-rig stats: hashrate, efficiency, wear %, temp, uptime.
- Maintenance queue UI: drag-and-drop parts, assign staff.

### 3.4 Market View
- Live orderbook with simplified depth visualization.
- Positions list with PnL, margin health, and liquidation warnings.
- Trade panel: buy/sell spot, open/close perps/options (simplified inputs).
- Risk indicators: margin buffer, VaR meter.

### 3.5 Research & Development (R&D)
- Tech tree visualization with branches (Mining, Trading, Automation, Compliance).
- Progress bars with tooltips for benefits and failure chances.
- Prototype lab UI: run risky experiments, display chance of success.

### 3.6 Governance & Reputation
- Faction reputation meters.
- Governance proposals: display votes, effects, deadlines.
- Reputation benefits: unlocked discounts, special quests.

### 3.7 Events & Quests
- Event popups: power outages, regulation shifts, firmware bugs.
- Quest log with active objectives and rewards.
- Seasonal UI: special leaderboards, event banners.

### 3.8 Settings & Profile
- Company branding (logo, name, theme colors).
- User settings: accessibility, notifications, dashboard layout presets.

## 4) UI/UX Guidelines
- **Progressive Disclosure**: reveal advanced systems gradually to reduce complexity overload.
- **Visual Hierarchy**: use tiles, meters, and heatmaps to emphasize priority data.
- **Tooltips & Explainers**: every stat can be clicked for formula breakdowns.
- **Responsive Design**: layouts adapt to desktop, tablet, mobile.
- **Accessibility**: ARIA roles, keyboard shortcuts, colorblind-friendly themes.

## 5) Frontend State Management
- **Global Store**: auth state, user/company info, WebSocket connection status.
- **Simulation Store**: mining data, markets, R&D progress, events.
- **UI Store**: active views, modal states, notification queues.

Syncing strategy:
- WebSockets push updates from backend tick engine every few seconds.
- Client applies optimistic updates for user actions, reconciled by server snapshots.
- State hydration on login/resume.

## 6) Data Visualization Examples
- **Mining Efficiency Heatmap**: rack layout colored by rig temperature/efficiency.
- **PnL Timeline**: line chart of cumulative profits.
- **Market Depth Chart**: simplified orderbook visualization.
- **Risk Meters**: gauge for margin health, uptime %, reputation.

## 7) Routing Structure
- `/` — Landing Page
- `/dashboard` — Global company overview
- `/sites` — Infrastructure management
- `/market` — Trading & hedging interface
- `/research` — R&D tree & lab
- `/governance` — Reputation & voting
- `/quests` — Events & quest log
- `/settings` — Profile, preferences

## 8) Frontend Tech Stack Summary
- **React + TypeScript** — Component-based architecture.
- **Vite** — Fast builds & hot reload.
- **Tailwind CSS** — Utility-first styling.
- **Zustand/Redux** — State management for simulation & UI.
- **Recharts/D3.js** — Graphs, charts, heatmaps.
- **WebSockets** — Real-time updates from backend tick engine.

## 9) Performance & Optimization
- Virtualized lists for large data (e.g., orderbooks, rig inventories).
- Memoized selectors to prevent unnecessary re-renders.
- Lazy loading routes & components for faster initial load.
- Snapshot caching for quick resume after disconnections.

---

**This `frontend.md` defines the architecture and UI design principles.**  
Next up: `backend.md` for services, APIs, and tick engine design.
