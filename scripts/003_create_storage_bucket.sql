-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT DO NOTHING;

-- Allow public read access to storage
CREATE POLICY "Allow public read access on portfolio images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated users to upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-images');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-images');
