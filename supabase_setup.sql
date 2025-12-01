-- Parking System Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Create kendaraan_aktif table (active vehicles)
CREATE TABLE IF NOT EXISTS kendaraan_aktif (
  id BIGSERIAL PRIMARY KEY,
  plat_nomor TEXT NOT NULL,
  jenis TEXT NOT NULL CHECK (jenis IN ('Motor', 'Mobil')),
  jam_masuk TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'PARKIR' CHECK (status IN ('PARKIR', 'KELUAR')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create transaksi table (transaction history)
CREATE TABLE IF NOT EXISTS transaksi (
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

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_kendaraan_aktif_status 
  ON kendaraan_aktif(status);

CREATE INDEX IF NOT EXISTS idx_kendaraan_aktif_plat 
  ON kendaraan_aktif(plat_nomor);

CREATE INDEX IF NOT EXISTS idx_kendaraan_aktif_jam_masuk 
  ON kendaraan_aktif(jam_masuk);

CREATE INDEX IF NOT EXISTS idx_transaksi_jam_keluar 
  ON transaksi(jam_keluar);

CREATE INDEX IF NOT EXISTS idx_transaksi_plat 
  ON transaksi(plat_nomor);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE kendaraan_aktif ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for public access (adjust as needed for production)
-- Allow all operations for now (you can restrict this later)

-- Policy for kendaraan_aktif
CREATE POLICY "Allow all operations on kendaraan_aktif" 
  ON kendaraan_aktif 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Policy for transaksi
CREATE POLICY "Allow all operations on transaksi" 
  ON transaksi 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- 6. Enable Realtime for both tables
-- This allows automatic updates in the frontend
ALTER PUBLICATION supabase_realtime ADD TABLE kendaraan_aktif;
ALTER PUBLICATION supabase_realtime ADD TABLE transaksi;

-- 7. Optional: Add some test data
-- Uncomment to insert sample data

-- INSERT INTO kendaraan_aktif (plat_nomor, jenis, jam_masuk, status) VALUES
--   ('B 1234 ABC', 'Motor', NOW() - INTERVAL '30 minutes', 'PARKIR'),
--   ('B 5678 XYZ', 'Mobil', NOW() - INTERVAL '1 hour', 'PARKIR'),
--   ('D 9012 DEF', 'Motor', NOW() - INTERVAL '2 hours', 'PARKIR');

-- 8. Optional: Function to automatically clean up old KELUAR status
-- This function can be called periodically to archive old data
CREATE OR REPLACE FUNCTION cleanup_old_keluar()
RETURNS void AS $$
BEGIN
  -- Delete vehicles with KELUAR status older than 7 days
  DELETE FROM kendaraan_aktif 
  WHERE status = 'KELUAR' 
    AND created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- 9. Optional: Create a view for today's statistics
CREATE OR REPLACE VIEW statistik_hari_ini AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'PARKIR') as total_parkir,
  COUNT(*) FILTER (WHERE status = 'KELUAR') as total_keluar,
  (SELECT COUNT(*) FROM transaksi WHERE DATE(jam_keluar) = CURRENT_DATE) as total_transaksi,
  (SELECT COALESCE(SUM(total_bayar), 0) FROM transaksi WHERE DATE(jam_keluar) = CURRENT_DATE) as total_pendapatan
FROM kendaraan_aktif
WHERE DATE(created_at) = CURRENT_DATE;

-- 10. Create admin_users table for authentication
-- Note: If you already have this table with 'email' column, skip this
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- In production, this should be hashed
  nama_lengkap TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- 11. Create index for admin_users
CREATE INDEX IF NOT EXISTS idx_admin_users_email 
  ON admin_users(email);

-- 12. Enable RLS for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 13. Create policy for admin_users (read-only for authentication)
CREATE POLICY "Allow read access to admin_users" 
  ON admin_users 
  FOR SELECT 
  USING (true);

-- 14. Add your admin users here
-- Example:
-- INSERT INTO admin_users (email, password, nama_lengkap, role) 
-- VALUES ('admin@example.com', 'your_password', 'Your Name', 'superadmin')
-- ON CONFLICT (email) DO NOTHING;

-- Add more admin users as needed:
-- INSERT INTO admin_users (email, password, nama_lengkap, role) VALUES
--   ('operator1@example.com', 'password123', 'Operator 1', 'admin'),
--   ('operator2@example.com', 'password123', 'Operator 2', 'admin');

-- 15. Function to update last_login
CREATE OR REPLACE FUNCTION update_last_login(p_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE admin_users 
  SET last_login = NOW() 
  WHERE email = p_email;
END;
$$ LANGUAGE plpgsql;

-- Done! Your database is ready to use.
-- 
-- IMPORTANT: Add your admin users using INSERT statements above
-- or directly in Supabase Table Editor
