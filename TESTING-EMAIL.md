# 📧 Guía de Testing de Email

## 📋 Configuración Inicial

### 1. Variables de Entorno

Crea o verifica el archivo `.env` en la raíz del proyecto:

```env
RESEND_API_KEY=re_9wyxNPLr_MkUGncB18qwELyAJsZhUxZeJ
EMAIL_FROM=Perimetral Tandil <onboarding@resend.dev>
EMAIL_TO=perimetralalambrados@gmail.com
```

**⚠️ IMPORTANTE:**
- Nunca commitees el archivo `.env` al repositorio
- Para producción, configura las variables en Vercel Dashboard

---

## 🏠 Testing Local

### ✅ Opción 1: Todo en Uno (RECOMENDADO)

Inicia ambos servidores automáticamente con un solo comando:

```powershell
npm run dev:all
```

Esto inicia:
- **Angular (Frontend)**: http://localhost:4200
- **Vercel Dev (API)**: http://localhost:3001/api/*

El proxy de Angular redirige automáticamente las peticiones `/api/*` al puerto 3001.

### Opción 2: Manual (dos terminales)

**Terminal 1 - API de Vercel:**
```powershell
npm run dev
```

**Terminal 2 - Frontend Angular:**
```powershell
npm start
```

### Opción 3: Solo Vercel Dev

Usa Vercel Dev para servir todo (Angular + API):

```powershell
vercel dev
```

Esto inicia todo en http://localhost:3000

---

## 🧪 Probar el Email

Una vez que los servidores estén corriendo:

### Opción A - Desde la aplicación web

1. Abre http://localhost:4200 (o 3000 si usas `vercel dev`)
2. Navega a cualquier producto
3. Llena el formulario de contacto
4. Haz clic en "Enviar consulta"
5. Verifica la consola del navegador y del servidor

### Opción B - Con script de prueba

En otra terminal (mientras los servidores están corriendo):

```powershell
npm run test:email
```

---

## 🌐 Testing en Producción

### Opción 1: Deploy a Vercel

#### Paso 1: Configurar variables de entorno en Vercel

1. Ve a tu proyecto en https://vercel.com
2. Settings → Environment Variables
3. Agrega las siguientes variables:

```
RESEND_API_KEY = re_9wyxNPLr_MkUGncB18qwELyAJsZhUxZeJ
EMAIL_FROM = Perimetral Tandil <onboarding@resend.dev>
EMAIL_TO = perimetralalambrados@gmail.com
```

#### Paso 2: Deploy

```powershell
# Login en Vercel (si es primera vez)
vercel login

# Deploy a producción
vercel --prod
```

#### Paso 3: Probar en producción

1. Ve a tu URL de producción (ej: https://perimetral-tandil.vercel.app)
2. Navega a un producto y prueba el formulario
3. Verifica que el email llegue a `perimetralalambrados@gmail.com`

---

## 🔍 Verificación de Logs

### Logs Locales

Cuando ejecutas `npm run dev`, verás logs en tiempo real:

```
🚀 API Handler iniciado - Método: POST
📧 Recibiendo petición de email
✅ Datos validados correctamente
✅ HTML generado
🔑 API Key configurada
📤 Enviando email a: perimetralalambrados@gmail.com
📨 Respuesta de Resend - Status: 200
✅ Email enviado exitosamente
```

### Logs en Producción

1. Ve a https://vercel.com
2. Selecciona tu proyecto
3. Ve a la pestaña "Functions"
4. Haz clic en `/api/send-email`
5. Verás todos los logs de ejecución

---

## 🧪 Script de Prueba Manual

### test-email.js

Este script prueba el endpoint directamente sin usar la UI:

```javascript
// Modifica los datos de prueba en test-email.js
const testData = {
  nombre: "TU NOMBRE",
  telefono: "+5492494123456",
  email: "tu@email.com",
  comentario: "Mensaje de prueba",
  producto: {
    nombre: "Producto de Prueba",
    precio: 100000
  },
  seccion: "cerco"
};
```

Luego ejecuta:
```powershell
npm run test:email
```

---

## 📊 Monitoreo de Emails en Resend

1. Ve a https://resend.com/emails
2. Inicia sesión con tu cuenta
3. Verás todos los emails enviados con:
   - Estado (Delivered, Failed, etc.)
   - Timestamp
   - Destinatario
   - Logs detallados

---

## ⚠️ Troubleshooting

### Error: "RESEND_API_KEY no configurada"

**Solución:**
- Verifica que el archivo `.env` existe en la raíz
- Verifica que el archivo contiene `RESEND_API_KEY=...`
- Reinicia `npm run dev`

### Error: "Failed to fetch" o "Network Error"

**Solución:**
- Verifica que `npm run dev` está corriendo
- Verifica que estás accediendo a http://localhost:3000
- Revisa la consola del servidor para ver errores

### Email no llega

**Solución:**
1. Revisa la carpeta de SPAM
2. Verifica en https://resend.com/emails el estado del envío
3. Revisa los logs del servidor para ver errores de Resend
4. Verifica que `EMAIL_TO` tenga el email correcto

### Límite de emails alcanzado

**Solución:**
- Con `onboarding@resend.dev` tienes límite de 100 emails/día
- Para producción real, verifica tu dominio en Resend
- Actualiza `EMAIL_FROM` a tu dominio verificado

---

## 🚀 Comandos Rápidos

```powershell
# ⭐ RECOMENDADO: Inicia todo automáticamente
npm run dev:all

# Opción 2: Desarrollo manual (2 terminales)
# Terminal 1:
npm run dev          # API en puerto 3001
# Terminal 2:
npm start            # Angular en puerto 4200

# Opción 3: Solo Vercel Dev
vercel dev           # Todo en puerto 3000

# Probar email (en terminal separada)
npm run test:email

# Deploy a producción
vercel --prod

# Ver logs de producción
vercel logs
```

---

## 📌 Checklist de Testing

### Testing Local ✅
- [ ] Archivo `.env` configurado
- [ ] `npm run dev` corriendo sin errores
- [ ] Formulario de contacto funciona
- [ ] Email llega a buzón
- [ ] Script `test-email.js` funciona
- [ ] Logs muestran proceso completo

### Testing Producción ✅
- [ ] Variables configuradas en Vercel
- [ ] Deploy exitoso
- [ ] URL de producción accesible
- [ ] Formulario en producción funciona
- [ ] Email llega desde producción
- [ ] Logs de Vercel Functions disponibles

---

## 🎯 Próximos Pasos

1. **Dominio Personalizado**: Verifica tu dominio en Resend para:
   - Elimitar límite de 100 emails/día
   - Usar tu propio dominio en el remitente
   - Mejor deliverability

2. **Notificaciones**: Agregar notificaciones en la UI cuando el email se envíe

3. **Analytics**: Implementar tracking de emails enviados en tu base de datos

4. **Rate Limiting**: Agregar límite de requests por IP para evitar spam
