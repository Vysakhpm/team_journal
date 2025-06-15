-- Verify Supabase setup and diagnose issues

-- 1. Check if we can access auth schema
SELECT 'Auth schema accessible' as status;

-- 2. Check auth settings
SELECT 
  'Checking auth configuration' as step,
  COUNT(*) as user_count
FROM auth.users;

-- 3. Check our entries table
SELECT 
  'Entries table status' as step,
  COUNT(*) as entry_count
FROM public.entries;

-- 4. Check RLS policies
SELECT 
  'RLS Policies' as step,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'entries';

-- 5. Test inserting a sample entry (this will help diagnose RLS issues)
INSERT INTO public.entries (user_id, title, content) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Test Entry', 'This is a test entry to verify database functionality')
ON CONFLICT DO NOTHING;

-- 6. Check if the insert worked
SELECT 
  'Sample data test' as step,
  COUNT(*) as test_entries
FROM public.entries 
WHERE title = 'Test Entry';

-- 7. Final status
SELECT 
  'Setup verification complete' as status,
  'Check results above for any issues' as message;
