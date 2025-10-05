# Bitcoin Tycoon — Backend Specification (backend.md)

## 1) Overview
The **backend** of Bitcoin Tycoon powers the real-time simulation, persistent data storage, and secure player interactions. It is responsible for handling ticks, market simulations, mining yields, R&D progress, governance, and event triggers.

Goals:
- Deterministic tick engine for real-time simulation.
- Scalable architecture to support many concurrent players.
- Secure and server-authoritative game state.
- Clear APIs for frontend integration via REST + WebSockets.
- Observability and anti-cheat measures baked in.

## 2) Core Technologies
- **Language/Runtime**: Node.js with TypeScript
- **Framework**: NestJS or Express
- **Database**: PostgreSQL (via Prisma ORM)
- **Cache/Queue**: Redis (for ticks, job queues, and session caching)
- **Communication**: REST for CRUD, WebSockets for live simulation updates
- **Auth**: JWT with refresh tokens
- **Hosting**: Dockerized microservices, Kubernetes (future scaling)

## 3) Backend Architecture

### 3.1 Services
- **Auth Service**: login, register, refresh, guest mode.
- **Player Service**: profile, company, reputation.
- **Simulation Service**: tick engine, mining yields, markets, events.
- **Site Service**: rigs, layouts, energy contracts, maintenance.
- **Market Service**: spot trading, perps, options, risk checks.
- **R&D Service**: research trees, prototypes, patents.
- **Governance Service**: proposals, votes, reputation effects.
- **Event Service**: dynamic quests, seasonal content, alerts.

### 3.2 Tick Engine
- Global tick (e.g., every 5 seconds) processes mining, markets, events.
- Deterministic RNG with seeds for reproducibility.
- Distributed workers per region/world shard.
- Snapshots stored for rollback/debugging.

### 3.3 Data Storage
- PostgreSQL for relational data (users, rigs, markets, research).
- Redis for ephemeral tick data and fast caches.
- S3-compatible storage (optional) for assets and logs.

### 3.4 APIs
- **REST Endpoints**:
  - `POST /auth/login`
  - `POST /auth/register`
  - `GET /player/:id`
  - `POST /site/create`
  - `POST /site/rig/add`
  - `GET /market/list`
  - `POST /market/trade`
  - `POST /research/start`
  - `POST /governance/vote`
- **WebSocket Events**:
  - `tick:update` — new snapshot for mining/markets/events.
  - `player:update` — reputation, balances, quests.
  - `alert` — warnings like liquidations, outages, failures.

### 3.5 Security & Anti-Cheat
- Server-authoritative writes (clients only send intents).
- Input validation on all endpoints.
- Rate limiting and anomaly detection.
- Audit logs for suspicious actions.

## 4) Data Model (Simplified)
- **User**(id, email, passhash, createdAt)
- **Company**(id, ownerId, name, region, reputation)
- **Site**(id, companyId, region, gridTier, coolingType, uptime)
- **Rig**(id, siteId, type, hashrate, efficiency, wear, firmware, status)
- **EnergyContract**(id, siteId, pricePerKWh, capacity, start, end)
- **Position**(id, companyId, instrument, side, qty, entry, margin, status)
- **Research**(id, companyId, node, level, progress)
- **Proposal**(id, type, description, deadline, votes, outcome)
- **Event**(id, type, severity, payload, createdAt, resolvedAt)
- **TickSnapshot**(id, ts, btcPrice, difficulty, regionalPrices[])

## 5) Simulation Logic
- **Mining**: site uptime × rig hashrate × difficulty factor.
- **Markets**: stochastic BTC price model with shocks; orderbook sim for spot, perps, options.
- **Energy**: regional demand curves; outages simulated randomly with modifiers.
- **Events**: triggered by probability tables and world state (e.g., dust storm → higher cooling needs).

## 6) Scaling & Deployment
- **Microservices** for auth, simulation, markets, events, etc.
- **Redis queues** for distributing tick workloads.
- **Sharding**: multiple simulation workers per region.
- **Docker + Kubernetes** for deployment and scaling.
- **Horizontal scaling**: stateless services + shared database + message queues.

## 7) Observability
- **Metrics**: Prometheus for tick duration, DB latency, player counts.
- **Logs**: ELK stack for API calls, errors, anomalies.
- **Tracing**: OpenTelemetry for request/tick correlation.

## 8) Live-Ops Tools
- Admin dashboard to adjust simulation parameters live.
- Event injection tools for seasonal content.
- Leaderboard management and seasonal resets.
- Player support tools (rollback, ban, resource grants).

## 9) Risks & Mitigations
- **Performance bottlenecks** → shard simulation, cache hot paths.
- **Exploits** → server-only state changes, anomaly detection, audits.
- **Tick drift** → strict scheduling, monitoring tick execution times.
- **Scaling** → cloud-native deployment with horizontal workers.

---

**This `backend.md` defines the architecture, tick engine, services, APIs, and scaling plan.**  
Next up: `design.md` (visual/interaction design system + landing page spec).
