-- Simple fix for resource requests
-- This ensures the resource_requests table exists and has proper data

-- Create resource_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.resource_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  expires_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- Enable RLS
ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own requests" ON public.resource_requests;
DROP POLICY IF EXISTS "Users can create requests" ON public.resource_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.resource_requests;
DROP POLICY IF EXISTS "Admins can manage all requests" ON public.resource_requests;

-- Create simple RLS policies
CREATE POLICY "Users can view own requests" ON public.resource_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create requests" ON public.resource_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all requests" ON public.resource_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all requests" ON public.resource_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resource_requests_user_id ON public.resource_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_requests_resource_id ON public.resource_requests(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_requests_status ON public.resource_requests(status);

-- Create a simple view for admin panel (optional)
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
    COALESCE(u.email, 'Unknown user') as user_email,
    COALESCE(u.name, 'Unknown') as user_name,
    COALESCE(r.title, 'Unknown resource') as resource_title,
    COALESCE(r.visibility::TEXT, 'protected') as resource_visibility
FROM public.resource_requests rr
LEFT JOIN public.users u ON rr.user_id = u.id
LEFT JOIN public.resources r ON rr.resource_id = r.id;

-- Grant access to the view
GRANT SELECT ON public.resource_requests_with_details TO authenticated;

-- Check if we have any requests
SELECT COUNT(*) as total_requests FROM public.resource_requests;

-- Show sample data if any exists
SELECT 
    rr.id,
    rr.status,
    rr.created_at,
    u.email as user_email,
    r.title as resource_title
FROM public.resource_requests rr
LEFT JOIN public.users u ON rr.user_id = u.id
LEFT JOIN public.resources r ON rr.resource_id = r.id
ORDER BY rr.created_at DESC
LIMIT 5;
