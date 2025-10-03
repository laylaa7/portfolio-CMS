-- Add tools column to events table
-- This column will store an array of tools/resources/tags relevant to each event

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS tools text[];

-- Add a comment to describe the column
COMMENT ON COLUMN public.events.tools IS 'Array of tools, resources, or tags relevant to this event';

-- Example of how to insert events with tools:
-- INSERT INTO public.events (title, description, date, location, tools) VALUES 
-- ('ATD Certification Workshop', 'Learn the fundamentals of L&D', '2024-02-15 09:00:00', 'Virtual Event', ARRAY['ATD Framework', 'Assessment Tools', 'Learning Design', 'Workshop Materials']);

-- Example of how to update existing events with tools:
-- UPDATE public.events SET tools = ARRAY['Networking', 'Panel Discussion', 'Q&A Session', 'Resource Sharing'] WHERE title = 'L&D Networking Event';
