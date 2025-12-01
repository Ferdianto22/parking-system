# 🔐 Admin Login System

## Overview

The parking system now has a secure admin login system that protects the admin dashboard and scanner pages.

---

## ✨ Features

### 1. **Authentication Required**

- Admin dashboard requires login
- Scanner page requires login
- Session persists in localStorage
- Auto-redirect to login if not authenticated

### 2. **Secure Login**

- Username and password validation
- Credentials checked against Supabase database
- Password visibility toggle
- Error handling with clear messages

### 3. **Session Management**

- Login session saved to localStorage
- Logout functionality
- Auto-check authentication on page load
- Last login timestamp tracking

---

## 🗄️ Database Setup

### Admin Users Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nama_lengkap TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_admin_users_username
  ON admin_users(username);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow read access to admin_users"
  ON admin_users
  FOR SELECT
  USING (true);

-- Insert default admin
INSERT INTO admin_users (username, password, nama_lengkap, role)
VALUES ('admin', 'admin123', 'Administrator', 'superadmin')
ON CONFLICT (username) DO NOTHING;

-- Function to update last_login
CREATE OR REPLACE FUNCTION update_last_login(p_username TEXT)
RETURNS void AS $$
BEGIN
  UPDATE admin_users
  SET last_login = NOW()
  WHERE username = p_username;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔑 Default Credentials

**Username**: `admin`  
**Password**: `admin123`

⚠️ **IMPORTANT**: Change this password in production!

---

## 📱 How to Use

### For Admin Users:

#### 1. **Access Login Page**

```
Method 1: Click "Area Admin →" on homepage
Method 2: Navigate to: #/admin/login
Method 3: Try to access #/admin (auto-redirects to login)
```

#### 2. **Login Process**

```
1. Enter username: admin
2. Enter password: admin123
3. Click "LOGIN" button
4. Redirected to admin dashboard
```

#### 3. **Logout**

```
1. Click "Logout" button in dashboard
2. Confirm logout
3. Redirected to homepage
4. Session cleared
```

---

## 🔒 Security Features

### 1. **Route Protection**

- Admin routes check authentication
- Unauthenticated users redirected to login
- Session validated on every navigation

### 2. **Session Management**

```typescript
// Check if authenticated
AuthService.isAuthenticated(); // true/false

// Get current admin
AuthService.getCurrentAdmin(); // AdminUser | null

// Logout
AuthService.logout(); // Clears session
```

### 3. **Database Security**

- Row Level Security (RLS) enabled
- Read-only policy for authentication
- Password stored in database (should be hashed in production)

---

## 🛠️ Technical Implementation

### AuthService

```typescript
// Login
const admin = await AuthService.login({
  username: "admin",
  password: "admin123",
});

// Check authentication
const isAuth = AuthService.isAuthenticated();

// Get current admin
const admin = AuthService.getCurrentAdmin();

// Logout
AuthService.logout();
```

### Protected Routes

```typescript
// In App.tsx
if (hash === "/admin") {
  if (AuthService.isAuthenticated()) {
    setCurrentView("admin");
  } else {
    window.location.hash = "/admin/login";
  }
}
```

---

## 👥 User Management

### Add New Admin User

```sql
INSERT INTO admin_users (username, password, nama_lengkap, role)
VALUES ('operator1', 'password123', 'Operator 1', 'admin');
```

### Update Password

```sql
UPDATE admin_users
SET password = 'new_password'
WHERE username = 'admin';
```

### Deactivate User

```sql
UPDATE admin_users
SET is_active = false
WHERE username = 'operator1';
```

### View All Users

```sql
SELECT id, username, nama_lengkap, role, is_active, last_login
FROM admin_users
ORDER BY created_at DESC;
```

---

## 🎯 User Roles

### Superadmin

- Full access to all features
- Can manage other admins (future feature)
- Default role for main admin

### Admin

