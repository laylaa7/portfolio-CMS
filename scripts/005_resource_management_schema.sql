-- Resource Management System Schema
-- This script creates the complete schema for public/protected resource management

-- Create ENUM types
CREATE TYPE resource_visibility AS ENUM ('public', 'protected');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'denied');
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Update resources table to support visibility modes
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS visibility resource_visibility DEFAULT 'protected',
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT;

-- Create resource_requests table
CREATE TABLE IF NOT EXISTS public.resource_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  status request_status DEFAULT 'pending',
  expires_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- Create users table for role management (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_resource_requests_user_id ON public.resource_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_resource_requests_resource_id ON public.resource_requests(resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_requests_status ON public.resource_requests(status);
CREATE INDEX IF NOT EXISTS idx_resource_requests_expires_at ON public.resource_requests(expires_at);
CREATE INDEX IF NOT EXISTS idx_resources_visibility ON public.resources(visibility);

-- Enable RLS on all tables
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for resources table
-- Public resources: anyone can read
CREATE POLICY "Public resources are viewable by everyone" 
  ON public.resources FOR SELECT 
  USING (visibility = 'public');

-- Protected resources: only show basic info to authenticated users
CREATE POLICY "Protected resources show basic info to authenticated users" 
  ON public.resources FOR SELECT 
  USING (
    visibility = 'protected' AND 
    auth.role() = 'authenticated'
  );

-- Full resource access: only for approved users or admins
CREATE POLICY "Full resource access for approved users" 
  ON public.resources FOR SELECT 
  USING (
    visibility = 'protected' AND 
    auth.role() = 'authenticated' AND
    (
      EXISTS (
        SELECT 1 FROM public.resource_requests 
        WHERE resource_requests.resource_id = resources.id 
        AND resource_requests.user_id = auth.uid()
        AND resource_requests.status = 'approved'
        AND resource_requests.expires_at > NOW()
      ) OR
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role = 'admin'
      )
    )
  );

-- Admin can do everything with resources
CREATE POLICY "Admins can manage all resources" 
  ON public.resources FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for resource_requests table
-- Users can view their own requests
CREATE POLICY "Users can view their own requests" 
  ON public.resource_requests FOR SELECT 
  USING (user_id = auth.uid());

-- Users can create requests
CREATE POLICY "Users can create resource requests" 
  ON public.resource_requests FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Users can update their own pending requests
CREATE POLICY "Users can update their own pending requests" 
  ON public.resource_requests FOR UPDATE 
  USING (user_id = auth.uid() AND status = 'pending');

-- Admins can manage all requests
CREATE POLICY "Admins can manage all requests" 
  ON public.resource_requests FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for users table
-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (id = auth.uid());

-- Users can update their own profile (except role)
CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (id = auth.uid());

-- Admins can view all users
CREATE POLICY "Admins can view all users" 
  ON public.users FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to clean up expired requests
CREATE OR REPLACE FUNCTION public.cleanup_expired_requests()
RETURNS void AS $$
BEGIN
  UPDATE public.resource_requests 
  SET status = 'denied' 
  WHERE status = 'approved' 
  AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role FROM public.users 
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

