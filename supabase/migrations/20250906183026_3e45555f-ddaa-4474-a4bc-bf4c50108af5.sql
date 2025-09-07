-- Verificar políticas existentes no storage
SELECT * FROM storage.objects;

-- Criar políticas para permitir uploads nos buckets existentes
CREATE POLICY "Allow public uploads to profiles bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profiles');

CREATE POLICY "Allow public uploads to videos bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Allow public access to profiles bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profiles');

CREATE POLICY "Allow public access to videos bucket" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'videos');

CREATE POLICY "Allow public updates to profiles bucket" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profiles');

CREATE POLICY "Allow public updates to videos bucket" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'videos');

CREATE POLICY "Allow public deletes from profiles bucket" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profiles');

CREATE POLICY "Allow public deletes from videos bucket" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'videos');