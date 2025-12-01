# 🧪 Testing Guide

## How to Test the Parking System

### Prerequisites

```bash
# Start the development server
npm run dev
```

Open browser to `http://localhost:5173`

---

## Test Scenarios

### ✅ Test 1: Normal Parking Flow

**Steps**:

1. Open the app (Driver Landing page)
2. Select vehicle type: "Motor"
3. Enter plate number: "B 1234 XYZ"
4. Click "AMBIL TIKET"
5. ✅ Should show ticket with QR code
6. Copy the ticket ID from bottom of page
7. Click "Area Admin →"
8. Click "Buka Scanner"
9. Paste ticket ID in "Input ID Tiket Manual"
10. Click "Cari"
11. ✅ Should show transaction details with fee
12. Click "BAYAR & BUKA GATE"
13. ✅ Should show success message
14. Go back to Dashboard
15. ✅ Transaction should be in "Riwayat Hari Ini"

**Expected Results**:

- ✅ Ticket created successfully
- ✅ QR code displayed
- ✅ Fee calculated correctly (minimum 1 hour)
- ✅ Payment processed
- ✅ Status changed from PARKIR to SELESAI

---

### ✅ Test 2: Duplicate Plate Prevention

**Steps**:

1. Create ticket with plate "B 5678 ABC"
2. Try to create another ticket with same plate "B 5678 ABC"
3. ✅ Should show error: "Plat nomor B 5678 ABC masih parkir!"

**Expected Results**:

- ✅ First ticket created
- ✅ Second ticket blocked
- ✅ Error message shown

---

### ✅ Test 3: Plate Number Validation

**Invalid Plates** (should show error):

- "123" ❌
- "ABCD" ❌
- "B 12345 XYZ" ❌ (too many digits)
- "ABC 123 DEFG" ❌ (too many letters)

**Valid Plates** (should work):

- "B 1234 XYZ" ✅
- "AB 123 CD" ✅
- "D 5 F" ✅
- "BK 9999 AA" ✅

**Expected Results**:

- ✅ Invalid plates rejected with error message
- ✅ Valid plates accepted

---

### ✅ Test 4: Fee Calculation

**Test 4a: Less than 1 hour**

1. Create ticket
2. Immediately scan (within 1 minute)
3. ✅ Should charge for 1 hour (minimum)
   - Motor: Rp 2,000
   - Mobil: Rp 5,000

**Test 4b: Exactly 1 hour**

1. Create ticket
2. Wait 1 hour (or change system time)
3. Scan ticket
4. ✅ Should charge for 1 hour

**Test 4c: 1 hour 30 minutes**

1. Create ticket
2. Wait 1.5 hours
3. Scan ticket
4. ✅ Should charge for 2 hours (rounded up)
   - Motor: Rp 4,000
   - Mobil: Rp 10,000

**Expected Results**:

- ✅ Minimum 1 hour charged
- ✅ Partial hours rounded up
- ✅ Correct tariff applied (Motor: 2k/hour, Mobil: 5k/hour)

---

### ✅ Test 5: Multiple Vehicles

**Steps**:

1. Create 5 different tickets:
   - B 1111 AA (Motor)
   - B 2222 BB (Motor)
   - B 3333 CC (Mobil)
   - D 4444 DD (Motor)
   - D 5555 EE (Mobil)
2. Go to Admin Dashboard
3. ✅ Should show 5 active vehicles
4. Complete payment for B 1111 AA
5. ✅ Should show 4 active, 1 completed
6. Complete payment for B 2222 BB
7. ✅ Should show 3 active, 2 completed

**Expected Results**:

- ✅ All vehicles tracked separately
- ✅ Dashboard shows correct counts
- ✅ Status updates in real-time

---

### ✅ Test 6: Real-time Updates

**Steps**:

1. Open Admin Dashboard in one tab
2. Open Driver Landing in another tab
3. Create ticket in driver tab
4. ✅ Dashboard should update within 1 second
5. Duration should update every second
6. Complete payment in scanner
7. ✅ Dashboard should update immediately

**Expected Results**:

