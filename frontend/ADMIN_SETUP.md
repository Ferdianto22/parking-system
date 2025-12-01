# 🔐 Admin User Setup Guide

## Adding Admin Users to Your System

Since you already have admin credentials in your Supabase database, the login system will use those credentials directly.

---

## ✅ Your Existing Credentials

The login system will authenticate against the `admin_users` table in your Supabase database.

**Use the credentials you've already created in Supabase.**

---

## 📝 How to Add New Admin Users

### Method 1: Using Supabase Table Editor (Easiest)

1. **Open Supabase Dashboard**

   - Go to your project
   - Click "Table Editor" in sidebar

2. **Select admin_users table**

3. **Click "Insert row"**

4. **Fill in the fields**:

   - `username`: Your desired username
   - `password`: Your password (plain text for now)
   - `nama_lengkap`: Full name
   - `role`: Choose `admin` or `superadmin`
   - `is_active`: Check the box (true)

5. **Click "Save"**

---

### Method 2: Using SQL Editor

1. **Open SQL Editor** in Supabase

2. **Run this SQL**:

```sql
-- Add a new admin user
INSERT INTO admin_users (username, password, nama_lengkap, role)
VALUES ('your_username', 'your_password', 'Your Full Name', 'superadmin');

-- Add multiple users at once
INSERT INTO admin_users (username, password, nama_lengkap, role) VALUES
  ('admin1', 'password123', 'Admin One', 'admin'),
  ('admin2', 'password456', 'Admin Two', 'admin'),
  ('operator1', 'operator123', 'Operator One', 'admin');
```

---

## 👥 User Roles

### Superadmin

- Full access to all features
- Recommended for main administrator

### Admin

- Access to dashboard and scanner
- Recommended for operators/staff

---

## 🔍 View Your Existing Users

```sql
-- See all admin users
SELECT id, username, nama_lengkap, role, is_active, last_login
FROM admin_users
ORDER BY created_at DESC;
```

---

## ✏️ Update Existing User

### Change Password:

```sql
UPDATE admin_users
SET password = 'new_password'
WHERE username = 'your_username';
```

### Change Name:

```sql
UPDATE admin_users
SET nama_lengkap = 'New Full Name'
WHERE username = 'your_username';
```

### Change Role:

```sql
UPDATE admin_users
SET role = 'superadmin'
WHERE username = 'your_username';
```

### Deactivate User:

```sql
UPDATE admin_users
SET is_active = false
WHERE username = 'your_username';
```

### Reactivate User:

```sql
UPDATE admin_users
SET is_active = true
WHERE username = 'your_username';
```

---

## 🗑️ Delete User

```sql
DELETE FROM admin_users
WHERE username = 'username_to_delete';
```

---

## 🔐 Security Recommendations

### For Production:

1. **Use Strong Passwords**

   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - Avoid common words

2. **Hash Passwords** (Future Enhancement)

   ```typescript
   // Use bcrypt or similar
   import bcrypt from "bcrypt";
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

3. **Regular Password Changes**

   - Change passwords every 90 days
   - Don't reuse old passwords

4. **Limit Admin Accounts**
   - Only create accounts for authorized personnel
   - Deactivate unused accounts

---

## 🧪 Testing Your Login

1. **Start your app**:

   ```bash
   npm run dev
   ```

2. **Go to login page**:

   ```
   http://localhost:5173/#/admin/login
   ```

3. **Enter your credentials**:

   - Username: (your username from Supabase)
   - Password: (your password from Supabase)

4. **Click LOGIN**

5. **Should redirect to dashboard** ✅

---

## 🐛 Troubleshooting

### Problem: "Username atau password salah"

**Check**:

1. Username is correct (case-sensitive)
2. Password is correct
3. User exists in database
4. User is active (is_active = true)

**Debug**:

```sql
-- Check if user exists
SELECT * FROM admin_users WHERE username = 'your_username';

-- Check if user is active
SELECT * FROM admin_users
WHERE username = 'your_username' AND is_active = true;
```

---

### Problem: Can't see admin_users table

**Solution**:

1. Make sure you ran the SQL setup
2. Check if table exists:
   ```sql
   SELECT * FROM admin_users;
   ```
3. If not, run the setup SQL from `supabase_setup.sql`

---

## 📊 Database Schema

```sql
CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  nama_lengkap TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);
```

---

## ✅ Quick Checklist

- [ ] admin_users table created in Supabase
- [ ] At least one admin user added
- [ ] User is active (is_active = true)
- [ ] Can login with credentials
- [ ] Can access dashboard
- [ ] Can logout

---

**Your admin users are now ready to use!** 🎉

Use the credentials you've created in Supabase to login to the admin dashboard.
