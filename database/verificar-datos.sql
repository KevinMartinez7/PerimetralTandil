-- Script rápido para verificar datos en las tablas

-- Ver todas las categorías
SELECT 
  id,
  nombre,
  slug,
  tipo,
  descripcion
FROM categorias
ORDER BY tipo, nombre;

-- Ver todas las marcas
SELECT 
  id,
  nombre,
  slug
FROM marcas
ORDER BY nombre;

-- Contar registros
SELECT 
  'Categorías' as tabla,
  COUNT(*) as total
FROM categorias
UNION ALL
SELECT 
  'Marcas' as tabla,
  COUNT(*) as total
FROM marcas
UNION ALL
SELECT 
  'Productos' as tabla,
  COUNT(*) as total
FROM productos;

-- Ver si hay categorías por tipo
SELECT 
  tipo,
  COUNT(*) as cantidad
FROM categorias
GROUP BY tipo;
