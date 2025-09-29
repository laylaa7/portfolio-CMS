-- Enable Row Level Security on all tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can view)
CREATE POLICY "Allow public read access on services"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on events"
  ON public.events FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on blogs"
  ON public.blogs FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on resources"
  ON public.resources FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on about"
  ON public.about FOR SELECT
  USING (true);

-- Admin-only write access (authenticated users can insert/update/delete)
-- Note: In production, you'd want to add a role check here
CREATE POLICY "Allow authenticated users to insert services"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update services"
  ON public.services FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete services"
  ON public.services FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert blogs"
  ON public.blogs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update blogs"
  ON public.blogs FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete blogs"
  ON public.blogs FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert resources"
  ON public.resources FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update resources"
  ON public.resources FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete resources"
  ON public.resources FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update about"
  ON public.about FOR UPDATE
  TO authenticated
  USING (true);
