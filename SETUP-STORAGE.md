# 📸 Configuración de Supabase Storage para Imágenes de Productos

## ✅ Implementación Completada

Se ha implementado exitosamente el sistema de carga de imágenes con las siguientes características:

### Funcionalidades
- ✅ Drag & Drop para arrastrar imágenes
- ✅ Selector de archivos tradicional
- ✅ Preview de imagen antes de guardar
- ✅ Barra de progreso animada durante la carga
- ✅ Validación de tipo de archivo (solo imágenes)
- ✅ Validación de tamaño (máximo 5MB)
- ✅ Interfaz visual profesional con estilos personalizados
- ✅ Botón para remover imagen seleccionada
- ✅ Integración completa con Supabase Storage

---

## 🚀 Pasos para Activar el Storage

### Opción 1: Configuración Automática con SQL (Recomendado)

1. **Abre Supabase Dashboard**
   - Ve a: https://supabase.com/dashboard/project/poeakqcynxbrksdvxwmw

2. **Navega al SQL Editor**
   - Busca "SQL Editor" en el menú lateral izquierdo
   - Haz click en "New query"

3. **Ejecuta el Script**
   - Abre el archivo: `database/setup-storage-productos.sql`
   - Copia TODO el contenido del archivo
   - Pégalo en el editor SQL
   - Haz click en el botón **"Run"** (esquina inferior derecha)

4. **Verifica la Creación**
   - Deberías ver un mensaje de éxito
   - Ve a "Storage" en el menú lateral
   - Deberías ver el bucket `productos-imagenes`

---

### Opción 2: Configuración Manual desde el Dashboard

Si prefieres crear el bucket manualmente:

#### Paso 1: Crear el Bucket

1. Ve a **Storage** en el dashboard de Supabase
2. Haz click en **"New bucket"**
3. Configura los siguientes valores:
   - **Name**: `productos-imagenes`
   - **Public bucket**: ✅ Activado (YES)
   - **File size limit**: `5` MB
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/webp`
     - `image/gif`
4. Haz click en **"Create bucket"**

#### Paso 2: Configurar Políticas de Seguridad

1. Ve a **Storage** > **Policies**
2. Selecciona el bucket `productos-imagenes`
3. Haz click en **"New Policy"**
4. Crea las siguientes 4 políticas:

**Política 1: Lectura Pública**
```
Policy name: Public Access - Read
Allowed operation: SELECT
Target roles: public
USING expression: bucket_id = 'productos-imagenes'
```

**Política 2: Subir Imágenes**
```
Policy name: Public Access - Upload
Allowed operation: INSERT
Target roles: public
WITH CHECK expression: bucket_id = 'productos-imagenes'
```

**Política 3: Actualizar Imágenes**
```
Policy name: Public Access - Update
Allowed operation: UPDATE
Target roles: public
USING expression: bucket_id = 'productos-imagenes'
WITH CHECK expression: bucket_id = 'productos-imagenes'
```

**Política 4: Eliminar Imágenes**
```
Policy name: Public Access - Delete
Allowed operation: DELETE
Target roles: public
USING expression: bucket_id = 'productos-imagenes'
```

---

## 🧪 Probar el Sistema

### 1. Verificar que el servidor está corriendo
El servidor debería estar ejecutándose en: http://localhost:64179

### 2. Acceder al panel de productos
1. Inicia sesión en el admin: http://localhost:64179/admin/login
   - Email: `perimetralalambrados@gmail.com`
   - Password: `Perimetral2025-10`

2. Ve a Productos: http://localhost:64179/admin/productos

### 3. Probar la carga de imágenes

**Opción A: Drag & Drop**
1. Haz click en **"Nuevo Producto"**
2. En el modal, busca el área de carga de imágenes
3. Arrastra una imagen desde tu computadora
4. Deberías ver:
   - ✅ El borde se resalta mientras arrastras
   - ✅ Preview de la imagen cargada
   - ✅ Botón ❌ para remover la imagen

**Opción B: Selector de Archivos**
1. Haz click en el área de carga de imágenes
2. Selecciona una imagen desde el explorador de archivos
3. Deberías ver el mismo comportamiento que con drag & drop

**Validaciones Automáticas:**
- ❌ Si el archivo no es una imagen: Verás un alert de error
- ❌ Si el archivo es mayor a 5MB: Verás un alert de error
- ✅ Si el archivo es válido: Se mostrará el preview

### 4. Guardar el producto
1. Completa todos los campos del formulario
2. Haz click en **"Guardar"**
3. Durante la carga verás:
   - Barra de progreso animada
   - Porcentaje de carga
4. Al finalizar:
   - La imagen se sube a Supabase Storage
   - El producto se guarda con la URL pública de la imagen
   - El modal se cierra
   - La tarjeta del producto muestra la imagen

---

## 🔍 Verificar que Funciona

### En el Dashboard de Supabase:

1. **Storage**
   - Ve a Storage > productos-imagenes
   - Deberías ver las imágenes subidas
   - Cada imagen tiene un nombre único: `productos/timestamp-filename.jpg`

2. **Database**
   - Ve a Table Editor > productos
   - Busca el producto que creaste
   - La columna `imagen_url` debe contener una URL como:
     ```
     https://poeakqcynxbrksdvxwmw.supabase.co/storage/v1/object/public/productos-imagenes/productos/1234567890-imagen.jpg
     ```

3. **Probar URL Pública**
   - Copia la URL de `imagen_url`
   - Pégala en una nueva pestaña del navegador
   - Deberías ver la imagen cargada

---

## 📁 Archivos Modificados

```
src/app/admin/productos/
├── productos.component.ts         ✅ Lógica de drag & drop y upload
├── productos.component.html       ✅ UI de carga de imágenes
└── productos.component.scss       ✅ Estilos del drag & drop

