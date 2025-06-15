-- Create the entries table
create table public.entries (   
  id uuid primary key default gen_random_uuid(), 
  user_id uuid references auth.users not null, 
  title text not null, 
  content text, 
  image_url text, 
  created_at timestamp with time zone default now() 
);

-- Enable Row Level Security
alter table public.entries enable row level security;

-- Add RLS policy for user access control
create policy "Users can access their own entries" 
on entries for all 
using (auth.uid() = user_id);
