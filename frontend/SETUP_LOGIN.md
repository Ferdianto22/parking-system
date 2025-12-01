# 🚀 Quick Setup Guide - Admin Login

## Step-by-Step Setup

### Step 1: Run SQL in Supabase

1. **Open Supabase Dashboard**

   - Go to your project
   - Click "SQL Editor" in sidebar

2. **Run the SQL**
   - Copy the SQL from `supabase_setup.sql`
   - Or run this:

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

3. **Click "Run"**
   - Wait for success message
   - Verify table created

### Step 2: Verify Database

1. **Check Table**

   ```sql
   SELECT * FROM admin_users;
   ```

2. **Should see**:
   ```
   id | username | password  | nama_lengkap   | role        | is_active
   1  | admin    | admin123  | Administrator  | superadmin  | true
   ```

### Step 3: Test Login

1. **Start your app**

   ```bash
   npm run dev
   ```

2. **Open browser**

   ```
   http://localhost:5173
   ```

3. **Click "Area Admin →"**

4. **Login with**:

   - Username: `admin`
   - Password: `admin123`

5. **Should redirect to dashboard** ✅

---

## ✅ Verification Checklist

- [ ] SQL executed successfully
- [ ] admin_users table created
- [ ] Default admin user inserted
- [ ] Can access login page (#/admin/login)
- [ ] Can login with admin/admin123
- [ ] Redirected to dashboard after login
- [ ] Can access scanner page
- [ ] Logout button works
- [ ] Redirected to login when accessing admin without auth

---

## 🔧 Troubleshooting

### Issue: SQL Error

**Error**: `relation "admin_users" already exists`

**Solution**: Table already exists, skip to Step 2

---

### Issue: Can't login

**Check**:

1. Supabase connection working?
2. Table created?
3. Default user exists?
4. Correct credentials?

**Debug**:

```sql
-- Check if user exists
SELECT * FROM admin_users WHERE username = 'admin';

-- Check if active
SELECT * FROM admin_users WHERE username = 'admin' AND is_active = true;
```

---

### Issue: Redirected to login after successful login

**Check**:

1. Browser console for errors
2. localStorage enabled?
3. Privacy mode disabled?

**Debug**:

```javascript
// In browser console
localStorage.getItem("admin_session");
```

---

## 🎯 Quick Test

### Test Login Flow:

```bash
# 1. Open homepage
http://localhost:5173

# 2. Click "Area Admin →"
# Should redirect to: #/admin/login

# 3. Enter credentials
Username: admin
Password: admin123

# 4. Click LOGIN
# Should redirect to: #/admin

# 5. Click Logout
# Should redirect to: #/

# 6. Try to access #/admin directly
# Should redirect to: #/admin/login
```

---

## 📝 Add More Admin Users

```sql
-- Add operator
INSERT INTO admin_users (username, password, nama_lengkap, role)
VALUES ('operator1', 'operator123', 'Operator 1', 'admin');

-- Add another admin
INSERT INTO admin_users (username, password, nama_lengkap, role)
VALUES ('admin2', 'admin456', 'Admin 2', 'admin');
```

---

## 🔐 Change Default Password

```sql
-- Change admin password
UPDATE admin_users
SET password = 'your_new_secure_password'
WHERE username = 'admin';
```

⚠️ **IMPORTANT**: Do this before production!

---

## ✅ Setup Complete!

Your admin login system is now ready to use!

**Default Credentials**:

- Username: `admin`
- Password: `admin123`

**Remember to**:

- Change default password
- Add more admin users as needed
- Test all functionality

---

**Need more help?** Check `LOGIN_SYSTEM.md` for detailed documentation.
