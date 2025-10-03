-- Create event_registrations table
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public to insert registrations
CREATE POLICY "Anyone can register for events" ON public.event_registrations
  FOR INSERT WITH CHECK (true);

-- Allow admins to view all registrations
CREATE POLICY "Admins can view all registrations" ON public.event_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON public.event_registrations(email);

-- Add comment
COMMENT ON TABLE public.event_registrations IS 'Stores event registration data from public users';
