-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  tags TEXT[],
  author TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create about table
CREATE TABLE IF NOT EXISTS public.about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bio TEXT NOT NULL,
  image_url TEXT,
  contact_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default about data
INSERT INTO public.about (bio, contact_info)
VALUES (
  'Mohamed Elaghoury is an ATP-certified coach and L&D professional specializing in talent development for the MENA region.',
  '{"email": "contact@example.com", "phone": "+1234567890", "linkedin": "linkedin.com/in/example"}'
)
ON CONFLICT DO NOTHING;
