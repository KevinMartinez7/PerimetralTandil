-- ========================================
-- ACTUALIZACIÓN TABLA USUARIOS_ADMIN
-- Agregar columna de contraseña encriptada
-- ========================================

-- 1. Habilitar extensión para encriptación (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Agregar columna de contraseña encriptada
ALTER TABLE usuarios_admin
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 3. Hacer que el email sea único (si no lo es ya)
ALTER TABLE usuarios_admin
ADD CONSTRAINT usuarios_admin_email_unique UNIQUE (email);

-- 4. Función para encriptar contraseñas
CREATE OR REPLACE FUNCTION encrypt_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql;

-- 5. Función para verificar contraseñas
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN hash = crypt(password, hash);
END;
$$ LANGUAGE plpgsql;

-- 6. Función para autenticar usuario (usarás esto desde tu app)
CREATE OR REPLACE FUNCTION authenticate_user(user_email TEXT, user_password TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  nombre TEXT,
  rol TEXT,
  activo BOOLEAN,
  authenticated BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ua.id,
    ua.email,
    ua.nombre,
    ua.rol,
    ua.activo,
    (ua.password_hash = crypt(user_password, ua.password_hash)) as authenticated
  FROM usuarios_admin ua
  WHERE ua.email = user_email
  AND ua.activo = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos de ejecución a la función
GRANT EXECUTE ON FUNCTION authenticate_user(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION authenticate_user(TEXT, TEXT) TO authenticated;

-- ========================================
-- CREAR PRIMER USUARIO ADMIN
-- ========================================

-- Insertar usuario admin con contraseña
-- CAMBIA LA CONTRASEÑA por la que quieras usar
INSERT INTO usuarios_admin (email, nombre, rol, activo, password_hash)
VALUES (
  'perimetralalambrados@gmail.com',
  'Super Admin',
  'super_admin',
  true,
  crypt('Perimetral2025-10', gen_salt('bf'))  -- ← CAMBIA 'admin123' por tu contraseña
)
ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = crypt('Perimetral2025-10', gen_salt('bf'));  -- ← CAMBIA 'admin123' por tu contraseña

-- ========================================
-- VERIFICACIÓN Y PRUEBAS
-- ========================================

-- Ver todos los usuarios (sin mostrar el hash de contraseña)
-- SELECT id, email, nombre, rol, activo, created_at FROM usuarios_admin;

-- Probar autenticación (reemplaza con tu email y contraseña)
-- SELECT * FROM authenticate_user('perimetralalambrados@gmail.com', 'admin123');

-- Cambiar contraseña de un usuario existente
-- UPDATE usuarios_admin 
-- SET password_hash = encrypt_password('nuevaContraseña123')
-- WHERE email = 'perimetralalambrados@gmail.com';

