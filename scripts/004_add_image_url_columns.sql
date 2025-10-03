-- Add image_url column to blogs table
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add image_url column to resources table
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS image_url TEXT;
