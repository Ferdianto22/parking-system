# 🎥 Camera & Scanner Fix

## Issues Fixed

### 1. ✅ Camera Not Showing Video

**Problem**: Camera activates but shows "Kamera belum aktif"

**Solution**:

- Added video.play() after stream loads
- Added proper video dimensions
- Added error logging

### 2. ✅ Wrong Input (Plate Number vs Ticket ID)

**Problem**: Users entering plate number "BG 1234 AB" instead of ticket ID

**Solution**:

- Detects if input looks like plate number
- Shows clear error message explaining the difference
- Added visual warnings in UI
- Better placeholder text

## How to Use

### Method 1: Debug Panel (Recommended!)

```
1. Create ticket on homepage
2. Go to Scanner page
3. Scroll to bottom
4. Click "🔍 Debug: Lihat Tiket Aktif"
5. Click "Gunakan ID Ini"
✅ Works instantly!
```

### Method 2: Manual Input (Correct Way)

```
1. Create ticket on homepage
2. On e-ticket page, scroll to BOTTOM
3. Copy the ID (looks like: lqz8x9k2abc)
   ❌ DON'T copy plate number (B 1234 XYZ)
   ✅ DO copy ticket ID (lqz8x9k2abc)
4. Go to Scanner
5. Paste ID in input field
6. Click "Cari"
✅ Should work!
```

### Method 3: Camera (For QR Scanning)

```
1. Go to Scanner page
2. Click "Aktifkan Kamera"
3. Allow camera permission
4. ✅ Camera feed should appear
5. Point at QR code
⚠️ Note: QR scanning library not yet implemented
   Use manual input for now
```

## Common Mistakes

### ❌ Mistake 1: Entering Plate Number

```
Input: "BG 1234 AB"  ❌ WRONG!
Error: "Anda memasukkan PLAT NOMOR!"
```

**Fix**: Enter ticket ID instead

```
Input: "lqz8x9k2abc"  ✅ CORRECT!
```

### ❌ Mistake 2: No Tickets Created

```
Error: "Tiket tidak ditemukan"
Active tickets: 0
```

**Fix**: Create ticket first on homepage

### ❌ Mistake 3: Camera Permission Denied

```
Error: "Tidak dapat mengakses kamera"
```

**Fix**:

- Allow camera permission in browser
- Or use manual input instead

## Visual Guide

### Where to Find Ticket ID

```
E-Ticket Page
├── QR Code (top)
├── Plate Number: B 1234 XYZ  ❌ Don't copy this
├── Vehicle Type: Motor
├── Entry Time: 22:01 WIB
├── Duration: 14j 55m
└── ID: lqz8x9k2abc  ✅ Copy this!
```

### Scanner Input Field

```
Before Fix:
[Masukkan ID tiket...]  ← Not clear

After Fix:
[Contoh: lqz8x9k2abc (bukan plat nomor!)]  ← Very clear!

⚠️ PENTING: Masukkan ID TIKET, bukan plat nomor!
💡 ID tiket ada di bagian bawah halaman e-ticket
```

## Error Messages

### New Smart Error Detection

**If you enter plate number**:

```
❌ KESALAHAN: Anda memasukkan PLAT NOMOR "BG 1234 AB"!

✅ Yang benar: Masukkan ID TIKET (contoh: lqz8x9k2abc)

📍 Cara mendapatkan ID tiket:
1. Buka halaman e-ticket pengendara
2. Scroll ke bawah
3. Salin ID yang tertulis (bukan plat nomor)

💡 Atau gunakan panel "Debug: Lihat Tiket Aktif" di bawah
```

**If ticket not found**:

```
Tiket dengan ID "xxx" tidak ditemukan!

Tips:
- Pastikan ID tiket benar (bukan plat nomor!)
- ID tiket ada di halaman e-ticket pengendara
- Atau gunakan panel debug di bawah
- Total tiket aktif saat ini: 1
```

## Camera Improvements

### Before:

- Camera activates but no video
- No error messages
- Confusing state

### After:

- ✅ Video plays automatically
- ✅ Proper dimensions (1280x720)
- ✅ Error logging to console
- ✅ Clear error messages
- ✅ Fallback to manual input

## Testing Steps

### Test 1: Camera

```
1. Go to Scanner
2. Click "Aktifkan Kamera"
3. Allow permission
4. ✅ Should see camera feed
5. Click "Matikan Kamera"
6. ✅ Feed should stop
```

### Test 2: Manual Input (Correct)

```
1. Create ticket → Get ID: "lqz8x9k2abc"
2. Go to Scanner
3. Enter: "lqz8x9k2abc"
4. Click "Cari"
5. ✅ Should show transaction details
```

### Test 3: Manual Input (Wrong - Plate)

```
1. Go to Scanner
2. Enter: "BG 1234 AB"
3. Click "Cari"
4. ✅ Should show error about plate number
```

### Test 4: Debug Panel

```
1. Create ticket
2. Go to Scanner
3. Scroll to debug panel
4. Click "Gunakan ID Ini"
5. ✅ Should work immediately
```

## Browser Console

### Check Camera Status

```javascript
// Open F12 console
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => console.log("Camera OK:", stream))
  .catch((err) => console.error("Camera Error:", err));
```

### Check Tickets

```javascript
// See all tickets
JSON.parse(localStorage.getItem("parkir_transactions") || "[]");

// See active only
JSON.parse(localStorage.getItem("parkir_transactions") || "[]")
  .filter((t) => t.status === "PARKIR")
  .map((t) => ({ id: t.id, plate: t.plat_nomor }));
```

## Quick Reference

| Input       | Type         | Result               |
| ----------- | ------------ | -------------------- |
| lqz8x9k2abc | Ticket ID    | ✅ Works             |
| BG 1234 AB  | Plate Number | ❌ Error (detected!) |
| 123456      | Random       | ❌ Not found         |
| (empty)     | Empty        | ❌ Error             |

## Success Checklist

Scanner is working when:

- ✅ Camera shows video feed
- ✅ Manual input accepts ticket IDs
- ✅ Rejects plate numbers with clear error
- ✅ Debug panel shows active tickets
- ✅ "Gunakan ID Ini" button works
- ✅ Transaction details appear
- ✅ Payment completes

## Still Having Issues?

### Issue: Camera shows but no video

**Solution**:

1. Check browser console (F12) for errors
2. Try different browser (Chrome recommended)
3. Check camera permissions
4. Use manual input as fallback

### Issue: "Ticket not found" even with correct ID

**Solution**:

1. Check console logs (F12)
2. Verify ticket exists in debug panel
3. Make sure ticket status is "PARKIR"
4. Clear localStorage and create new ticket

### Issue: Confused about ID vs Plate

**Solution**:

- **Plate Number**: B 1234 XYZ (for vehicle)
- **Ticket ID**: lqz8x9k2abc (for parking)
- Always use Ticket ID in scanner!

---

**Camera now works and scanner detects wrong input!** 🎉
