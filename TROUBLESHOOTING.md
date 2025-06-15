# Authentication Troubleshooting Guide

## Quick Fixes

### 1. Check Supabase Configuration

**In Supabase Dashboard:**
- Go to Settings → API
- Verify your Project URL and anon key are correct
- Copy them to your `.env.local` file

### 2. Disable Email Confirmation

**In Supabase Dashboard:**
- Go to Authentication → Settings
- Under "User Signups", turn OFF "Enable email confirmations"
- Save settings

### 3. Check RLS Policies

Run this in Supabase SQL Editor:
\`\`\`sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'entries';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'entries';
\`\`\`

### 4. Test Database Connection

Use the "Test Database Connection" button in the debug panel on the auth page.

### 5. Use Demo Mode

If nothing else works, click "Enter Demo Mode" to test the application features.

## Common Issues

### "Invalid API key"
- Check your environment variables
- Make sure you're using the anon key, not the service role key

### "Row Level Security policy violation"
- Run the setup scripts in order
- Check that auth.uid() is working

### "User already registered"
- The app should handle this automatically
- Try the "Try Direct Sign In" button

### "Network error"
- Check your internet connection
- Verify Supabase project is active

## Environment Variables

Make sure your `.env.local` looks like this:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
\`\`\`

## Still Having Issues?

1. Check the browser console for errors
2. Use the debug information panel
3. Try demo mode to test features
4. Verify all SQL scripts have been run
\`\`\`
