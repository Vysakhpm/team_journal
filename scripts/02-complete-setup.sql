-- Complete Supabase setup script

-- 1. Ensure RLS is enabled on entries table
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Users can access their own entries" ON public.entries;

-- 3. Create comprehensive RLS policy
CREATE POLICY "Users can access their own entries" 
ON public.entries 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Grant necessary permissions
GRANT ALL ON public.entries TO authenticated;
GRANT ALL ON public.entries TO service_role;

-- 5. Create a function to get current user entries (optional, for debugging)
CREATE OR REPLACE FUNCTION get_user_entries()
RETURNS TABLE (
  id uuid,
  title text,
  content text,
  image_url text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id, title, content, image_url, created_at
  FROM public.entries
  WHERE user_id = auth.uid()
  ORDER BY created_at DESC;
$$;

-- 6. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_user_entries() TO authenticated;
