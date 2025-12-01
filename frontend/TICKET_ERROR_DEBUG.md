# 🔍 Ticket Error Debugging Guide

## Error: "Tiket tidak ditemukan atau sudah selesai"

This error appears when trying to view a ticket after creating it.

---

## 🧪 Debug Steps

### Step 1: Check Browser Console

1. Open browser console (F12)
2. Try to create a ticket
3. Look for these console messages:

```
Loading ticket with ID: 123
Fetching vehicle with ID: 123
getKendaraanById called with ID: 123
Query result: { data: ..., error: ... }
```

### Step 2: Check What's in the Console

#### If you see:

```
Query result: { data: null, error: { code: "PGRST116" } }
```

**Problem**: No rows found in database

**Possible causes**:

1. Ticket was created but not saved to database
2. RLS policy blocking the query
3. Wrong table name

---

## 🔧 Common Fixes

### Fix 1: Check RLS Policy

Run this in Supabase SQL Editor:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'kendaraan_aktif';

-- If RLS is enabled, create policy
DROP POLICY IF EXISTS "Allow all operations on kendaraan_aktif" ON kendaraan_aktif;

CREATE POLICY "Allow all operations on kendaraan_aktif"
  ON kendaraan_aktif
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

---

### Fix 2: Verify Ticket Was Created

```sql
-- Check if ticket exists
SELECT * FROM kendaraan_aktif
WHERE status = 'PARKIR'
ORDER BY jam_masuk DESC
LIMIT 5;
```

**Should show**: Your recently created tickets

---

### Fix 3: Check Table Name

Your code queries `kendaraan_aktif` table. Make sure:

1. Table exists
2. Table name is correct (case-sensitive)
3. Table has these columns:
   - id
   - plat_nomor
   - jenis
   - jam_masuk
   - status

```sql
-- Check table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'kendaraan_aktif';
```

---

## 🎯 Test the Flow

### Step 1: Create Ticket

1. Go to homepage
2. Select vehicle type
3. Enter plate number: `B 1234 TEST`
4. Click "AMBIL TIKET"

### Step 2: Check Console

Look for:

```
Attempting to create ticket...
Ticket created with ID: 123
Navigating to ticket page...
Loading ticket with ID: 123
```

### Step 3: Check Database

```sql
-- Find the ticket
SELECT * FROM kendaraan_aktif
WHERE plat_nomor = 'B 1234 TEST'
AND status = 'PARKIR';
```

---

## 🐛 Common Issues

### Issue 1: RLS Blocking

**Symptom**: Console shows `PGRST116` error

**Fix**: Run RLS policy SQL above

---

### Issue 2: Ticket Not Created

**Symptom**: Console shows "Ticket created" but database is empty

**Fix**: Check `tambahKendaraan` function and RLS policies

---

### Issue 3: Wrong Status

**Symptom**: Ticket exists but status is not "PARKIR"

**Fix**:

```sql
-- Check status
SELECT id, plat_nomor, status FROM kendaraan_aktif
ORDER BY jam_masuk DESC LIMIT 5;

-- Fix status if needed
UPDATE kendaraan_aktif
SET status = 'PARKIR'
WHERE id = YOUR_TICKET_ID;
```

---

## 📝 Quick Test SQL

Run this to test everything:

```sql
-- 1. Check if table exists
SELECT COUNT(*) FROM kendaraan_aktif;

-- 2. Check RLS
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'kendaraan_aktif';

-- 3. Check policies
SELECT * FROM pg_policies WHERE tablename = 'kendaraan_aktif';

-- 4. Check recent tickets
SELECT id, plat_nomor, jenis, status, jam_masuk
FROM kendaraan_aktif
ORDER BY jam_masuk DESC
LIMIT 5;

-- 5. Test insert (should work)
INSERT INTO kendaraan_aktif (plat_nomor, jenis, status)
VALUES ('TEST 123', 'Motor', 'PARKIR')
RETURNING *;

-- 6. Test select (should work)
SELECT * FROM kendaraan_aktif WHERE plat_nomor = 'TEST 123';

-- 7. Clean up test
DELETE FROM kendaraan_aktif WHERE plat_nomor = 'TEST 123';
```

---

## ✅ Expected Console Output

When everything works:

```
// Creating ticket
Attempting to create ticket...
Ticket created: { id: 123, plat_nomor: "B 1234 TEST", ... }

// Loading ticket
Loading ticket with ID: 123
Fetching vehicle with ID: 123
getKendaraanById called with ID: 123
Query result: { data: { id: 123, ... }, error: null }
Vehicle data loaded: { id: 123, plat_nomor: "B 1234 TEST", ... }
```

---

## 🚀 Next Steps

1. **Check console** for error messages
2. **Run SQL tests** to verify database
3. **Fix RLS** if needed
4. **Share console output** if still not working

---

**Most likely fix**: RLS policy blocking the query. Run the RLS fix SQL!
