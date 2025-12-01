-- Create the update_last_login function
-- Run this in Supabase SQL Editor

-- First, check if last_login column exists in your table
-- Run this to see your table structure:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admin_users';

-- If you DON'T have a last_login column, add it first:
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- Now create the function
CREATE OR REPLACE FUNCTION update_last_login(p_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE admin_users 
  SET last_login = NOW() 
  WHERE email = p_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the function
SELECT update_last_login('adminparkir@gmail.com');

-- Verify it worked
SELECT email, last_login FROM admin_users WHERE email = 'adminparkir@gmail.com';

-- Done! The function is now created.
