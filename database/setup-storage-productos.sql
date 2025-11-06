-- ============================================
-- Supabase Storage Configuration
-- Bucket para imágenes de productos
-- ============================================

-- Este archivo debe ejecutarse en el SQL Editor de Supabase Dashboard
-- URL: https://supabase.com/dashboard/project/poeakqcynxbrksdvxwmw/sql

-- ============================================
-- 1. Crear el bucket para imágenes de productos
-- ============================================

-- Primero, insertar el bucket en la tabla storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'productos-imagenes',
  'productos-imagenes',
  true,  -- Bucket público para que las imágenes sean accesibles
  5242880,  -- 5MB en bytes (5 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. Políticas de seguridad (RLS)
-- ============================================

-- Política 1: Permitir lectura pública de todas las imágenes
-- Esto permite que cualquier usuario vea las imágenes de productos
CREATE POLICY "Public Access - Read"
ON storage.objects FOR SELECT
USING (bucket_id = 'productos-imagenes');

-- Política 2: Permitir subida de imágenes (sin autenticación por ahora)
-- En producción, deberías requerir autenticación
CREATE POLICY "Public Access - Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'productos-imagenes');

-- Política 3: Permitir actualización de imágenes
CREATE POLICY "Public Access - Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'productos-imagenes')
WITH CHECK (bucket_id = 'productos-imagenes');

-- Política 4: Permitir eliminación de imágenes
CREATE POLICY "Public Access - Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'productos-imagenes');

-- ============================================
-- 3. Verificar configuración
-- ============================================

-- Verificar que el bucket fue creado correctamente
SELECT 
  id, 
  name, 
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'productos-imagenes';

-- Verificar políticas creadas
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
AND policyname LIKE '%productos-imagenes%'
OR policyname LIKE '%Public Access%';

-- ============================================
-- INSTRUCCIONES DE USO
-- ============================================
/*
1. Ve a Supabase Dashboard: https://supabase.com/dashboard/project/poeakqcynxbrksdvxwmw
2. Navega a "SQL Editor" en el menú lateral
3. Crea una nueva consulta
4. Copia y pega este archivo completo
5. Haz click en "Run" para ejecutar

ALTERNATIVA - Crear bucket manualmente:
1. Ve a "Storage" en el dashboard
2. Haz click en "New bucket"
3. Nombre: productos-imagenes
4. Public bucket: YES
5. File size limit: 5MB
6. Allowed MIME types: image/jpeg, image/jpg, image/png, image/webp, image/gif
7. Luego ejecuta solo las políticas (sección 2) en el SQL Editor

VERIFICACIÓN:
- El bucket debería aparecer en Storage > Buckets
- Deberías poder subir una imagen desde el dashboard
- La URL pública de la imagen debería ser accesible sin autenticación
*/

-- ============================================
-- NOTAS DE SEGURIDAD
-- ============================================
/*
⚠️ IMPORTANTE: Estas políticas permiten acceso público sin autenticación.
Esto es adecuado para una landing page donde los usuarios necesitan ver
las imágenes de productos sin iniciar sesión.

Para mayor seguridad en producción, considera:
1. Agregar políticas basadas en autenticación para upload/delete
2. Implementar rate limiting
3. Agregar validación de tipos de archivo en el lado del servidor
4. Implementar escaneo de malware para archivos subidos

Ejemplo de política con autenticación:
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'productos-imagenes');
*/