- ✅ Dashboard updates automatically
- ✅ Duration counts up in real-time
- ✅ No page refresh needed

---

### ✅ Test 7: Scanner Manual Input

**Steps**:

1. Create ticket and get ID
2. Go to Scanner page
3. Test manual input:
   - Empty input → ✅ Should show error
   - Wrong ID → ✅ Should show "not found"
   - Correct ID → ✅ Should show details
   - Already paid ID → ✅ Should show "sudah selesai"

**Expected Results**:

- ✅ Proper validation
- ✅ Clear error messages
- ✅ Input cleared after error

---

### ✅ Test 8: Camera Access

**Steps**:

1. Go to Scanner page
2. Click "Aktifkan Kamera"
3. Allow camera permission
4. ✅ Should show camera feed
5. Click "Matikan Kamera"
6. ✅ Camera should stop

**Expected Results**:

- ✅ Camera permission requested
- ✅ Camera feed displayed
- ✅ Can start/stop camera
- ✅ Fallback to manual input if denied

---

## Edge Cases

### Edge Case 1: Same Plate After Completion

1. Create ticket with "B 9999 ZZ"
2. Complete payment
3. Create new ticket with "B 9999 ZZ"
4. ✅ Should work (previous parking completed)

### Edge Case 2: Browser Refresh

1. Create ticket
2. Refresh page
3. ✅ Data should persist
4. Go to admin
5. ✅ Should still see active parking

### Edge Case 3: Multiple Tabs

1. Open 2 driver tabs
2. Create ticket in tab 1
3. Try same plate in tab 2
4. ✅ Should show error (real-time check)

---

## Data Management

### Clear All Data

```javascript
// Open browser console (F12)
localStorage.removeItem("parkir_transactions");
location.reload();
```

### View Current Data

```javascript
// Open browser console (F12)
JSON.parse(localStorage.getItem("parkir_transactions") || "[]");
```

### Export Data

```javascript
// Open browser console (F12)
const data = localStorage.getItem("parkir_transactions");
console.log(data);
// Copy and save to file
```

---

## Performance Testing

### Test 1: Many Vehicles

1. Create 50+ tickets
2. Check dashboard performance
3. ✅ Should load within 1 second
4. ✅ Real-time updates should work

### Test 2: Long Duration

1. Create ticket
2. Manually set old timestamp:

```javascript
const transactions = JSON.parse(
  localStorage.getItem("parkir_transactions") || "[]"
);
transactions[0].waktu_masuk = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
localStorage.setItem("parkir_transactions", JSON.stringify(transactions));
location.reload();
```

3. ✅ Should calculate fee correctly

---

## Browser Compatibility

Test on:

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Mobile browsers (camera may vary)

---

## Known Limitations

1. **QR Code Scanning**: Camera shows but QR scanning not implemented yet
   - **Workaround**: Use manual ID input
2. **Offline Mode**: Requires internet for initial load

   - **Future**: Add service worker

3. **Multi-user**: No backend, data is local only
   - **Future**: Add API integration

---

## Troubleshooting

### Issue: "Tiket tidak ditemukan"

**Solution**: Check if using correct storage key. Clear old data:

```javascript
localStorage.removeItem("transactions"); // old key
localStorage.removeItem("parkir_transactions"); // new key
location.reload();
```

### Issue: Duplicate plates still appearing

**Solution**: Clear browser cache and localStorage

### Issue: Camera not working

**Solution**:

1. Check browser permissions
2. Use HTTPS (required for camera)
3. Use manual input as fallback

### Issue: Fee calculation wrong

**Solution**: Check TARIF constants in `/constants/index.ts`

---

## Success Criteria

All tests should pass:

- ✅ Normal flow works end-to-end
- ✅ Duplicate prevention works
- ✅ Validation works
- ✅ Fee calculation correct
- ✅ Status tracking accurate
- ✅ Real-time updates work
- ✅ Manual input works
- ✅ Data persists

---

**Happy Testing!** 🎉

If you find any bugs, check [BUGS_FIXED.md](./BUGS_FIXED.md) for known issues and solutions.
