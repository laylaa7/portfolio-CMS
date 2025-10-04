-- Fix Users and Resource Requests Issues
-- This script addresses two problems:
-- 1. Users not showing in admin panel
-- 2. Resource requests not showing user emails

-- First, add the name column to users table if it doesn't exist
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

-- Update existing users with names from auth metadata
UPDATE public.users 
SET name = COALESCE(
    (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE auth.users.id = public.users.id),
    'No name'
)
WHERE name IS NULL OR name = '';

-- Fix the resource_requests table to properly join with users
-- First, let's make sure we can see user emails in requests
-- We'll create a view that properly joins the tables
CREATE OR REPLACE VIEW public.resource_requests_with_details AS
SELECT 
    rr.id,
    rr.user_id,
    rr.resource_id,
    rr.status,
    rr.expires_at,
    rr.admin_notes,
    rr.created_at,
    rr.updated_at,
    u.email as user_email,
    u.name as user_name,
    r.title as resource_title,
    r.visibility as resource_visibility
FROM public.resource_requests rr
LEFT JOIN public.users u ON rr.user_id = u.id
LEFT JOIN public.resources r ON rr.resource_id = r.id;

-- Grant access to the view
GRANT SELECT ON public.resource_requests_with_details TO authenticated;

-- Fix RLS policies for users table to allow admin access
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Add a policy to allow inserts for new users (needed for the trigger)
DROP POLICY IF EXISTS "Allow public insert for new user profiles" ON public.users;
CREATE POLICY "Allow public insert for new user profiles" ON public.users
  FOR INSERT WITH CHECK (true);

-- Re-enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a function to get user details for requests
CREATE OR REPLACE FUNCTION public.get_request_user_details(request_user_id UUID)
RETURNS TABLE(email TEXT, name TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT u.email, u.name
  FROM public.users u
  WHERE u.id = request_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get resource details for requests
CREATE OR REPLACE FUNCTION public.get_request_resource_details(request_resource_id UUID)
RETURNS TABLE(title TEXT, visibility TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT r.title, r.visibility::TEXT
  FROM public.resources r
  WHERE r.id = request_resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add some sample data if no users exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users LIMIT 1) THEN
    -- Insert a sample admin user (you'll need to replace with actual user ID)
    -- This is just to ensure there's at least one user for testing
    INSERT INTO public.users (id, email, name, role, created_at)
    VALUES (
      gen_random_uuid(),
      'admin@example.com',
      'Admin User',
      'admin',
      NOW()
    );
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON VIEW public.resource_requests_with_details IS 'View that joins resource requests with user and resource details for admin panel';
COMMENT ON FUNCTION public.get_request_user_details IS 'Function to get user details for resource requests';
COMMENT ON FUNCTION public.get_request_resource_details IS 'Function to get resource details for resource requests';
