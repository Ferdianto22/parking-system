# Quick Start Guide - Parking System

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Supabase Database (2 minutes)

1. Go to your Supabase project: https://mnugakhanfpifnhnxahn.supabase.co
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy all content from `supabase_setup.sql`
5. Paste and click "Run"
6. ✅ Database ready!

### Step 2: Verify Environment Variables (30 seconds)

Check `frontend/.env` file has:

```
VITE_SUPABASE_URL=https://mnugakhanfpifnhnxahn.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udWdha2hhbmZwaWZuaG54YWhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0OTA0OTUsImV4cCI6MjA4MDA2NjQ5NX0.bkpAlj9mICM_LaL-qG_SL9jwGg2QXEM-A7lkwyzQm9k
```

✅ Already configured!

### Step 3: Install & Run (2 minutes)

```bash
cd frontend
npm install
npm run dev
```

Open browser: http://localhost:5173

### Step 4: Test the System (1 minute)

#### Create a Ticket:

1. Select "Motor"
2. Enter plate: `B 1234 ABC`
3. Click "AMBIL TIKET"
4. ✅ Ticket created! Note the ID at bottom

#### Process Exit:

1. Click "Area Admin →" at bottom
2. Click "Buka Scanner"
3. Scroll to "Debug: Lihat Tiket Aktif"
4. Click "Gunakan ID Ini" for your ticket
5. Click "BAYAR & BUKA GATE"
6. ✅ Payment successful!

## 🎯 Common Tasks

### View Active Vehicles

```
Go to: http://localhost:5173/#/admin
```

### Process Vehicle Exit

```
Go to: http://localhost:5173/#/admin/scanner
Enter ticket ID or use debug panel
```

### Check Database

```sql
-- In Supabase SQL Editor:
SELECT * FROM kendaraan_aktif WHERE status = 'PARKIR';
SELECT * FROM transaksi WHERE DATE(jam_keluar) = CURRENT_DATE;
```

## 🐛 Troubleshooting

### "Gagal input" error

- Check Supabase connection
- Verify tables exist (run supabase_setup.sql)

### Dashboard not updating

- Check browser console for errors
- Verify Realtime is enabled in Supabase

### "Tiket tidak ditemukan"

- Use numeric ID from ticket page
- Don't use plate number in scanner

## 📚 Next Steps

1. Read `TESTING_GUIDE.md` for detailed testing
2. Read `SUPABASE_INTEGRATION.md` for technical details
3. Read `IMPLEMENTATION_SUMMARY.md` for what was fixed

## ✨ Features Working

- ✅ Vehicle entry with duplicate prevention
- ✅ Ticket generation with QR code
- ✅ Real-time dashboard updates
- ✅ Fee calculation (minimum 1 hour, rounds up)
- ✅ Transaction history
- ✅ Manual ticket input
- ✅ Clear error messages
- ✅ Status tracking (PARKIR/KELUAR)

## 🎉 You're Ready!

The system is fully functional. Start testing and enjoy!

For detailed information, see:

- `TESTING_GUIDE.md` - Complete testing scenarios
- `SUPABASE_INTEGRATION.md` - Technical documentation
- `IMPLEMENTATION_SUMMARY.md` - What was fixed and why
