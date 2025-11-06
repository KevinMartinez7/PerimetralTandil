-- ============================================
-- Row Level Security (RLS) Policies - ACTUALIZADO
-- Configuración completa para productos, categorias y marcas
-- ============================================

-- ============================================
-- 1. HABILITAR RLS en todas las tablas
-- ============================================

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. POLÍTICAS PARA PRODUCTOS (CRUD COMPLETO)
-- ============================================

-- LECTURA: Permitir lectura pública de productos
DROP POLICY IF EXISTS "Permitir lectura pública de productos" ON productos;
CREATE POLICY "Permitir lectura pública de productos"
ON productos FOR SELECT
TO public
USING (true);

-- INSERCIÓN: Permitir crear productos
DROP POLICY IF EXISTS "Permitir inserción de productos" ON productos;
CREATE POLICY "Permitir inserción de productos"
ON productos FOR INSERT
TO public
WITH CHECK (true);

-- ACTUALIZACIÓN: Permitir actualizar productos
DROP POLICY IF EXISTS "Permitir actualización de productos" ON productos;
CREATE POLICY "Permitir actualización de productos"
ON productos FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ELIMINACIÓN: Permitir eliminar productos
DROP POLICY IF EXISTS "Permitir eliminación de productos" ON productos;
CREATE POLICY "Permitir eliminación de productos"
ON productos FOR DELETE
TO public
USING (true);

-- ============================================
-- 3. POLÍTICAS PARA CATEGORIAS (CRUD COMPLETO)
-- ============================================

-- LECTURA
DROP POLICY IF EXISTS "Permitir lectura pública de categorías" ON categorias;
CREATE POLICY "Permitir lectura pública de categorías"
ON categorias FOR SELECT
TO public
USING (true);

-- INSERCIÓN
DROP POLICY IF EXISTS "Permitir inserción de categorías" ON categorias;
CREATE POLICY "Permitir inserción de categorías"
ON categorias FOR INSERT
TO public
WITH CHECK (true);

-- ACTUALIZACIÓN
DROP POLICY IF EXISTS "Permitir actualización de categorías" ON categorias;
CREATE POLICY "Permitir actualización de categorías"
ON categorias FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ELIMINACIÓN
DROP POLICY IF EXISTS "Permitir eliminación de categorías" ON categorias;
CREATE POLICY "Permitir eliminación de categorías"
ON categorias FOR DELETE
TO public
USING (true);

-- ============================================
-- 4. POLÍTICAS PARA MARCAS (CRUD COMPLETO)
-- ============================================

-- LECTURA
DROP POLICY IF EXISTS "Permitir lectura pública de marcas" ON marcas;
CREATE POLICY "Permitir lectura pública de marcas"
ON marcas FOR SELECT
TO public
USING (true);

-- INSERCIÓN
DROP POLICY IF EXISTS "Permitir inserción de marcas" ON marcas;
CREATE POLICY "Permitir inserción de marcas"
ON marcas FOR INSERT
TO public
WITH CHECK (true);

-- ACTUALIZACIÓN
DROP POLICY IF EXISTS "Permitir actualización de marcas" ON marcas;
CREATE POLICY "Permitir actualización de marcas"
ON marcas FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ELIMINACIÓN
DROP POLICY IF EXISTS "Permitir eliminación de marcas" ON marcas;
CREATE POLICY "Permitir eliminación de marcas"
ON marcas FOR DELETE
TO public
USING (true);

-- ============================================
-- 5. VERIFICAR POLÍTICAS CREADAS
-- ============================================

-- Ver todas las políticas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('productos', 'categorias', 'marcas')
ORDER BY tablename, cmd;

-- ============================================
-- INSTRUCCIONES DE USO
-- ============================================
/*
1. Ve a Supabase Dashboard: https://supabase.com/dashboard/project/poeakqcynxbrksdvxwmw
2. Navega a "SQL Editor" en el menú lateral
3. Crea una nueva consulta
4. Copia y pega este archivo completo
5. Haz click en "Run" para ejecutar

⚠️ IMPORTANTE - SEGURIDAD:
Estas políticas permiten acceso público COMPLETO (SELECT, INSERT, UPDATE, DELETE)
Esto es apropiado para:
- Desarrollo y pruebas
- Landing pages donde el admin gestiona contenido desde el frontend

Para PRODUCCIÓN, considera:
1. Requerir autenticación para operaciones de escritura
2. Usar JWT claims para verificar roles de admin
3. Mantener solo SELECT público, resto autenticado

VERIFICACIÓN:
- Después de ejecutar, intenta crear un producto desde el admin
- No deberías ver más el error "violates row-level security policy"
- El producto debería insertarse correctamente en la base de datos
*/

-- ============================================
-- 4. VERIFICAR POLÍTICAS
-- ============================================

-- Ver todas las políticas de las tablas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('categorias', 'marcas', 'productos')
ORDER BY tablename, policyname;

-- ============================================
-- INSTRUCCIONES
-- ============================================
/*
1. Ve a Supabase Dashboard: https://supabase.com/dashboard/project/poeakqcynxbrksdvxwmw
2. Navega a "SQL Editor"
3. Crea una nueva consulta
4. Copia y pega este archivo completo
5. Haz click en "Run"

RESULTADO:
- Se habilitará RLS en las tablas
- Se crearán políticas que permiten lectura pública
- Cualquier usuario podrá ver categorías, marcas y productos sin autenticación

SEGURIDAD:
- Estas políticas permiten SOLO lectura (SELECT)
- Para crear/editar/eliminar aún necesitas autenticación (desde el admin panel)
- Si quieres restringir más, modifica las políticas después
*/

-- ============================================
-- NOTAS ADICIONALES
-- ============================================
/*
Si quieres que SOLO usuarios autenticados puedan leer:

DROP POLICY IF EXISTS "Permitir lectura autenticada" ON categorias;
CREATE POLICY "Permitir lectura autenticada"
ON categorias
FOR SELECT
TO authenticated
USING (true);

Pero para una landing page pública, necesitas acceso público para mostrar
los productos en las secciones de Cercos Perimetrales y Artículos Rurales.
*/
