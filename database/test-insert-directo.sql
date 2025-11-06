-- ============================================
-- Test: Insertar producto directamente con SQL
-- ============================================

-- Intentar insertar un producto de prueba directamente
INSERT INTO productos (
    nombre,
    descripcion,
    precio,
    precio_original,
    stock,
    stock_minimo,
    categoria,
    tipo,
    marca,
    imagenes,
    caracteristicas,
    en_oferta,
    activo,
    vistas,
    ventas_totales
) VALUES (
    'Producto Test',
    'Este es un producto de prueba',
    100.00,
    120.00,
    10,
    5,
    'Alambre Tejido',
    'cerco',
    'Marca Test',
    '["https://ejemplo.com/imagen.jpg"]'::jsonb,
    '{}'::jsonb,
    false,
    true,
    0,
    0
) RETURNING *;

-- Si esto funciona, entonces el problema está en cómo Supabase-JS
-- está construyendo la query, no en la base de datos en sí
