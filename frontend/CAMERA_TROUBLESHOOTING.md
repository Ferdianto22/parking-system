# 📷 Camera Troubleshooting Guide

## Issue: Camera Cannot Be Detected

When clicking "Aktifkan Kamera", the camera doesn't work.

---

## 🔍 Common Causes & Solutions

### 1. **Browser Permission Not Granted** ⚠️

**Symptoms**:

- Alert shows "Izin kamera ditolak!"
- Camera icon in address bar shows blocked

**Solution**:

```
1. Look for camera icon in browser address bar (🔒 or 📷)
2. Click the icon
3. Select "Allow" for camera
4. Refresh the page (F5)
5. Click "Aktifkan Kamera" again
```

**Chrome**:

- Click lock icon → Site settings → Camera → Allow

**Firefox**:

- Click lock icon → Permissions → Camera → Allow

**Edge**:

- Click lock icon → Permissions for this site → Camera → Allow

---

### 2. **Camera Already in Use** 🎥

**Symptoms**:

- Alert shows "Kamera sedang digunakan!"
- Error: `NotReadableError` or `TrackStartError`

**Solution**:

```
Close other applications using camera:
- Zoom, Teams, Skype, Google Meet
- Other browser tabs with camera
- Camera app
- OBS, Streamlabs
```

**How to check**:

- Windows: Task Manager → Check running apps
- Close all video call apps
- Close other browser tabs
- Try again

---

### 3. **Camera Not Found** 📹

**Symptoms**:

- Alert shows "Kamera tidak ditemukan!"
- Error: `NotFoundError` or `DevicesNotFoundError`

**Solution**:

```
1. Check if camera is connected (for external webcam)
2. Check Device Manager (Windows):
   - Press Win + X → Device Manager
   - Look for "Cameras" or "Imaging devices"
   - Make sure no yellow warning icon
3. Try unplugging and replugging USB camera
4. Restart computer
```

---

### 4. **HTTPS Required** 🔒

**Symptoms**:

- Error: `SecurityError`
- Camera works on localhost but not on deployed site

**Solution**:

```
Modern browsers require HTTPS for camera access

✅ Works on:
- localhost (http://localhost:5173)
- 127.0.0.1
- HTTPS sites

❌ Doesn't work on:
- HTTP sites (except localhost)
- File:// protocol
```

**For deployment**:

- Use HTTPS (SSL certificate)
- Use services like Vercel, Netlify (auto HTTPS)
- Or use Cloudflare for free SSL

---

### 5. **Browser Not Supported** 🌐

**Symptoms**:

- Alert shows "Browser tidak mendukung akses kamera"

**Solution**:

```
Use modern browsers:
✅ Chrome 53+
✅ Firefox 36+
✅ Edge 79+
✅ Safari 11+
✅ Opera 40+

❌ Internet Explorer (not supported)
❌ Very old browser versions
```

---

## 🧪 Test Camera Access

### Method 1: Browser Console Test

1. Open browser console (F12)
2. Run this code:

```javascript
// Test camera access
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    console.log("✅ Camera works!", stream);
    stream.getTracks().forEach((track) => track.stop());
  })
  .catch((err) => {
    console.error("❌ Camera error:", err.name, err.message);
  });
```

### Method 2: Check Available Devices

```javascript
// List all media devices
navigator.mediaDevices.enumerateDevices().then((devices) => {
  console.log("Available devices:");
  devices.forEach((device) => {
    console.log(device.kind + ": " + device.label);
  });
});
```

---

## 🔧 Quick Fixes

### Fix 1: Reset Browser Permissions

**Chrome**:

```
1. Go to: chrome://settings/content/camera
2. Find your site in "Blocked" list
3. Remove it
4. Refresh page and allow again
```

**Firefox**:

```
1. Go to: about:preferences#privacy
2. Scroll to "Permissions" → Camera
3. Find your site and remove
4. Refresh page and allow again
```

---

### Fix 2: Check Windows Camera Privacy

**Windows 10/11**:

```
1. Settings → Privacy → Camera
2. Make sure "Allow apps to access your camera" is ON
3. Make sure "Allow desktop apps to access your camera" is ON
4. Restart browser
```

---

### Fix 3: Update Browser

```
1. Check browser version
2. Update to latest version
3. Restart browser
4. Try again
```

---

## 📱 Alternative: Use Manual Input

If camera still doesn't work, use manual plate number input:

```
1. Ask driver for plate number
2. Type in "Input Plat Nomor Manual" field
3. Click "Cari"
4. Process payment
```

This works without camera! ✅

---

## 🎯 Expected Behavior

When camera works correctly:

1. Click "Aktifkan Kamera"
2. Browser asks for permission
3. Click "Allow"
4. Camera feed appears in black box
5. White border shows scan area
6. Ready to scan QR code

---

## 📊 Error Messages Explained

| Error Name           | Meaning                  | Solution                |
| -------------------- | ------------------------ | ----------------------- |
| NotAllowedError      | Permission denied        | Allow camera in browser |
| NotFoundError        | No camera found          | Check camera connection |
| NotReadableError     | Camera in use            | Close other apps        |
| OverconstrainedError | Resolution not supported | Use different camera    |
| SecurityError        | HTTPS required           | Use HTTPS or localhost  |

---

## 🔍 Debug Mode

The scanner now has detailed error messages. When you click "Aktifkan Kamera", check:

1. **Browser console** (F12) for detailed logs
2. **Alert message** for specific error and solution
3. **Camera icon** in address bar for permission status

---

## ✅ Checklist

Before reporting camera issues:

- [ ] Using modern browser (Chrome, Firefox, Edge)
- [ ] Camera permission granted in browser
- [ ] No other app using camera
- [ ] Camera physically connected (if external)
- [ ] Using HTTPS or localhost
- [ ] Browser console checked for errors
- [ ] Tried manual input as alternative

---

## 💡 Pro Tips

1. **Use Chrome** - Best camera support
2. **Test on localhost first** - No HTTPS needed
3. **Close video call apps** - They block camera
4. **Use manual input** - Works without camera
5. **Check console** - Shows detailed errors

---

## 🚀 For Production

When deploying:

1. **Use HTTPS** - Required for camera
2. **Test on real device** - Not just localhost
3. **Provide manual input** - Backup method
4. **Show clear errors** - Help users fix issues
5. **Test on multiple browsers** - Ensure compatibility

---

**Most common fix**: Allow camera permission in browser! 📷✅
