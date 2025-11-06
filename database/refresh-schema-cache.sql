-- Refrescar el Schema Cache de Supabase

-- Este comando fuerza a Supabase a recargar el schema de la base de datos
-- Ejecutar en el SQL Editor de Supabase Dashboard

NOTIFY pgrst, 'reload schema';

-- También puedes verificar que la tabla está correctamente configurada:
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'productos'
ORDER BY ordinal_position;

/*
Después de ejecutar este script:
1. Espera unos 5-10 segundos
2. Recarga tu aplicación Angular
3. Intenta crear un producto nuevamente

Si esto no funciona, también puedes:
- Ir al Dashboard de Supabase
- Settings → API
- Click en "Restart Server" (esto reinicia el PostgREST)
*/
