# Bitcoin Tycoon — Design Specification (design.md)

## 1) Design Goals
The **design** of Bitcoin Tycoon must reflect the tension between high-tech infrastructure and the speculative, volatile world of cryptocurrency. It should feel sleek, data-driven, and modern, but not alienating. Players must be able to interpret large amounts of data at a glance while still feeling immersed in a narrative of building an empire.

Principles:
- **Clarity**: Complex systems should be communicated with intuitive visuals (charts, gauges, heatmaps).
- **Immersion**: Consistent theme of mining rigs, data centers, crypto charts, and futuristic control rooms.
- **Scalability**: UI design that adapts from early-game “garage” to late-game “industrial empire.”
- **Consistency**: Unified component library, typography, and color palette.
- **Responsiveness**: Optimized layouts for desktop, tablet, and mobile.

## 2) Visual Identity
- **Theme**: Techno-industrial meets financial dashboards.
- **Color Palette**:
  - Primary: Dark slate (#1E293B), Neon green (#22C55E), Electric blue (#3B82F6)
  - Secondary: Amber (#F59E0B) for warnings, Red (#EF4444) for risk/critical states
  - Backgrounds: Dark gradients, subtle grid textures
- **Typography**: Sans-serif fonts (Inter, Roboto, or similar) with bold weights for headings.
- **Icons**: SVG-based, minimal but evocative (servers, coins, charts, cooling fans).

## 3) Layout & Navigation
- **Navigation**: Sidebar nav with SVG icons for Dashboard, Sites, Market, R&D, Governance, Quests, Settings.
- **Header Bar**: Displays BTC price, network difficulty, player hashrate, and alerts.
- **Content Panels**: Modular cards with expandable sections (metrics, controls, graphs).
- **Responsive**: Collapsible nav on mobile, stacked panels.

## 4) Major Screens

### 4.1 Landing Page
- **Hero Section**: Tagline “Build the World’s Most Efficient Bitcoin Empire.”
- Background animation: scrolling code, fluctuating BTC price ticker.
- CTA buttons: “Play Free,” “Sign Up,” “Roadmap.”
- Feature panels: Mining, Trading, R&D, Governance, each with micro-illustrations.
- Live World Banner: current simulated BTC price, difficulty, player hashrate.

### 4.2 Dashboard
- **Company Overview Card**: Cashflow, uptime, efficiency.
- **Market Snapshot**: BTC price, open positions, margin health.
- **Site Overview**: hashrate, power usage, cooling status.
- **Alerts Feed**: energy spikes, rig failures, liquidations.

### 4.3 Sites View
- Interactive grid for site layout (racks, rigs, cooling).
- Heatmap overlay for rig temperatures/efficiency.
- Drag-and-drop interface for installing and maintaining rigs.
- Maintenance queue visuals (workers assigned, parts needed).

### 4.4 Market View
- Orderbook visualization with simplified depth.
- Position list with PnL and liquidation thresholds.
- Trade panel with buy/sell inputs.
- Risk gauges (margin health, VaR meter).

### 4.5 Research & Development
- Tech tree with branching nodes and icons for Mining, Trading, Automation, Compliance.
- Progress bars with glowing indicators.
- Prototype panel: “Experiment” button with % success chance and animated outcome.

### 4.6 Governance & Reputation
- Faction reputation bars with gradient fills.
- Proposal cards with timers and vote tallies.
- Reputation-based unlock visuals (discounts, special quests).

### 4.7 Events & Quests
- Event popups with icons and urgent color schemes.
- Quest log: checklist UI with rewards preview.
- Seasonal banners with thematic backgrounds.

## 5) UI Components
- **Tiles & Cards**: Consistent 2xl rounded corners, shadows, padding.
- **Gauges & Meters**: Circular progress, battery-style uptime, risk gauges.
- **Tables & Lists**: Virtualized for performance; sortable and filterable.
- **Tooltips & Drawers**: Formula breakdowns, “why” explanations.
- **Notifications**: Toasts for minor alerts, modals for critical events.

## 6) Interactivity & Feedback
- Animations: smooth transitions, hover effects, glowing borders for active states.
- Sound design (optional): subtle beeps for alerts, clicks for confirmations.
- Feedback loops: success/failure animations on trades, research, quests.

## 7) Accessibility
- High contrast mode, scalable fonts, colorblind-friendly palettes.
- Keyboard navigation and shortcuts for core actions.
- ARIA roles for screen readers.

## 8) Assets
- **Logo**: Clean wordmark + abstract mining/crypto symbol.
- **Illustrations**: Minimalistic vector art for landing features.
- **Icons**: Custom SVG pack (rigs, energy, coins, governance, research).

## 9) Landing Page Wireframe (textual)
- Header: Logo + navigation + login/register.
- Hero: Tagline, CTA buttons, animated background.
- Feature Strips: 4 panels (Mining, Trading, R&D, Governance).
- Live Banner: dynamic ticker (BTC price, difficulty, player hashrate).
- Footer: roadmap link, disclaimers, community links.

---

**This `design.md` defines the visual/interaction design system and landing page specification.**  
Next up: `prompt.md` for AI-agent orchestration prompts.
