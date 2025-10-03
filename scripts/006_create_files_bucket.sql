-- Create storage bucket for resource files
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-files', 'portfolio-files', false)
ON CONFLICT DO NOTHING;

-- Allow public read access to public files only
CREATE POLICY "Allow public read access to public resource files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'portfolio-files' AND
    EXISTS (
      SELECT 1 FROM public.resources 
      WHERE resources.file_url LIKE '%' || name || '%'
      AND resources.visibility = 'public'
    )
  );

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-files');

-- Allow authenticated users to delete files
CREATE POLICY "Allow authenticated users to delete files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-files');

-- Allow signed URL access for protected files (handled by RLS on resources table)
CREATE POLICY "Allow signed URL access for protected files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'portfolio-files' AND
    EXISTS (
      SELECT 1 FROM public.resources 
      WHERE resources.file_url LIKE '%' || name || '%'
      AND (
        resources.visibility = 'public' OR
        (
          resources.visibility = 'protected' AND
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
        )
      )
    )
  );

