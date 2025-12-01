# 🔍 Test Login Issues

## Step 1: Check Browser Console

Open browser console (F12) and look for error messages when you try to login.

Common errors:

- `PGRST116` - No rows returned (wrong credentials or RLS blocking)
- `42501` - Permission denied (RLS policy issue)
- `42P01` - Table doesn't exist
- `42703` - Column doesn't exist

---

## Step 2: Run SQL Tests in Supabase

### Test 1: Check if table exists

```sql
SELECT * FROM admin_users;
```

**Expected**: Should show your admin users

---

### Test 2: Check RLS status

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'admin_users';
```

**Expected**:

- If `rowsecurity = true`, RLS is enabled (need policy)
- If `rowsecurity = false`, RLS is disabled (should work)

---

### Test 3: Test the exact query

```sql
SELECT id, email, role
FROM admin_users
WHERE email = 'adminparkir@gmail.com'
  AND password = 'admin123';
```

**Expected**: Should return 1 row with your admin data

**If no rows**:

- Check email spelling (case-sensitive)
- Check password (case-sensitive)
- Check if data exists

---

### Test 4: Check RLS policies

```sql
SELECT * FROM pg_policies WHERE tablename = 'admin_users';
```

**Expected**: Should show at least one SELECT policy

---

## Step 3: Fix RLS Issues

If RLS is blocking, run this:

```sql
-- Enable RLS if not enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop old policy
DROP POLICY IF EXISTS "Allow read access to admin_users" ON admin_users;

-- Create new policy
CREATE POLICY "Allow read access to admin_users"
  ON admin_users
  FOR SELECT
  USING (true);
```

---

## Step 4: Check Supabase Connection

### Test in browser console:

```javascript
// Open browser console (F12) and run:

// Test connection
const { data, error } = await supabase.from("admin_users").select("*").limit(1);

console.log("Connection test:", { data, error });

// Test login query
const { data: loginData, error: loginError } = await supabase
  .from("admin_users")
  .select("id, email, role")
  .eq("email", "adminparkir@gmail.com")
  .eq("password", "admin123")
  .single();

console.log("Login test:", { loginData, loginError });
```

---

## Step 5: Common Issues & Solutions

### Issue 1: "Email atau password salah" but credentials are correct

**Cause**: RLS is blocking the query

**Solution**: Run `FIX_LOGIN_RLS.sql`

---

### Issue 2: Column doesn't exist error

**Cause**: Table structure doesn't match code

**Solution**: Check your table columns:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'admin_users';
```

Required columns:

- `email` (text)
- `password` (text)
- `role` (text)

---

### Issue 3: Function doesn't exist

**Cause**: `update_last_login` function not created

**Solution**: It's optional, the code will work without it

---

### Issue 4: CORS error

**Cause**: Supabase URL or API key wrong

**Solution**: Check `.env` file:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Step 6: Debug Mode

The auth service now has console.log statements. Check browser console for:

```
Attempting login with email: adminparkir@gmail.com
Login query result: { data: {...}, error: null }
```

or

```
Attempting login with email: adminparkir@gmail.com
Login query result: { data: null, error: {...} }
Login error: {...}
```

---

## Quick Fix Checklist

- [ ] Table `admin_users` exists
- [ ] Email and password are correct
- [ ] RLS policy allows SELECT
- [ ] Supabase connection works
- [ ] Browser console shows no errors
- [ ] `.env` file has correct credentials

---

## Still Not Working?

1. **Check browser console** for exact error
2. **Run SQL tests** in Supabase
3. **Run FIX_LOGIN_RLS.sql**
4. **Share the error message** from console

---

**Most common fix**: Run `FIX_LOGIN_RLS.sql` in Supabase SQL Editor!
