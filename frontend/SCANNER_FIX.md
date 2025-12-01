# 🔧 Scanner Fix Guide

## Problem

Manual scanner showing "Tiket tidak ditemukan atau sudah selesai!" even with valid ticket ID.

## Solutions Applied

### 1. ✅ Better Error Messages

Now shows specific error messages:

- If ticket doesn't exist: Shows helpful tips
- If ticket already completed: Shows completion time
- Shows count of active tickets

### 2. ✅ Debug Panel Added

New debug panel in scanner page:

- Click "🔍 Debug: Lihat Tiket Aktif"
- Shows all active tickets
- Click "Gunakan ID Ini" to auto-fill and scan

### 3. ✅ Console Logging

Added console logs to help debug:

- Open browser console (F12)
- See what tickets are available
- See what ID you're searching for

## How to Test

### Method 1: Using Debug Panel (Easiest)

1. **Create a ticket first**:

   ```
   - Go to homepage (driver page)
   - Enter plate: "B 1234 XYZ"
   - Click "AMBIL TIKET"
   ```

2. **Go to scanner**:

   ```
   - Click "Area Admin"
   - Click "Buka Scanner"
   ```

3. **Use debug panel**:
   ```
   - Scroll down to "🔍 Debug: Lihat Tiket Aktif"
   - Click to expand
   - You'll see your ticket with ID
   - Click "Gunakan ID Ini"
   - ✅ Should show transaction details!
   ```

### Method 2: Manual Copy-Paste

1. **Create ticket and copy ID**:

   ```
   - Create ticket
   - On e-ticket page, scroll to bottom
   - Copy the ID (looks like: "lqz8x9k2abc")
   ```

2. **Paste in scanner**:
   ```
   - Go to scanner
   - Paste ID in "Input ID Tiket Manual"
   - Click "Cari"
   - ✅ Should work!
   ```

### Method 3: Check Browser Console

1. **Open console** (F12)
2. **Check data**:

   ```javascript
   // See all transactions
   JSON.parse(localStorage.getItem("parkir_transactions") || "[]");

   // See active only
   JSON.parse(localStorage.getItem("parkir_transactions") || "[]").filter(
     (t) => t.status === "PARKIR"
   );
   ```

## Common Issues & Fixes

### Issue 1: "Tiket tidak ditemukan"

**Cause**: No tickets created yet

**Fix**:

1. Go to driver page
2. Create a ticket first
3. Then try scanner

### Issue 2: Still not working

**Cause**: Old data with wrong storage key

**Fix**:

```javascript
// Open console (F12) and run:
localStorage.clear();
location.reload();

// Then create new ticket
```

### Issue 3: Ticket exists but not found

**Cause**: Ticket already completed

**Fix**:

- Create a new ticket
- Or check "Riwayat Hari Ini" in dashboard

## Debug Checklist

Before reporting issues, check:

1. ✅ **Ticket created?**

   - Go to driver page
   - Create ticket
   - See QR code

2. ✅ **Ticket active?**

   - Go to Admin Dashboard
   - Check "Kendaraan Aktif" table
   - Should see your plate number

3. ✅ **Correct ID?**

   - Use debug panel to see actual IDs
   - Copy exact ID (case-sensitive)

4. ✅ **Browser console?**
   - Press F12
   - Check for errors
   - See console logs

## Testing Flow

### Complete Test (5 minutes)

```
1. Clear data (optional):
   - F12 → Console
   - localStorage.clear()
   - Reload page

2. Create ticket:
   - Go to homepage
   - Plate: "B 1234 XYZ"
   - Vehicle: Motor
   - Click "AMBIL TIKET"
   - ✅ See QR code

3. Check dashboard:
   - Click "Area Admin"
   - ✅ See 1 vehicle in "Kendaraan Aktif"

4. Use scanner (Method 1 - Debug Panel):
   - Click "Buka Scanner"
   - Scroll to debug panel
   - Click "🔍 Debug: Lihat Tiket Aktif"
   - Click "Gunakan ID Ini"
   - ✅ Should show transaction details
   - ✅ Should show fee (Rp 2,000 for Motor)
   - Click "BAYAR & BUKA GATE"
   - ✅ Success message!

5. Verify completion:
   - Go back to dashboard
   - ✅ Should be in "Riwayat Hari Ini"
   - ✅ Status: SELESAI
```

## New Features

### Debug Panel

- Shows all active tickets
- One-click to use ticket ID
- No need to copy-paste

### Better Errors

- Specific error messages
- Helpful tips
- Shows ticket count

### Console Logging

- See what's happening
- Debug easily
- Track ticket lookup

## Screenshots Guide

### 1. Debug Panel Location

```
Scanner Page
  ↓
Scroll down
  ↓
"🔍 Debug: Lihat Tiket Aktif"
  ↓
Click to expand
  ↓
See active tickets
  ↓
Click "Gunakan ID Ini"
```

### 2. Console Logs

```
F12 → Console
  ↓
See: "Looking for ticket ID: xxx"
  ↓
See: "Available transactions: [...]"
  ↓
See: "Active transactions: [...]"
```

## Quick Commands

### Clear all data:

```javascript
localStorage.removeItem("parkir_transactions");
location.reload();
```

### See active tickets:

```javascript
JSON.parse(localStorage.getItem("parkir_transactions") || "[]")
  .filter((t) => t.status === "PARKIR")
  .map((t) => ({ id: t.id, plate: t.plat_nomor }));
```

### Create test ticket:

```javascript
const testTicket = {
  id: "test123",
  plat_nomor: "B 9999 TEST",
  jenis: "Motor",
  waktu_masuk: Date.now(),
  waktu_keluar: null,
  biaya: 0,
  status: "PARKIR",
};

const transactions = JSON.parse(
  localStorage.getItem("parkir_transactions") || "[]"
);
transactions.push(testTicket);
localStorage.setItem("parkir_transactions", JSON.stringify(transactions));
location.reload();
```

## Success Criteria

Scanner is working when:

- ✅ Debug panel shows active tickets
- ✅ "Gunakan ID Ini" button works
- ✅ Manual input accepts valid IDs
- ✅ Shows transaction details
- ✅ Fee calculation correct
- ✅ Payment completes successfully

## Still Not Working?

1. **Clear everything**:

   ```javascript
   localStorage.clear();
   location.reload();
   ```

2. **Create fresh ticket**:

   - Go to driver page
   - Create new ticket
   - Note the ID

3. **Use debug panel**:

   - Go to scanner
   - Use debug panel
   - Click "Gunakan ID Ini"

4. **Check console**:
   - F12 → Console
   - Look for errors
   - Share error messages

---

**The scanner should now work perfectly with the debug panel!** 🎉
