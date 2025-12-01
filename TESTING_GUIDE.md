# Testing Guide - Parking System

## 🎯 Quick Start Testing

### Step 1: Setup Database

1. Go to your Supabase project
2. Open SQL Editor
3. Copy and paste content from `supabase_setup.sql`
4. Click "Run" to execute

### Step 2: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### Step 3: Test Basic Flow

## ✅ Test Cases

### Test 1: Create Parking Ticket

**Goal**: Verify vehicle can enter and get ticket

1. Open `http://localhost:5173`
2. Select "Motor"
3. Enter plate: `B 1234 ABC`
4. Click "AMBIL TIKET"
5. **Expected**:
   - Success message appears
   - QR code displayed
   - Ticket ID shown at bottom (e.g., "ID: 1")
   - Duration counter starts

### Test 2: Duplicate Prevention

**Goal**: Verify same plate can't park twice

1. Go back to homepage
2. Try to enter same plate: `B 1234 ABC`
3. Click "AMBIL TIKET"
4. **Expected**:
   - Error alert: "Plat nomor B 1234 ABC masih parkir! Tidak bisa parkir 2x."

### Test 3: Admin Dashboard

**Goal**: Verify admin can see active vehicles

1. Go to `http://localhost:5173/#/admin`
2. **Expected**:
   - "Kendaraan Parkir" shows: 1
   - Table shows B 1234 ABC with status PARKIR
   - Duration updates every second
   - "Pendapatan Hari Ini" shows: Rp 0

### Test 4: Process Exit (Manual Input)

**Goal**: Verify payment and exit process

1. From Admin Dashboard, click "Buka Scanner"
2. Scroll down to "Debug: Lihat Tiket Aktif"
3. Click to expand
4. Find your vehicle (B 1234 ABC)
5. Click "Gunakan ID Ini"
6. **Expected**:
   - Right panel shows vehicle details
   - Duration calculated correctly
   - Fee shown (minimum Rp 2,000 for Motor)
7. Click "BAYAR & BUKA GATE"
8. **Expected**:
   - Success message: "Pembayaran Berhasil!"
   - After 3 seconds, form clears
   - Vehicle removed from active list

### Test 5: Transaction History

**Goal**: Verify completed transaction appears in history

1. Go back to Admin Dashboard
2. Scroll to "Riwayat Hari Ini"
3. **Expected**:
   - B 1234 ABC appears in history
   - Shows exit time
   - Shows payment amount
   - Status: SELESAI
   - "Pendapatan Hari Ini" updated

### Test 6: Fee Calculation

**Goal**: Verify correct fee calculation

Create multiple tickets and wait different durations:

| Duration     | Expected Hours | Motor Fee | Mobil Fee |
| ------------ | -------------- | --------- | --------- |
| 0-59 min     | 1 hour         | Rp 2,000  | Rp 5,000  |
| 1h 1min - 2h | 2 hours        | Rp 4,000  | Rp 10,000 |
| 2h 1min - 3h | 3 hours        | Rp 6,000  | Rp 15,000 |

**To test quickly**: Modify `jam_masuk` in Supabase directly:

```sql
UPDATE kendaraan_aktif
SET jam_masuk = NOW() - INTERVAL '2 hours 30 minutes'
WHERE id = 1;
```

### Test 7: Real-time Updates

**Goal**: Verify dashboard updates automatically

1. Open Admin Dashboard in Browser Tab 1
2. Open Driver page in Browser Tab 2
3. Create new ticket in Tab 2
4. **Expected**: Tab 1 dashboard updates automatically (no refresh needed)

### Test 8: Invalid Ticket ID

**Goal**: Verify error handling

1. Go to Scanner page
2. Enter invalid ID: `999999`
3. Click "Cari"
4. **Expected**: Error alert: "Tiket tidak ditemukan atau sudah selesai dibayar"

### Test 9: Plate Number vs Ticket ID

**Goal**: Verify clear error message

1. Go to Scanner page
2. Enter plate number: `B 1234 ABC` (instead of ID)
3. Click "Cari"
4. **Expected**:
   - Error alert explaining the mistake
   - Instructions to use ticket ID instead

### Test 10: Multiple Vehicles

**Goal**: Verify system handles multiple vehicles

1. Create 5 different tickets:

   - B 1111 AAA (Motor)
   - B 2222 BBB (Mobil)
   - D 3333 CCC (Motor)
   - D 4444 DDD (Mobil)
   - B 5555 EEE (Motor)

2. Check Admin Dashboard
3. **Expected**:

   - All 5 vehicles shown
   - Correct vehicle types
   - All durations updating

4. Process exit for 2 vehicles
5. **Expected**:
   - Active count: 3
   - History count: 2
   - Revenue calculated correctly

## 🐛 Common Issues

### Issue: "Tiket tidak ditemukan"

**Solution**: Make sure you're using the numeric ID from the ticket page, not the plate number.

### Issue: Dashboard not updating

**Solution**:

1. Check browser console for errors
2. Verify Supabase Realtime is enabled
3. Check `.env` file has correct credentials

### Issue: "Gagal input" error

**Solution**:

1. Check Supabase connection
2. Verify tables exist
3. Check RLS policies allow operations

### Issue: Wrong fee calculation

**Solution**:

1. Check TARIF constant in `frontend/src/constants/index.ts`
2. Verify calculation logic in `keluarParkir()` function

## 📊 Database Verification

Check data directly in Supabase:

```sql
-- View all active vehicles
SELECT * FROM kendaraan_aktif WHERE status = 'PARKIR';

-- View today's transactions
SELECT * FROM transaksi WHERE DATE(jam_keluar) = CURRENT_DATE;

-- View today's revenue
SELECT SUM(total_bayar) as total_pendapatan
FROM transaksi
WHERE DATE(jam_keluar) = CURRENT_DATE;

-- View statistics
SELECT * FROM statistik_hari_ini;
```

## ✨ Advanced Testing

### Test Concurrent Users

1. Open 3 browser windows
2. Create tickets simultaneously
3. Verify no duplicate IDs
4. Verify all appear in dashboard

### Test Long Duration

1. Create ticket
2. Manually update `jam_masuk` to 24 hours ago:

```sql
UPDATE kendaraan_aktif
SET jam_masuk = NOW() - INTERVAL '24 hours'
WHERE id = [your_id];
```

3. Process exit
4. Verify fee: 24 × Rp 2,000 = Rp 48,000 (Motor)

### Test Edge Cases

- Empty plate number
- Special characters in plate
- Very long plate number
- Exit same vehicle twice
- Exit non-existent vehicle

## 🎉 Success Criteria

All tests pass if:

- ✅ No duplicate plates allowed
- ✅ Fees calculated correctly (rounded up)
- ✅ Real-time updates work
- ✅ Clear error messages
- ✅ Transaction history accurate
- ✅ Dashboard statistics correct
- ✅ No console errors
