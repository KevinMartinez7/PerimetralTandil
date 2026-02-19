# 🔧 Configuración de perimetraltandil@gmail.com en Resend

## ⚠️ IMPORTANTE: Debes agregar este email a Resend primero

## 📋 Paso 1: Agregar Email a Resend

### Opción A: Inicia sesión con el nuevo email (RECOMENDADO)

1. **Cierra sesión** de Resend si estás logueado
2. Ve a https://resend.com/login
3. Haz clic en **"Sign up"**
4. Regístrate con: `perimetraltandil@gmail.com`
5. Verifica tu email (revisa la bandeja de entrada)
6. **Copia tu API KEY nueva**
7. Actualiza el archivo `.env`:
   ```env
   RESEND_API_KEY=tu_nueva_api_key_aqui
   EMAIL_TO=perimetraltandil@gmail.com
   ```

### Opción B: Agregar email adicional a tu cuenta existente

1. Ve a https://resend.com/settings/emails
2. Haz clic en **"Add Email"**
3. Ingresa: `perimetraltandil@gmail.com`
4. Verifica el email (revisa la bandeja de entrada de perimetraltandil@gmail.com)
5. Una vez verificado, podrás enviar emails a este destinatario

**NOTA:** La API Key actual sigue funcionando, no necesitas cambiarla.

---

## 🧪 Paso 2: Probar Localmente

### Reiniciar el servidor API

Si tienes el servidor API corriendo, detenlo y reinícialo:

```powershell
# Detener servidores actuales (Ctrl+C en las terminales)

# Reiniciar API
npm run api
```

En otra terminal:
```powershell
# Probar envío
npm run test:email
```

Deberías ver:
```
✅ ¡Email enviado correctamente!
```

Verifica que el email llegó a **perimetraltandil@gmail.com**

---

## 🚀 Paso 3: Configurar en Producción (Vercel)

### 1. Actualizar Variables de Entorno en Vercel

1. Ve a https://vercel.com/tu-proyecto
2. Settings → Environment Variables
3. Actualiza o agrega:

```
RESEND_API_KEY = re_9wyxNPLr_MkUGncB18qwELyAJsZhUxZeJ
EMAIL_FROM = Perimetral Tandil <onboarding@resend.dev>
EMAIL_TO = perimetraltandil@gmail.com
```

**IMPORTANTE:** Si creaste una cuenta nueva de Resend, usa la nueva API Key.

### 2. Deploy a Producción

```powershell
vercel --prod
```

### 3. Probar en Producción

1. Ve a tu URL de producción (ej: https://perimetral-tandil.vercel.app)
2. Navega a un producto
3. Llena el formulario de contacto
4. Envía la consulta
5. **Verifica que llegue a perimetraltandil@gmail.com**

---

## ✅ Checklist de Verificación

### Local (Testing)
- [ ] Email agregado/verificado en Resend
- [ ] `.env` actualizado con `EMAIL_TO=perimetraltandil@gmail.com`
- [ ] Servidor API reiniciado
- [ ] `npm run test:email` funciona
- [ ] Email llega a perimetraltandil@gmail.com

### Producción (Vercel)
- [ ] Variables de entorno actualizadas en Vercel
- [ ] Deploy a producción completado
- [ ] Formulario web probado
- [ ] Email llega a perimetraltandil@gmail.com en producción

---

## 🆘 Solución de Problemas

### Error: "You can only send testing emails to..."

**Causa:** El email no está verificado en Resend

**Solución:**
1. Ve a https://resend.com/settings/emails
2. Verifica que `perimetraltandil@gmail.com` aparezca con ✅
3. Si no está, agrégalo y verifica el email

### Email no llega

**Verifica:**
1. Carpeta de SPAM en `perimetraltandil@gmail.com`
2. Logs de Resend: https://resend.com/emails
3. Logs de Vercel: https://vercel.com → Functions → /api/send-email

---

## 📊 Configuración Final

**Ambiente Local:**
```env
RESEND_API_KEY=tu_api_key
EMAIL_FROM=Perimetral Tandil <onboarding@resend.dev>
EMAIL_TO=perimetraltandil@gmail.com
```

**Ambiente Producción (Vercel):**
```
RESEND_API_KEY=tu_api_key
EMAIL_FROM=Perimetral Tandil <onboarding@resend.dev>
EMAIL_TO=perimetraltandil@gmail.com
```

✅ **Con esta configuración todos los emails irán a perimetraltandil@gmail.com**
