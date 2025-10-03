-- Add tools column to services table
-- This column will store an array of tools/technologies used in each service

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tools text[];

-- Add a comment to describe the column
COMMENT ON COLUMN public.services.tools IS 'Array of tools, technologies, or methodologies used in this service';

-- Example of how to insert services with tools:
-- INSERT INTO public.services (title, description, tools) VALUES 
-- ('ATD Certification Bootcamp', 'Structured preparation program', ARRAY['ATD Framework', 'Assessment Tools', 'Study Guides', 'Practice Exams']);

-- Example of how to update existing services with tools:
-- UPDATE public.services SET tools = ARRAY['Coaching Framework', 'Goal Setting Tools', 'Assessment Methods'] WHERE title = 'Career Coaching';
