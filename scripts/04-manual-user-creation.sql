-- Manual user creation for testing
-- This creates a user directly in the auth.users table (for debugging only)

-- First, let's check what's in the auth schema
SELECT table_name FROM information_schema.tables WHERE table_schema = 'auth';

-- Check if we have any users
SELECT id, email, created_at, email_confirmed_at FROM auth.users LIMIT 5;

-- Check our entries table
SELECT * FROM public.entries LIMIT 5;

-- Let's also verify our RLS policies are working
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'entries';

-- Check if RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'entries';
