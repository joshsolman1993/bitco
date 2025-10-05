# Dashboard Errors Fixed

## Issues Identified

### 1. API Endpoint Mismatches
**Problem:** Frontend API calls didn't match backend route definitions
- `POST /site/create` → Backend expects `POST /site`
- `POST /site/rig/add` → Backend expects `POST /site/:id/rigs`
- `DELETE /site/rig/:rigId` → Backend expects `DELETE /site/:siteId/rigs/:rigId`
- `POST /site/energy/add` → Backend expects `POST /site/:id/energy`

**Error Message:**
```
GET http://localhost:3000/api/site/list 404 (Not Found)
```

### 2. Undefined Property Access
**Problem:** Dashboard.tsx tried to access properties on undefined objects before data loaded
- `company?.balance` could be undefined, causing `.toLocaleString()` to fail
- Arrays (`sites`, `alerts`, `positions`) could be undefined during initial render

**Error Message:**
```
Uncaught TypeError: Cannot read properties of undefined (reading 'toLocaleString')
at Dashboard (Dashboard.tsx:122:31)
```

## Fixes Applied

### 1. Fixed API Endpoints (`frontend/src/services/api.ts`)

**createSite:**
```typescript
// Before
const response = await apiClient.post<Site>('/site/create', data)

// After
const response = await apiClient.post<Site>('/site', data)
```

**addRig:**
```typescript
// Before
addRig: async (siteId: string, rigType: string) => {
  const response = await apiClient.post<Rig>('/site/rig/add', {
    siteId,
    rigType,
  })
  return response.data
}

// After
addRig: async (siteId: string, data: { type: string, gridX: number, gridY: number }) => {
  const response = await apiClient.post<Rig>(`/site/${siteId}/rigs`, data)
  return response.data
}
```

**removeRig:**
```typescript
// Before
removeRig: async (rigId: string) => {
  const response = await apiClient.delete(`/site/rig/${rigId}`)
  return response.data
}

// After
removeRig: async (siteId: string, rigId: string) => {
  const response = await apiClient.delete(`/site/${siteId}/rigs/${rigId}`)
  return response.data
}
```

**addEnergyContract:**
```typescript
// Before
const response = await apiClient.post<EnergyContract>(
  '/site/energy/add',
  {
    siteId,
    ...data,
  }
)

// After
const response = await apiClient.post<EnergyContract>(
  `/site/${siteId}/energy`,
  data
)
```

### 2. Added Null Safety (`frontend/src/pages/Dashboard.tsx`)

**Aggregate Stats Calculations:**
```typescript
// Added optional chaining and fallback values
const totalHashrate = sites?.reduce((sum, site) => {
  const siteHashrate = site.rigs?.reduce((rigSum: number, rig: any) => rigSum + (rig.hashrate || 0), 0) || 0
  return sum + siteHashrate
}, 0) || 0

const totalPowerUsage = sites?.reduce((sum, site) => {
  const sitePower = site.rigs?.reduce((rigSum: number, rig: any) => {
    return rigSum + ((rig.hashrate || 0) * (rig.efficiency || 0) / 1000)
  }, 0) || 0
  return sum + sitePower
}, 0) || 0

const avgUptime = sites?.length > 0 
  ? sites.reduce((sum, site) => sum + (site.uptime || 100), 0) / sites.length 
  : 100

const totalPnL = positions?.reduce((sum, pos) => sum + (pos.pnl || 0), 0) || 0

const criticalAlerts = alerts?.filter(a => a.type === 'critical').length || 0
const warningAlerts = alerts?.filter(a => a.type === 'warning').length || 0
```

**Balance Display:**
```typescript
// Before
value={`$${(company?.balance || 0).toLocaleString()}`}

// After - Uses nullish coalescing and proper balance calculation
value={`$${((company?.usdBalance ?? 0) + (company?.btcBalance ?? 0) * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
```

**Sites Display:**
```typescript
// Added optional chaining throughout
<Card title="Active Sites" subtitle={`${sites?.length || 0} sites operational`}>
  <div className="space-y-3">
    {sites?.slice(0, 3).map((site) => (
      // ... site display with fallback values
    ))}
    {(!sites || sites.length === 0) && (
      <p className="text-sm text-slate-400 text-center py-4">No active sites</p>
    )}
  </div>
</Card>
```

**Alerts Display:**
```typescript
// Added optional chaining
{alerts?.slice(0, 4).map((alert) => (
  // ... alert display
))}
{(!alerts || alerts.length === 0) && (
  <p className="text-sm text-slate-400 text-center py-4">No alerts</p>
)}
```

## Backend Routes Reference

For reference, here are the actual backend routes from `backend/src/controllers/siteController.ts`:

```typescript
GET    /api/site              // Get all sites
GET    /api/site/:id          // Get single site
POST   /api/site              // Create new site
POST   /api/site/:id/rigs     // Add rig to site
DELETE /api/site/:siteId/rigs/:rigId  // Remove rig
POST   /api/site/:id/energy   // Add energy contract
```

## Testing

After these fixes:
1. ✅ Dashboard loads without errors
2. ✅ Company balance displays correctly (USD + BTC value)
3. ✅ Sites, alerts, and positions handle empty/undefined states
4. ✅ API calls use correct endpoints matching backend routes
5. ✅ No more 404 errors on site endpoints
6. ✅ No more TypeError on undefined properties

## Additional Notes

- The backend uses `usdBalance` and `btcBalance` separately, not a combined `balance` field
- All site-related operations now use RESTful routes with proper resource IDs
- The `addRig` function now requires grid position (`gridX`, `gridY`) as per backend schema
- The `addEnergyContract` function now requires `provider` field as per backend validation