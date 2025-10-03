-- Test script to check and fix resources table
-- Run this in Supabase SQL Editor

-- 1. Check current columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'resources' AND table_schema = 'public' 
ORDER BY ordinal_position;

-- 2. Add missing columns one by one (run each separately)
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS visibility TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS file_size BIGINT;

-- 3. Set default values
UPDATE public.resources SET visibility = 'public' WHERE visibility IS NULL;

-- 4. Verify columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'resources' AND table_schema = 'public' 
ORDER BY ordinal_position;
