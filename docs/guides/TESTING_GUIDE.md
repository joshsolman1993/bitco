# Testing Guide - Bug Fixes Verification

## 🎯 Quick Test Checklist

### Prerequisites
- ✅ Backend running on `http://localhost:3000`
- ✅ Frontend running on `http://localhost:5173`

### Test 1: Registration & Login Flow

1. **Open Browser**:
   - Navigate to: `http://localhost:5173`
   - Click "Get Started" or navigate to `/register`

2. **Register New Account**:
   ```
   Email: yourtest@example.com
   Password: password123
   Company Name: My Mining Empire
   Region: NORTH_AMERICA
   ```
   - Click "Create Account"
   - Should redirect to Dashboard automatically

3. **Expected Results**:
   - ✅ No console errors
   - ✅ Redirected to `/dashboard`
   - ✅ Header shows company info (top-right)
   - ✅ WebSocket connects (check console)

### Test 2: Header Display Verification

**Location**: Top-right corner of any page

**Should Display**:
```
Balance: $50,000
BTC: ₿ 0.00000000
Reputation: 50
```

**Check For**:
- ✅ No `toLocaleString` errors in console
- ✅ All values display correctly
- ✅ Numbers are formatted properly
- ✅ No "undefined" or "NaN" values

### Test 3: WebSocket Connection

**Open Browser Console** (F12 → Console tab)

**Expected Output**:
```javascript
[WS] Connecting to ws://localhost:3000/ws
[WS] Connected
[WS] Message received: connected
[WS] Connection acknowledged by server
[WS] Message received: auth_success
[WS] Authentication successful
```

**Check For**:
- ✅ No "Unknown message type" warnings
- ✅ Green "Live" indicator in header (top-left)
- ✅ No "auth_error" messages
- ✅ Connection stays stable

### Test 4: Page Navigation

**Navigate Through All Pages**:
1. Dashboard (`/dashboard`)
2. Sites (`/sites`)
3. Market (`/market`)
4. Research (`/research`)
5. Governance (`/governance`)

**For Each Page Check**:
- ✅ Page loads without errors
- ✅ Header remains stable
- ✅ WebSocket stays connected
- ✅ No console errors
- ✅ Loading spinners appear briefly
- ✅ Data displays correctly

### Test 5: WebSocket Reconnection

**Test Automatic Reconnection**:
1. Open DevTools Console
2. Note the "Live" indicator (green)
3. Restart the backend server
4. Watch console for reconnection messages
5. "Live" indicator should turn red, then green again

**Expected Behavior**:
- ✅ Disconnection detected
- ✅ Automatic reconnection attempts
- ✅ Successful reconnection
- ✅ No manual refresh needed

## 🐛 What Was Fixed

### Before (Errors):
```
❌ Header.tsx:58 Uncaught TypeError: Cannot read properties of undefined (reading 'toLocaleString')
❌ websocket.ts:173 [WS] Unknown message type: connected
❌ websocket.ts:173 [WS] Unknown message type: auth_error
❌ WebSocket authentication failing silently
```

### After (Fixed):
```
✅ Header displays all values safely with null checks
✅ WebSocket handles 'connected' message type
✅ WebSocket handles 'auth_error' message type
✅ WebSocket uses correct message structure (data field)
✅ All alerts use correct signature
```

## 📊 Success Criteria

All of these should be TRUE:

- [ ] Can register new account without errors
- [ ] Can login without errors
- [ ] Header displays balance, BTC, reputation
- [ ] No `toLocaleString` errors in console
- [ ] WebSocket connects successfully
- [ ] No "Unknown message type" warnings
- [ ] All pages load without errors
- [ ] Navigation works smoothly
- [ ] WebSocket stays connected across pages
- [ ] "Live" indicator shows green

## 🎉 If All Tests Pass

**You're ready for Phase 6!**

The frontend-backend integration is now stable and all critical bugs are fixed. The application is ready for:

1. **Real-Time Simulation** - Tick-based updates
2. **Live Mining** - Real BTC generation
3. **Market Trading** - Execute trades
4. **Research System** - Start research projects
5. **Governance** - Vote on proposals

## 🆘 Troubleshooting

### Issue: WebSocket won't connect
**Solution**: 
- Check backend is running: `http://localhost:3000/health`
- Check WebSocket endpoint: `ws://localhost:3000/ws`
- Clear browser cache and refresh

### Issue: Header shows "undefined"
**Solution**:
- Logout and login again
- Check localStorage has `accessToken`
- Verify API returns company data

### Issue: "Unknown message type" still appears
**Solution**:
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Restart frontend dev server

### Issue: Rate limiting error
**Solution**:
- Wait 60 seconds
- Use different email address
- Restart backend to reset rate limits

## 📝 Test Credentials

For quick testing, use these credentials:

```
Email: test1759569599@example.com
Password: password123
Company: WebSocket Test Co
Balance: $50,000
```

(Or register a new account with any email)