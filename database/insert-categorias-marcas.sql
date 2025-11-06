-- ============================================
-- Datos Iniciales para Categorías y Marcas
-- ============================================

-- Este archivo crea categorías y marcas de ejemplo para el sistema de productos
-- Ejecutar en el SQL Editor de Supabase Dashboard
-- URL: https://supabase.com/dashboard/project/poeakqcynxbrksdvxwmw/sql

-- ============================================
-- 1. CATEGORÍAS
-- ============================================

-- Categorías para Cercos Perimetrales
INSERT INTO categorias (nombre, slug, tipo, descripcion) 
SELECT * FROM (VALUES
  ('Alambres', 'alambres', 'cerco', 'Alambre de púas, liso, galvanizado y alto tensil'),
  ('Postes', 'postes', 'cerco', 'Postes de eucalipto, pino y hierro para cercos'),
  ('Varillas', 'varillas', 'cerco', 'Varillas de hierro para refuerzo de cercos'),
  ('Tranqueras', 'tranqueras-cerco', 'cerco', 'Tranqueras de hierro y madera'),
  ('Accesorios de Cercado', 'accesorios-cercado', 'cerco', 'Torniquetes, tensores, grapas y más'),
  ('Mallas y Tejidos', 'mallas-tejidos', 'cerco', 'Malla olímpica, romboidal, hexagonal y tejido'),
  ('Portones', 'portones', 'cerco', 'Portones de acceso para cercos perimetrales')
) AS v(nombre, slug, tipo, descripcion)
WHERE NOT EXISTS (
  SELECT 1 FROM categorias c 
  WHERE c.slug = v.slug
);

-- Categorías para Artículos Rurales
INSERT INTO categorias (nombre, slug, tipo, descripcion) 
SELECT * FROM (VALUES
  ('Tranqueras', 'tranqueras-rural', 'rural', 'Tranqueras para acceso rural'),
  ('Postes', 'postes-rural', 'rural', 'Postes para alambrados rurales'),
  ('Alambrados', 'alambrados', 'rural', 'Alambres y materiales para alambrados'),
  ('Accesorios', 'accesorios-rural', 'rural', 'Accesorios varios para campo'),
  ('Boyeros eléctricos', 'boyeros-electricos', 'rural', 'Boyeros y electrificadores'),
  ('Mallas', 'mallas-rural', 'rural', 'Mallas para animales y uso rural'),
  ('Herramientas', 'herramientas', 'rural', 'Herramientas para trabajo rural'),
  ('Bebederos', 'bebederos', 'rural', 'Bebederos para ganado')
) AS v(nombre, slug, tipo, descripcion)
WHERE NOT EXISTS (
  SELECT 1 FROM categorias c 
  WHERE c.slug = v.slug
);

-- ============================================
-- 2. MARCAS
-- ============================================

INSERT INTO marcas (nombre, slug, logo_url) 
SELECT * FROM (VALUES
  ('Acindar', 'acindar', NULL),
  ('Belgo', 'belgo', NULL),
  ('Fortel', 'fortel', NULL),
  ('Galvak', 'galvak', NULL),
  ('Rumbo Rural', 'rumbo-rural', NULL),
  ('Metalúrgica San Martín', 'metalurgica-san-martin', NULL),
  ('Alambres y Cercos', 'alambres-cercos', NULL),
  ('Boyero Eléctrico', 'boyero-electrico', NULL),
  ('Tanques Rotoplas', 'tanques-rotoplas', NULL),
  ('Tanques Eternit', 'tanques-eternit', NULL),
  ('Mangueras Tigre', 'mangueras-tigre', NULL),
  ('Herramientas Bahco', 'herramientas-bahco', NULL),
  ('Herramientas Crossmaster', 'herramientas-crossmaster', NULL),
  ('Pulverizadoras Jacto', 'pulverizadoras-jacto', NULL),
  ('Pulverizadoras Matabi', 'pulverizadoras-matabi', NULL)
) AS v(nombre, slug, logo_url)
WHERE NOT EXISTS (
  SELECT 1 FROM marcas m 
  WHERE m.slug = v.slug
);

-- ============================================
-- 3. VERIFICAR DATOS INSERTADOS
-- ============================================

-- Ver todas las categorías creadas
SELECT 
  id,
  nombre,
  tipo,
  descripcion,
  created_at
FROM categorias
ORDER BY tipo, nombre;

-- Ver todas las marcas creadas
SELECT 
  id,
  nombre,
  logo_url,
  created_at
FROM marcas
ORDER BY nombre;

-- ============================================
-- 4. PRODUCTOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Si quieres crear algunos productos de ejemplo, descomenta este bloque:

/*
-- Primero, obtener IDs de categorías y marcas (ejecutar las consultas de arriba)
-- Luego reemplaza los UUIDs con los IDs reales

INSERT INTO productos (
  nombre,
  descripcion,
  precio,
  stock,
  categoria_id,
  marca_id,
  imagen_url,
  activo
) VALUES
(
  'Alambre de Púas Galvanizado 200m',
  'Rollo de alambre de púas galvanizado de alta resistencia. 200 metros. Ideal para cercos perimetrales rurales y urbanos.',
  45000,
  25,
  'ID_CATEGORIA_ALAMBRES',  -- Reemplazar con ID real
  'ID_MARCA_ACINDAR',       -- Reemplazar con ID real
  NULL,
  true
),
(
  'Poste de Eucalipto 2.40m',
  'Poste de eucalipto tratado de 2.40 metros. Diámetro 12-15cm. Ideal para cercos rurales.',
  8500,
  150,
  'ID_CATEGORIA_POSTES',    -- Reemplazar con ID real
  NULL,
  NULL,
  true
),
(
  'Malla Olímpica 2.00m x 25m',
  'Rollo de malla olímpica galvanizada. Altura 2.00m x 25m de largo. Alambre calibre 8.',
  125000,
  12,
  'ID_CATEGORIA_MALLAS',    -- Reemplazar con ID real
  'ID_MARCA_BELGO',         -- Reemplazar con ID real
  NULL,
  true
);
*/

-- ============================================
-- INSTRUCCIONES DE USO
-- ============================================
/*
1. Ve a Supabase Dashboard: https://supabase.com/dashboard/project/poeakqcynxbrksdvxwmw
2. Navega a "SQL Editor" en el menú lateral
3. Crea una nueva consulta
4. Copia y pega este archivo completo
5. Haz click en "Run" para ejecutar

RESULTADO ESPERADO:
- Se crearán 7 categorías para cercos perimetrales
- Se crearán 10 categorías para artículos rurales
- Se crearán 15 marcas populares
- Los selects de verificación mostrarán los datos insertados

VERIFICACIÓN EN LA INTERFAZ:
1. Ve a http://localhost:64179/admin/productos
2. Haz click en "Nuevo Producto"
3. En el campo "Categoría" deberías ver todas las categorías creadas
4. En el campo "Marca" deberías ver todas las marcas creadas

NOTA SOBRE CONFLICTOS:
El script usa "ON CONFLICT DO NOTHING" para evitar duplicados.
Si ya existen categorías o marcas con el mismo nombre, no se insertarán nuevamente.
*/

-- ============================================
-- ESTADÍSTICAS
-- ============================================

-- Contar categorías por tipo
SELECT 
  tipo,
  COUNT(*) as cantidad
FROM categorias
GROUP BY tipo;

-- Total de marcas
SELECT COUNT(*) as total_marcas FROM marcas;

-- Total de productos (si hay)
SELECT COUNT(*) as total_productos FROM productos;
