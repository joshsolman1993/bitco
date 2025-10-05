# Bitcoin Tycoon — AI Agent Prompts (prompt.md)

This document contains orchestrated prompts for AI agents (e.g., Cursor, Codex CLI, etc.) to understand the project structure and begin development. Each prompt is designed for a specific context and development phase.

---

## 1) Initial Project Setup Prompt
**Goal**: Bootstrap the project repository with baseline structure.

```
You are an AI coding assistant. The root folder contains:
- project.md (game specification)
- frontend.md (frontend specification)
- backend.md (backend specification)
- design.md (visual/UX design)
- prompt.md (AI orchestration prompts)

Read all `.md` documents to understand the project scope.

Task:
1. Scaffold the project repository with `frontend/` and `backend/` directories.
2. Initialize a React + TypeScript + Vite app in `frontend/`.
3. Initialize a Node.js (TypeScript, Express/NestJS) backend in `backend/`.
4. Add Prisma with PostgreSQL config in backend.
5. Ensure ESLint + Prettier are set up for both frontend and backend.
```

---

## 2) Frontend Development Prompt
**Goal**: Implement the UI based on `frontend.md` and `design.md`.

```
You are developing the frontend for Bitcoin Tycoon.

Context:
- Use React + TypeScript + Vite + Tailwind CSS.
- State management: Zustand (or Redux if needed).
- WebSocket connection for real-time updates.
- Charts: Recharts/D3.js.

Task:
1. Implement routing structure: /dashboard, /sites, /market, /research, /governance, /quests, /settings.
2. Build UI components described in frontend.md: dashboards, heatmaps, risk meters, quest log, governance panels.
3. Integrate placeholder WebSocket client for tick updates.
4. Use mock data first; ensure component modularity.
5. Follow design guidelines in design.md (color palette, layout, SVG nav, gauges).
```

---

## 3) Backend Development Prompt
**Goal**: Implement backend services and tick engine per `backend.md`.

```
You are developing the backend for Bitcoin Tycoon.

Context:
- Node.js + TypeScript, Express/NestJS.
- PostgreSQL + Prisma ORM.
- Redis for tick queue and cache.
- REST for CRUD, WebSockets for simulation updates.

Task:
1. Set up Prisma schema with core models: User, Company, Site, Rig, EnergyContract, Position, Research, Proposal, Event, TickSnapshot.
2. Implement tick engine (every 5s): update mining yields, markets, energy, events.
3. Create controllers for Auth, Player, Site, Market, Research, Governance.
4. Expose REST endpoints and WebSocket events (tick:update, player:update, alert).
5. Add server-authoritative validation for all writes.
```

---

## 4) Design/UX Prompt
**Goal**: Implement design system from `design.md`.

```
You are the design-focused AI agent.

Context:
- React + Tailwind CSS frontend.
- Visual theme: techno-industrial dashboard.

Task:
1. Implement sidebar navigation with SVG icons (Dashboard, Sites, Market, R&D, Governance, Quests, Settings).
2. Apply color palette and typography rules from design.md.
3. Create reusable UI components: cards, meters, gauges, heatmaps.
4. Implement Landing Page (hero, feature strips, live world banner).
5. Ensure responsive design for desktop, tablet, and mobile.
```

---

## 5) Integration Prompt
**Goal**: Connect frontend and backend, ensure synchronization.

```
You are integrating frontend and backend.

Task:
1. Connect frontend WebSocket client to backend tick engine.
2. Fetch data via REST endpoints for player/company/site/market/research.
3. Render real-time updates in dashboard, sites view, and market view.
4. Ensure optimistic UI updates with reconciliation from server snapshots.
5. Test flows: login, site creation, rig installation, market trade, research start, governance vote.
```

---

## 6) QA & Testing Prompt
**Goal**: Ensure quality and stability.

```
You are the QA/testing AI agent.

Task:
1. Write Jest + React Testing Library tests for frontend components.
2. Write backend unit tests for controllers, tick engine, and Prisma models.
3. Simulate multiple ticks and validate deterministic outcomes.
4. Test anti-cheat measures: invalid trades, impossible uptime, abnormal ROI.
5. Test responsive design and accessibility features.
```

---

## 7) Deployment Prompt
**Goal**: Prepare deployment.

```
You are setting up deployment.

Task:
1. Dockerize both frontend and backend.
2. Configure docker-compose with services: frontend, backend, postgres, redis.
3. Add scripts for migrations (Prisma), seeding initial data.
4. Prepare CI/CD pipeline (GitHub Actions) for linting, tests, builds.
5. Enable environment configs: DB_URL, REDIS_URL, JWT_SECRET.
```

---

**This `prompt.md` defines structured AI prompts for project phases: setup, frontend, backend, design, integration, testing, deployment.**
