# Test Supabase Connection

## ✅ Your Setup Status

### Database Tables Created:

- ✅ `kendaraan_aktif` - For active parked vehicles
- ✅ `pengguna` - For users (if needed)
- ✅ `transaksi` - For transaction history

### Environment Variables:

- ✅ `VITE_SUPABASE_URL` configured
- ✅ `VITE_SUPABASE_KEY` configured

## 🧪 Quick Test Steps

### Step 1: Verify Table Structure

Run this in Supabase SQL Editor to check your tables:

```sql
-- Check kendaraan_aktif structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'kendaraan_aktif';

-- Check transaksi structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'transaksi';
```

**Expected columns for `kendaraan_aktif`:**

- `id` (bigint)
- `plat_nomor` (text)
- `jenis` (text)
- `jam_masuk` (timestamp with time zone)
- `status` (text)
- `created_at` (timestamp with time zone)

**Expected columns for `transaksi`:**

- `id` (bigint)
- `id_kendaraan` (bigint)
- `plat_nomor` (text)
- `jenis` (text)
- `jam_masuk` (timestamp with time zone)
- `jam_keluar` (timestamp with time zone)
- `total_menit` (integer)
- `total_bayar` (integer)
- `created_at` (timestamp with time zone)

### Step 2: Enable Realtime (IMPORTANT!)

Run this in Supabase SQL Editor:

```sql
-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE kendaraan_aktif;
ALTER PUBLICATION supabase_realtime ADD TABLE transaksi;
```

### Step 3: Check/Create RLS Policies

Run this to check if RLS is enabled:

```sql
-- Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('kendaraan_aktif', 'transaksi');
```

If RLS is enabled but you don't have policies, run:

```sql
-- Enable RLS
ALTER TABLE kendaraan_aktif ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development
CREATE POLICY "Allow all operations on kendaraan_aktif"
  ON kendaraan_aktif
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on transaksi"
  ON transaksi
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### Step 4: Test Insert

Try inserting a test record:

```sql
-- Test insert
INSERT INTO kendaraan_aktif (plat_nomor, jenis, status)
VALUES ('B 9999 TEST', 'Motor', 'PARKIR')
RETURNING *;

-- Check if it was inserted
SELECT * FROM kendaraan_aktif WHERE plat_nomor = 'B 9999 TEST';

-- Clean up test data
DELETE FROM kendaraan_aktif WHERE plat_nomor = 'B 9999 TEST';
```

### Step 5: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

### Step 6: Test the Flow

1. **Create Ticket:**

   - Go to homepage
   - Select "Motor"
   - Enter plate: `B 1234 TEST`
   - Click "AMBIL TIKET"
   - Should see success and ticket page

2. **Check Database:**

   ```sql
   SELECT * FROM kendaraan_aktif WHERE status = 'PARKIR';
   ```

   Should see your test vehicle

3. **Check Admin Dashboard:**

   - Go to: http://localhost:5173/#/admin
   - Should see 1 active vehicle
   - Should see real-time duration counter

4. **Process Exit:**

   - Click "Buka Scanner"
   - Expand "Debug: Lihat Tiket Aktif"
   - Click "Gunakan ID Ini"
   - Click "BAYAR & BUKA GATE"
   - Should see success message

5. **Verify Transaction:**
   ```sql
   SELECT * FROM transaksi ORDER BY created_at DESC LIMIT 1;
   ```
   Should see completed transaction

## 🐛 Common Issues & Solutions

### Issue 1: "Gagal input" error

**Cause:** RLS policies blocking insert
**Solution:** Run the RLS policy creation SQL above

### Issue 2: Dashboard not updating

**Cause:** Realtime not enabled
**Solution:** Run the ALTER PUBLICATION commands above

### Issue 3: "Cannot read properties of undefined"

**Cause:** Table structure mismatch
**Solution:** Check table columns match expected structure

### Issue 4: Connection error

**Cause:** Wrong credentials or network issue
**Solution:**

- Verify `.env` file has correct URL and key
- Check Supabase project is active
- Try accessing Supabase dashboard

## ✅ Success Checklist

- [ ] Tables exist with correct structure
- [ ] Realtime enabled for both tables
- [ ] RLS policies created (or RLS disabled for testing)
- [ ] Test insert works
- [ ] Frontend starts without errors
- [ ] Can create ticket
- [ ] Dashboard shows active vehicles
- [ ] Can process exit
- [ ] Transaction saved to database

## 🎯 Next Steps After Testing

Once everything works:

1. Test duplicate prevention (try same plate twice)
2. Test fee calculation (wait a few minutes, process exit)
3. Test real-time updates (open 2 browser tabs)
4. Review `TESTING_GUIDE.md` for comprehensive tests

## 📞 Need Help?

If you encounter errors:

1. Check browser console (F12)
2. Check Supabase logs
3. Verify table structure matches expected
4. Ensure RLS policies allow operations
