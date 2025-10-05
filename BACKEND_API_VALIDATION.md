# Backend API Validáció - Bitcoin Tycoon

**Dátum:** 2024  
**Státusz:** 🔍 VALIDÁCIÓ FOLYAMATBAN

---

## 📋 Validációs Terv

### 1. Adatmodell Konzisztencia Ellenőrzés

#### ✅ Company Model

**Backend (Prisma Schema):**
```prisma
model Company {
  id          String
  name        String
  region      String
  usdBalance  Float
  btcBalance  Float
  repMiners     Int    @default(50)
  repTraders    Int    @default(50)
  repRegulators Int    @default(50)
  repAnarchists Int    @default(50)
  sites       Site[]
  positions   Position[]
  research    Research[]
  quests      CompanyQuest[]
  alerts      Alert[]
}
```

**Frontend (useGameStore.ts):**
```typescript
interface Company {
  id: string
  name: string
  region: string
  balance: number        // ⚠️ ELTÉRÉS: usdBalance vs balance
  btcBalance: number
  reputation: {
    miners: number       // ✅ MEGFELELŐ: repMiners
    traders: number      // ✅ MEGFELELŐ: repTraders
    regulators: number   // ✅ MEGFELELŐ: repRegulators
    anarchists: number   // ✅ MEGFELELŐ: repAnarchists
  }
}
```

**❌ PROBLÉMA #1:** Mező név eltérés
- Backend: `usdBalance`
- Frontend: `balance`

---

#### ✅ Site Model

**Backend (Prisma Schema):**
```prisma
model Site {
  id            String
  name          String
  region        String
  gridTier      Int      @default(1)
  coolingType   String   @default("AIR")
  uptime        Float    @default(100)
  totalHashrate Float    @default(0)
  powerUsage    Float    @default(0)
  rigs          Rig[]
  energyContracts EnergyContract[]
}
```

**Frontend (useGameStore.ts):**
```typescript
interface Site {
  id: string
  name: string
  region: string
  gridTier: string       // ⚠️ TÍPUS ELTÉRÉS: Int vs string
  coolingType: string
  uptime: number
  rigs: Rig[]
  energyContracts: EnergyContract[]
}
```

**❌ PROBLÉMA #2:** Típus eltérés
- Backend: `gridTier: Int` (1-5)
- Frontend: `gridTier: string`

**⚠️ HIÁNYZÓ MEZŐK:**
- Frontend nem tartalmazza: `totalHashrate`, `powerUsage`

---

#### ✅ Rig Model

**Backend (Prisma Schema):**
```prisma
model Rig {
  id            String
  type          String
  gridX         Int
  gridY         Int
  hashrate      Float
  efficiency    Float
  wear          Float    @default(0)
  firmware      String   @default("STOCK")
  status        String   @default("ACTIVE")
  purchasePrice Float
  purchasedAt   DateTime @default(now())
}
```

**Frontend (useGameStore.ts):**
```typescript
interface Rig {
  id: string
  type: string
  hashrate: number
  efficiency: number
  wear: number
  status: string
  purchasePrice: number
}
```

**⚠️ HIÁNYZÓ MEZŐK:**
- Frontend nem tartalmazza: `gridX`, `gridY`, `firmware`, `purchasedAt`

---

### 2. WebSocket Üzenetek Validáció

#### ✅ Tick Update

**Backend (tickEngine.ts):**
```typescript
interface TickData {
  tickNumber: number
  btcPrice: number
  difficulty: number
  networkHashrate: number
  regionalData: Record<string, RegionalData>
  timestamp: Date
}

// WebSocket üzenet:
{
  type: 'tick:update',
  data: tickData
}
```

**Frontend (websocket.ts):**
```typescript
interface TickUpdatePayload {
  tickNumber: number
  btcPrice: number
  difficulty: number
  networkHashrate: number
  regionalPrices: Record<string, number>  // ⚠️ ELTÉRÉS
  timestamp: string
}
```

**❌ PROBLÉMA #3:** Mező név és struktúra eltérés
- Backend: `regionalData: Record<string, RegionalData>` (objektum: `{ energyPrice, temperature, reliability }`)
- Frontend: `regionalPrices: Record<string, number>` (csak szám)

---

### 3. REST API Endpoint Validáció

