-- Create test users manually (run this if auth still doesn't work)

-- First, let's check if we can insert test data
INSERT INTO public.entries (user_id, title, content, created_at) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Test Entry 1', 'This is a test entry to verify the database is working.', NOW()),
  ('00000000-0000-0000-0000-000000000001', 'Welcome to Your Journal', 'Start writing your thoughts and memories here!', NOW() - INTERVAL '1 day');

-- Check if entries were created
SELECT * FROM public.entries;

-- Also check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'entries';
