-- Verificar TODAS las columnas que acepta la tabla productos
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'productos'
ORDER BY ordinal_position;
