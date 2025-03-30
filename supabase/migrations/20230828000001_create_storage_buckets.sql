
-- Create a bucket for medical files
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-files', 'Medical Files', FALSE);

-- Set up access policies for the medical-files bucket
-- Allow authenticated users to insert their own files
CREATE POLICY "Users can upload their own medical files" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'medical-files' AND (LOWER(storage.foldername(name)) = LOWER(auth.uid()::text) OR LOWER(storage.foldername(name)) = 'prescriptions'));

-- Allow authenticated users to select their own files
CREATE POLICY "Users can view their own medical files" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'medical-files' AND LOWER(storage.foldername(name)) = LOWER(auth.uid()::text));

-- Allow doctors to view prescriptions
CREATE POLICY "Doctors can view prescriptions" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (
  bucket_id = 'medical-files' AND 
  LOWER(storage.foldername(name)) = 'prescriptions' AND 
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() AND (raw_user_meta_data->>'role')::text = 'doctor'
  )
);
