# Bitcoin Tycoon — Project Specification (project.md)

## 1) Game Overview
**Bitcoin Tycoon** is a browser-based real-time RPG/tycoon game where players simulate building and managing a crypto empire. The game is designed with systemic complexity: real-time ticks update mining yields, market dynamics, hardware wear, and global events. Players must balance mining infrastructure, trading strategies, research, governance, and reputation to progress.

The game runs continuously, meaning actions, markets, and environments evolve even while the player is offline. Player decisions, timing, and strategy determine success in a world influenced by dynamic simulations.

## 2) Core Gameplay Loops

### 2.1 Mining & Infrastructure
- Acquire and expand mining sites (warehouses, datacenters).
- Install ASICs/GPUs with stats like hashrate, efficiency, wear, and firmware.
- Manage cooling, energy contracts, maintenance, and uptime.
- Join mining pools for steady yields or solo-mine for higher risk/reward.
- Replace and upgrade rigs; deal with supply chain bottlenecks.

### 2.2 Trading & Market Play
- Spot trade simulated BTC and derivatives (perpetual futures, options).
- Hedge risk from mining revenue using market instruments.
- Manage margin requirements, liquidation risk, and volatility.
- Reinvest PnL into rigs, sites, R&D, or lobbying.

### 2.3 Research & Development
- Unlock improvements to mining efficiency, firmware tuning, and cooling systems.
- Research breakthroughs in automation, energy recovery, and compliance tooling.
- Gain patents (permanent passive bonuses) and prototypes (temporary boosts).

### 2.4 Governance & Reputation
- Build reputation with pools, suppliers, regulators, and communities.
- Participate in governance decisions that affect the world (e.g., sustainability rules).
- Reputation unlocks discounts, contracts, and special quests.

### 2.5 Events & Challenges
- Dynamic events: energy price spikes, hardware shortages, hacks, policy shifts.
- Quests: secure contracts, pass audits, develop stable firmware, execute trades.
- Seasonal content: cycles with special modifiers and leaderboards.

## 3) Player Progression
- **Garage Era** → **Warehouse Era** → **Industrial Era** → **Ecosystem Steward**.
- Early game: focus on single rigs, learning basic mining and trading.
- Mid game: manage multiple sites, optimize cooling and logistics, unlock R&D.
- Late game: govern ecosystems, control mega-facilities, compete in leaderboards.
- Prestige/reset systems: carry meta-bonuses into new cycles.

## 4) Resources & Economy
- **Credits**: primary soft currency (general expenses).
- **Energy**: priced per kWh, region-dependent.
- **Parts**: consumables for maintenance/repairs.
- **BTC (fictitious)**: earned through mining/trading, core measure of wealth.
- **Reputation**: non-transferable stat tied to factions.
- **Research Points**: currency for R&D tree.

### Sinks
- Energy bills, staff payroll, maintenance, fines, failed R&D, equipment depreciation.

### Sources
- Mining rewards, trading profits, quest rewards, contracts, seasonal competitions.

## 5) World Simulation
- **Ticks**: Every 5 seconds, simulation updates mining outputs, market prices, difficulty, energy costs, and events.
- **Regions**: Distinct energy profiles, regulations, climates (cooling efficiency), and hazards.
- **Events**: Halvings, difficulty adjustments, blackouts, fee spikes, supply shocks.

## 6) NPCs & Workforce
- Staff roles: Technician, Electrician, Analyst, Trader, Compliance Officer.
- Each NPC has skills, fatigue, certifications; influences event outcomes.
- Workforce scheduling and training becomes critical in mid/late game.

## 7) Endgame & Replayability
- Leaderboards: efficiency, ROI, uptime, reputation.
- Prestige resets with permanent bonuses.
- Seasonal resets with new world modifiers and cosmetic rewards.

## 8) Player Experience
- Dashboards for sites, markets, research, governance.
- Alerts for cooling failures, liquidations, energy outages.
- Contextual tooltips with formulas and “explain why” panels.
- Narrative onboarding tutorial introducing rigs, pools, and hedging.

## 9) Key Risks & Mitigation
- **Complexity overload**: Progressive tutorial, auto-pilot options, preset strategies.
- **Economy exploits**: Server-authoritative state, anomaly detection.
- **Churn**: Engaging onboarding, goal prompts, milestone rewards.

## 10) Landing Page (Summary)
- Hero tagline: “Build the world’s most efficient Bitcoin empire.”
- Feature highlights: Mining, Trading, R&D, Governance.
- Live simulation banner (BTC price, difficulty, player hashrate).
- Call-to-action: Play Free (guest), Sign Up, Join Discord.

---

**This document (`project.md`) is the high-level game design bible.**
Detailed technical breakdowns are contained in:
- `frontend.md`
- `backend.md`
- `design.md`
- `prompt.md`
