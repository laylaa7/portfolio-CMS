-- Quick fix: Add missing columns to resources table
-- Run this first to fix the 400 error

-- Add missing columns to resources table
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'protected',
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT;

-- Update existing resources to have default visibility
UPDATE public.resources 
SET visibility = 'public' 
WHERE visibility IS NULL;

