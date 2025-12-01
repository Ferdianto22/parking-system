# 📖 User Guide - Sistem Parkir QRPark

## 🚗 Untuk Pengendara (Driver)

### Cara Ambil Tiket Parkir:

1. **Buka halaman utama** (localhost:5173)
2. **Pilih jenis kendaraan**: Motor atau Mobil
3. **Masukkan plat nomor**: Contoh: B 1234 XYZ
4. **Klik "AMBIL TIKET"**
5. **Simpan e-ticket** yang muncul (screenshot atau bookmark)

### Format Plat Nomor:

- ✅ Benar: `B 1234 XYZ`, `B1234XYZ`, `DK 5678 AB`
- ❌ Salah: `123`, `ABCD`, `B-1234-XYZ`

### E-Ticket Berisi:

- QR Code (untuk scan di gate keluar)
- Plat nomor kendaraan
- Jenis kendaraan
- Waktu masuk
- ID tiket (untuk referensi)

---

## 👨‍💼 Untuk Admin

### A. Melihat Dashboard

1. **Buka halaman admin** (klik "Area Admin →" atau #/admin)
2. **Dashboard menampilkan**:
   - Jumlah kendaraan parkir saat ini
   - Pendapatan hari ini
   - Total transaksi
   - Daftar kendaraan aktif (real-time)
   - Riwayat transaksi hari ini

### B. Proses Keluar Parkir (Exit Gate)

#### Metode 1: Input Manual (Paling Mudah)

1. **Klik "Buka Scanner"** di dashboard
2. **Tanya plat nomor** ke pengendara
3. **Ketik plat nomor** di kolom "Input Plat Nomor Manual"
   - Contoh: B 1234 XYZ
4. **Klik "Cari"** atau tekan Enter
5. **Sistem menampilkan**:
   - Plat nomor
   - Jenis kendaraan
   - Jam masuk
   - Durasi parkir
   - Total biaya
6. **Klik "BAYAR & BUKA GATE"**
7. **Gate terbuka otomatis**
8. **Selesai!**

#### Metode 2: Quick Select (Tercepat)

1. **Buka panel "Kendaraan Aktif di Parkir"** (sudah terbuka otomatis)
2. **Lihat daftar kendaraan** yang sedang parkir
3. **Klik "Gunakan Plat Ini"** pada kendaraan yang akan keluar
4. **Sistem langsung load detail**
5. **Klik "BAYAR & BUKA GATE"**
6. **Selesai!**

#### Metode 3: Scan QR Code (Coming Soon)

1. **Klik "Aktifkan Kamera"**
2. **Minta pengendara tunjukkan e-ticket**
3. **Scan QR code**
4. **Sistem otomatis load detail**
5. **Klik "BAYAR & BUKA GATE"**

---

## 💰 Tarif Parkir

| Jenis Kendaraan | Tarif per Jam |
| --------------- | ------------- |
| Motor           | Rp 2.000      |
| Mobil           | Rp 5.000      |

### Aturan Perhitungan:

- **Minimum 1 jam**: Parkir 15 menit = bayar 1 jam
- **Pembulatan ke atas**: 1 jam 5 menit = bayar 2 jam
- **Per jam**: Setiap jam atau sebagian jam dihitung penuh

### Contoh Perhitungan:

| Durasi Parkir  | Motor    | Mobil     |
| -------------- | -------- | --------- |
| 15 menit       | Rp 2.000 | Rp 5.000  |
| 1 jam          | Rp 2.000 | Rp 5.000  |
| 1 jam 30 menit | Rp 4.000 | Rp 10.000 |
| 2 jam 15 menit | Rp 6.000 | Rp 15.000 |
| 3 jam 45 menit | Rp 8.000 | Rp 20.000 |

---

## ⚠️ Aturan Penting

### 1. Tidak Boleh Parkir 2x

- Plat nomor yang sama **tidak bisa parkir 2 kali**
- Harus keluar dulu sebelum masuk lagi
- Sistem otomatis cek duplikasi

### 2. Format Plat Nomor

- Harus sesuai format Indonesia
- Huruf-Angka-Huruf
- Contoh: B 1234 XYZ

### 3. Status Kendaraan

- **PARKIR**: Sedang parkir (aktif)
- **KELUAR**: Sudah keluar (selesai)

---

## 🐛 Troubleshooting

### Problem: "Plat nomor tidak ditemukan"

**Penyebab**:

- Plat nomor salah ketik
- Kendaraan sudah keluar
- Kendaraan belum masuk

**Solusi**:

1. Cek ejaan plat nomor
2. Lihat daftar "Kendaraan Aktif"
3. Pastikan kendaraan ada di daftar

---

### Problem: "Plat nomor X masih parkir! Tidak bisa parkir 2x"

**Penyebab**:

- Plat nomor sudah ada di sistem
- Belum keluar dari parkir sebelumnya

**Solusi**:

1. Cek di dashboard admin
2. Proses keluar dulu
3. Baru bisa masuk lagi

---

### Problem: "Format plat nomor tidak valid"

**Penyebab**:

- Format salah
- Karakter tidak valid

**Solusi**:

- Gunakan format: B 1234 XYZ
- Hanya huruf dan angka
- Spasi boleh ada atau tidak

---

## 📱 Tips & Trik

### Untuk Pengendara:

1. **Screenshot e-ticket** untuk backup
2. **Bookmark halaman** e-ticket
3. **Catat plat nomor** dengan benar
4. **Simpan e-ticket** sampai keluar

### Untuk Admin:

1. **Gunakan Quick Select** untuk lebih cepat
2. **Cek daftar aktif** sebelum input manual
3. **Verifikasi plat nomor** dengan kendaraan
4. **Monitor dashboard** untuk statistik

---

## 🎯 Fitur Unggulan

### Real-time Updates

- Dashboard update otomatis setiap detik
- Durasi parkir update real-time
- Tidak perlu refresh manual

### Duplicate Prevention

- Sistem cek otomatis
- Tidak bisa parkir 2x
- Error message jelas

### Easy Exit Process

- Input plat nomor langsung
- Quick select dari daftar
- Scan QR code (coming soon)

### Accurate Billing

- Perhitungan otomatis
- Minimum 1 jam
- Pembulatan ke atas

---

## 📞 Bantuan

### Butuh Bantuan?

1. Baca dokumentasi lengkap di folder `frontend/`
2. Cek file `PARKING_LOGIC_FIXES.md` untuk detail teknis
3. Lihat `QUICK_REFERENCE.md` untuk referensi cepat

### Lapor Bug?

1. Catat error message
2. Screenshot jika perlu
3. Catat langkah reproduksi

---

**Selamat menggunakan QRPark! 🚗✨**