#### ✅ GET /player/company

**Backend (playerController.ts):**
```typescript
const company = await prisma.company.findUnique({
  where: { id: req.companyId },
  include: {
    sites: {
      include: {
        rigs: true,
        energyContracts: true
      }
    },
    positions: { where: { status: 'OPEN' } },
    research: true,
    quests: {
      include: { quest: true },
      where: { status: 'ACTIVE' }
    },
    alerts: {
      where: { read: false },
      orderBy: { createdAt: 'desc' },
      take: 10
    }
  }
})
```

**Visszaadott adatok:**
- ✅ `company.sites[]` - tartalmazza a `rigs[]` tömböt
- ✅ `company.positions[]` - csak OPEN pozíciók
- ✅ `company.research[]`
- ✅ `company.quests[]` - tartalmazza a `quest` objektumot
- ✅ `company.alerts[]` - csak olvasatlan alertek

**Frontend várt formátum:**
- ✅ Kompatibilis, de mezőnevek eltérnek (lásd Probléma #1, #2)

---

## 🔍 Azonosított Problémák Összefoglalása

### ❌ Kritikus Problémák

1. **Company.balance vs usdBalance**
   - **Hely:** Frontend `useGameStore.ts`, `api.ts`
   - **Hatás:** Dashboard, Header komponensek hibásan jeleníthetik meg az USD egyenleget
   - **Javítás:** Frontend típusokat átnevezni `balance` → `usdBalance`

2. **Site.gridTier típus eltérés**
   - **Hely:** Frontend `useGameStore.ts`, `api.ts`
   - **Hatás:** Sites oldal hibásan kezelheti a gridTier értékeket
   - **Javítás:** Frontend típust módosítani `string` → `number`

3. **TickData.regionalData vs regionalPrices**
   - **Hely:** Frontend `websocket.ts`
   - **Hatás:** WebSocket tick update-ek nem tartalmazzák a teljes regionális adatokat
   - **Javítás:** Frontend típust bővíteni `RegionalData` objektummal

### ⚠️ Nem Kritikus Hiányosságok

4. **Hiányzó mezők a Site interface-ben**
   - `totalHashrate`, `powerUsage`
   - **Hatás:** Dashboard nem tudja megjeleníteni a teljes hashrate-et és energiafogyasztást
   - **Javítás:** Frontend típust bővíteni

5. **Hiányzó mezők a Rig interface-ben**
   - `gridX`, `gridY`, `firmware`, `purchasedAt`
   - **Hatás:** Sites oldal nem tudja megjeleníteni a rig pozíciókat és részletes adatokat
   - **Javítás:** Frontend típust bővíteni

---

## 🧪 Tesztelési Terv

### Fázis 1: Backend Elindítása
- [ ] Backend server indítása
- [ ] Database kapcsolat ellenőrzése
- [ ] Health check endpoint tesztelése

### Fázis 2: REST API Tesztelés
- [ ] POST /auth/register - Új felhasználó létrehozása
- [ ] POST /auth/login - Bejelentkezés
- [ ] GET /player/company - Company adatok lekérése
- [ ] GET /player/profile - Profil adatok lekérése

### Fázis 3: WebSocket Tesztelés
- [ ] WebSocket kapcsolat létrehozása
- [ ] Auth üzenet küldése
- [ ] Tick update fogadása
- [ ] Adatstruktúra validálása

### Fázis 4: Adatkonzisztencia Ellenőrzés
- [ ] Company mezők összehasonlítása
- [ ] Site mezők összehasonlítása
- [ ] Rig mezők összehasonlítása
- [ ] TickData mezők összehasonlítása

---

## 📝 Következő Lépések

1. **Backend Indítása** - Ellenőrizzük, hogy a backend fut-e
2. **API Tesztelés** - PowerShell script futtatása
3. **Típusjavítások** - Frontend típusok módosítása a backend-hez igazítva
4. **Integráció Tesztelés** - Teljes flow tesztelése böngészőben

---

## 🎯 Várt Eredmény

✅ **Sikeres validáció után:**
- Frontend típusok 100%-ban megfelelnek a backend adatmodellnek
- WebSocket üzenetek helyesen dekódolódnak
- REST API válaszok hibamentesen feldolgozódnak
- Nincs runtime hiba az adatkezelésben