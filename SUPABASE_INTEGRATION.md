# Supabase Integration - Parking System

## ✅ What's Fixed

### 1. **Duplicate Plate Number Prevention**

- System now checks if a plate number is already parked before allowing entry
- Error message: "Plat nomor XXX masih parkir! Tidak bisa parkir 2x."

### 2. **Proper Status Tracking**

- Vehicles have clear status: `PARKIR` (active) or `KELUAR` (completed)
- Only active vehicles (`status = 'PARKIR'`) can be processed for exit
- Completed transactions are moved to history table

### 3. **Correct Fee Calculation**

- Minimum 1 hour charge
- Rounds up to nearest hour (e.g., 1h 15m = 2 hours)
- Formula: `Math.max(1, Math.ceil(minutes / 60)) × tarif_per_jam`
- Tarif: Motor = Rp 2,000/jam, Mobil = Rp 5,000/jam

### 4. **Real-time Updates**

- Dashboard auto-updates when vehicles enter/exit
- Uses Supabase Realtime subscriptions
- No need to refresh page manually

### 5. **Proper ID System**

- Ticket ID is now a numeric database ID (not random string)
- Clear error messages if user enters plate number instead of ID
- Debug panel shows all active tickets with their IDs

## 📁 New Files Created

### 1. `frontend/src/services/parkir.service.ts`

Contains all Supabase database operations:

- `tambahKendaraan()` - Add new vehicle (with duplicate check)
- `getKendaraanAktif()` - Get all active parked vehicles
- `getTransaksiHariIni()` - Get today's completed transactions
- `getKendaraanById()` - Get vehicle by ID
- `keluarParkir()` - Process exit and payment

### 2. `frontend/src/hooks/useRealtimeKendaraan.ts`

Real-time subscription hook that listens to database changes and auto-refreshes data.

## 🔄 Updated Components

### 1. **DriverLanding.tsx**

- Now uses `tambahKendaraan()` to create parking entry
- Validates plate format
- Checks for duplicates via Supabase
- Shows loading state during submission

### 2. **DriverTicket.tsx**

- Fetches vehicle data from Supabase by ID
- Auto-refreshes every 5 seconds
- Shows proper error if ticket not found

### 3. **AdminDashboard.tsx**

- Loads active vehicles and completed transactions from Supabase
- Real-time updates via `useRealtimeKendaraan` hook
- Displays revenue and statistics

### 4. **AdminScanner.tsx**

- Validates ticket ID (must be numeric)
- Clear error messages for invalid input
- Processes payment via `keluarParkir()`
- Debug panel shows all active tickets
- "Gunakan ID Ini" button for easy testing

## 🗄️ Database Schema Required

Make sure your Supabase database has these tables:

### Table: `kendaraan_aktif`

```sql
CREATE TABLE kendaraan_aktif (
  id BIGSERIAL PRIMARY KEY,
  plat_nomor TEXT NOT NULL,
  jenis TEXT NOT NULL CHECK (jenis IN ('Motor', 'Mobil')),
  jam_masuk TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'PARKIR' CHECK (status IN ('PARKIR', 'KELUAR')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_kendaraan_aktif_status ON kendaraan_aktif(status);
CREATE INDEX idx_kendaraan_aktif_plat ON kendaraan_aktif(plat_nomor);
```

### Table: `transaksi`

```sql
CREATE TABLE transaksi (
  id BIGSERIAL PRIMARY KEY,
  id_kendaraan BIGINT NOT NULL,
  plat_nomor TEXT NOT NULL,
  jenis TEXT NOT NULL,
  jam_masuk TIMESTAMPTZ NOT NULL,
  jam_keluar TIMESTAMPTZ NOT NULL,
  total_menit INTEGER NOT NULL,
  total_bayar INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_transaksi_jam_keluar ON transaksi(jam_keluar);
```

### Enable Realtime

```sql
-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE kendaraan_aktif;
ALTER PUBLICATION supabase_realtime ADD TABLE transaksi;
```

## 🚀 How to Use

### For Drivers:

1. Go to homepage
2. Select vehicle type (Motor/Mobil)
3. Enter plate number (e.g., B 1234 XYZ)
4. Click "AMBIL TIKET"
5. Save the ticket page (note the ID at bottom)

### For Admin (Exit Gate):

1. Go to Admin Dashboard (#/admin)
2. Click "Buka Scanner"
3. **Option A**: Enter ticket ID manually
4. **Option B**: Use debug panel to select active ticket
5. Review details (duration, fee)
6. Click "BAYAR & BUKA GATE"

## 🧪 Testing

### Test Duplicate Prevention:

1. Create ticket with plate "B 1234 ABC"
2. Try to create another ticket with same plate
3. Should show error: "Plat nomor B 1234 ABC masih parkir!"

### Test Fee Calculation:

- 30 minutes = 1 hour = Rp 2,000 (Motor) or Rp 5,000 (Mobil)
- 1 hour 15 minutes = 2 hours = Rp 4,000 (Motor) or Rp 10,000 (Mobil)
- 2 hours 1 minute = 3 hours = Rp 6,000 (Motor) or Rp 15,000 (Mobil)

### Test Real-time Updates:

1. Open Admin Dashboard in one browser tab
2. Create new ticket in another tab
3. Dashboard should auto-update without refresh

## 🔧 Environment Variables

Make sure `.env` file has:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## 📝 Notes

- Camera/QR scanning is prepared but not fully implemented (manual input works)
- Ticket IDs are now numeric (database auto-increment)
- All times are stored in ISO format with timezone
- Real-time updates work automatically via Supabase subscriptions
- No localStorage used anymore - everything in Supabase database