- Access to dashboard and scanner
- Cannot manage other admins
- For operators/staff

---

## 🔐 Production Security Recommendations

### 1. **Hash Passwords**

```typescript
// Use bcrypt or similar
import bcrypt from "bcrypt";

const hashedPassword = await bcrypt.hash(password, 10);
```

### 2. **Use Environment Variables**

```env
VITE_DEFAULT_ADMIN_PASSWORD=your_secure_password
```

### 3. **Implement JWT Tokens**

```typescript
// Instead of localStorage, use JWT
const token = jwt.sign({ userId: admin.id }, SECRET_KEY);
```

### 4. **Add Rate Limiting**

```typescript
// Limit login attempts
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes
```

### 5. **Enable HTTPS**

```
Always use HTTPS in production
Never send passwords over HTTP
```

### 6. **Add Session Timeout**

```typescript
// Auto-logout after inactivity
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
```

---

## 🐛 Troubleshooting

### Problem: "Username atau password salah"

**Causes**:

- Wrong username or password
- User is deactivated (is_active = false)
- Database connection issue

**Solutions**:

1. Check credentials
2. Verify user exists in database
3. Check is_active status
4. Check Supabase connection

---

### Problem: "Redirected to login after successful login"

**Causes**:

- Session not saved properly
- localStorage blocked
- Browser privacy mode

**Solutions**:

1. Check browser console for errors
2. Enable localStorage
3. Disable privacy/incognito mode
4. Clear browser cache

---

### Problem: "Can't access admin pages"

**Causes**:

- Not logged in
- Session expired
- localStorage cleared

**Solutions**:

1. Login again
2. Check if session exists
3. Verify authentication

---

## 📊 Login Flow Diagram

```
User clicks "Area Admin"
        ↓
Redirected to /admin/login
        ↓
Enter username & password
        ↓
Click "LOGIN"
        ↓
AuthService.login() called
        ↓
Query admin_users table
        ↓
Credentials valid?
    ├─ Yes → Save session → Redirect to /admin
    └─ No → Show error message
```

---

## 🎨 UI Components

### AdminLogin Component

- Clean, modern design
- Password visibility toggle
- Loading state
- Error messages
- Default credentials shown

### Logout Button

- Available in dashboard
- Available in scanner
- Confirmation dialog
- Clears session

---

## 📝 API Reference

### AuthService Methods

```typescript
// Login
login(credentials: LoginCredentials): Promise<AdminUser>

// Logout
logout(): void

// Check authentication
isAuthenticated(): boolean

// Get session
getSession(): AdminUser | null

// Get current admin
getCurrentAdmin(): AdminUser | null
```

### Types

```typescript
interface AdminUser {
  id: number;
  username: string;
  nama_lengkap: string;
  role: string;
  last_login: string | null;
}

interface LoginCredentials {
  username: string;
  password: string;
}
```

---

## ✅ Testing Checklist

- [x] Login with correct credentials
- [x] Login with wrong credentials
- [x] Access admin without login (should redirect)
- [x] Access scanner without login (should redirect)
- [x] Logout functionality
- [x] Session persistence
- [x] Password visibility toggle
- [x] Error messages display
- [x] Last login timestamp updates

---

## 🚀 Future Enhancements

### Planned Features:

1. Password hashing (bcrypt)
2. JWT token authentication
3. Session timeout
4. Remember me functionality
5. Password reset
6. Two-factor authentication (2FA)
7. Admin user management UI
8. Activity logging
9. Role-based permissions
10. Email notifications

---

## 📞 Support

### Need Help?

- Check this documentation
- Verify database setup
- Check browser console for errors
- Verify Supabase connection

### Security Issues?

- Change default password immediately
- Use strong passwords
- Enable HTTPS
- Implement password hashing

---

**The login system is now active and protecting your admin pages!** 🔐✨

---

**Version**: 1.0.0  
**Last Updated**: November 30, 2024  
**Status**: ✅ Active
