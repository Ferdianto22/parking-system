-- Fix Login Issues - Run this in Supabase SQL Editor

-- 1. Check if RLS is enabled on admin_users
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users';

-- 2. If RLS is enabled, create a policy to allow SELECT
-- Drop existing policy if any
DROP POLICY IF EXISTS "Allow read access to admin_users" ON admin_users;

-- Create new policy that allows anyone to read (for authentication)
CREATE POLICY "Allow read access to admin_users" 
  ON admin_users 
  FOR SELECT 
  USING (true);

-- 3. Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'admin_users';

-- 4. Test the query directly
SELECT id, email, role 
FROM admin_users 
WHERE email = 'adminparkir@gmail.com' 
  AND password = 'admin123';

-- If the above query returns a row, the login should work!

-- 5. Optional: Create or replace the update_last_login function
CREATE OR REPLACE FUNCTION update_last_login(p_email TEXT)
RETURNS void AS $$
BEGIN
  -- Check if last_login column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' AND column_name = 'last_login'
  ) THEN
    UPDATE admin_users 
    SET last_login = NOW() 
    WHERE email = p_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Done! Try logging in again.