database/
└── setup-storage-productos.sql    ✅ Script de configuración
```

---

## 🎨 Características de UX Implementadas

### Visual
- ✅ Área de carga con borde punteado
- ✅ Hover effect al pasar el mouse
- ✅ Animación al arrastrar archivos
- ✅ Preview con imagen a tamaño real
- ✅ Botón circular rojo para remover
- ✅ Barra de progreso con animación shimmer
- ✅ Colores consistentes con el tema (rojo/negro/amarillo)

### Funcional
- ✅ Drag & drop funcional
- ✅ Click para abrir selector de archivos
- ✅ Validación de tipo de archivo
- ✅ Validación de tamaño (5MB máx)
- ✅ Preview instantáneo con FileReader
- ✅ Upload con tracking de progreso
- ✅ Limpieza automática al cerrar modal
- ✅ Manejo de errores con alerts

---

## 🔐 Notas de Seguridad

⚠️ **IMPORTANTE**: Las políticas actuales permiten acceso público sin autenticación.

Esto es adecuado para:
- ✅ Landing pages donde los usuarios necesitan ver imágenes
- ✅ Catálogos de productos públicos
- ✅ Galerías de imágenes accesibles

Para mayor seguridad en producción:
- 🔒 Agregar autenticación para upload/delete
- 🔒 Implementar rate limiting
- 🔒 Agregar validación de archivos en el backend
- 🔒 Implementar escaneo de malware

---

## 🐛 Solución de Problemas

### Problema: No puedo ver el bucket creado
**Solución**: 
- Verifica que el script SQL se ejecutó sin errores
- Refresca la página del dashboard de Supabase
- Ve a Storage y busca "productos-imagenes"

### Problema: Error al subir imagen
**Posibles causas**:
1. El bucket no existe → Ejecuta el script SQL
2. Las políticas no están configuradas → Verifica en Storage > Policies
3. El archivo es muy grande → Máximo 5MB
4. El archivo no es una imagen → Solo se permiten imágenes

### Problema: La imagen se sube pero no se muestra
**Solución**:
- Verifica que el bucket es público
- Prueba abrir la URL directamente en el navegador
- Revisa la consola del navegador para ver errores

### Problema: La barra de progreso no se muestra
**Solución**:
- Es normal si la imagen es pequeña y se sube rápido
- Prueba con una imagen más grande (cerca de 5MB)

---

## 📊 Próximos Pasos

Una vez configurado el storage, puedes:

1. **Mostrar productos en las páginas públicas**
   - Modificar `articulos-rurales.component.ts`
   - Modificar `cercos-perimetrales.component.ts`
   - Cargar productos desde Supabase
   - Mostrar tarjetas con las imágenes

2. **Agregar más campos al formulario**
   - Características del producto
   - Especificaciones técnicas
   - Galería de imágenes múltiples

3. **Mejorar la gestión**
   - Editar imágenes existentes
   - Eliminar imágenes del storage al borrar producto
   - Optimizar imágenes antes de subir

---

## ✅ Checklist de Implementación

- [ ] Ejecutar script SQL en Supabase
- [ ] Verificar que el bucket existe
- [ ] Probar carga de imagen con drag & drop
- [ ] Probar carga de imagen con selector
- [ ] Verificar que la imagen aparece en Storage
- [ ] Verificar que la URL se guarda en la base de datos
- [ ] Probar que la imagen se muestra en la tarjeta del producto
- [ ] Probar validaciones (tamaño y tipo de archivo)
- [ ] Verificar que el preview funciona correctamente
- [ ] Verificar que el botón de remover funciona

---

¿Todo listo? 🎉 ¡Ahora tienes un sistema completo de gestión de imágenes para tus productos!
