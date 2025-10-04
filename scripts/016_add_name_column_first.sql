-- Add name column to users table first
-- This fixes the "column name does not exist" error

-- Add the name column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;

-- Update existing users with names from auth metadata
UPDATE public.users 
SET name = COALESCE(
    (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE auth.users.id = public.users.id),
    'No name'
)
WHERE name IS NULL OR name = '';

-- Now sync any missing users from auth.users
INSERT INTO public.users (id, email, name, role, created_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', 'No name'),
    'user',
    au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Verify the changes
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    u.created_at
FROM public.users u
ORDER BY u.created_at DESC;
