# 📧 Configuración de Resend para Producción

## 📋 Situación Actual

**Modo Testing:**
- Solo envía a: `kevin.martinez.jq@gmail.com`
- Límite: 100 emails/día
- No se puede enviar a otros destinatarios

**Para Producción:**
- Destino: `perimetralalambrados@gmail.com`
- Necesitas verificar un dominio O upgrade de plan

---

## ✅ OPCIÓN 1: Verificar Dominio (RECOMENDADO)

### Paso 1: Agregar Dominio en Resend

1. Ve a https://resend.com/domains
2. Haz clic en **"Add Domain"**
3. Ingresa tu dominio (ej: `perimetraltandil.com` o `perimetraltandil.com.ar`)

### Paso 2: Configurar DNS

Resend te dará estos registros para agregar en tu proveedor de DNS:

```
Tipo: TXT
Nombre: @ (o tu dominio)
Valor: v=spf1 include:_spf.resend.com ~all
TTL: 3600

Tipo: TXT
Nombre: resend._domainkey
Valor: [valor único que te da Resend]
TTL: 3600

Tipo: MX (Opcional, si quieres recibir emails)
Nombre: @
Valor: feedback-smtp.resend.com
Prioridad: 10
```

**¿Dónde agregar estos registros?**

Depende de dónde compraste tu dominio:
- **GoDaddy**: DNS → Registros → Agregar
- **Namecheap**: Advanced DNS → Add New Record
- **Google Domains**: DNS → Registros de recursos
- **Cloudflare**: DNS → Add Record

### Paso 3: Verificar

1. Vuelve a Resend Dashboard
2. Haz clic en "Verify"
3. Espera 10-30 minutos (puede tomar hasta 48h)
4. Una vez verificado, verás un ✅ verde

### Paso 4: Actualizar Variables de Entorno

**Archivo `.env` (local):**
```env
RESEND_API_KEY=re_9wyxNPLr_MkUGncB18qwELyAJsZhUxZeJ
EMAIL_FROM=Perimetral Tandil <contacto@tudominio.com>
EMAIL_TO=perimetralalambrados@gmail.com
```

**Vercel Dashboard (producción):**

1. Ve a https://vercel.com/tu-proyecto
2. Settings → Environment Variables
3. Actualiza:
   - `EMAIL_FROM`: `Perimetral Tandil <contacto@tudominio.com>`
   - `EMAIL_TO`: `perimetralalambrados@gmail.com`

### Paso 5: Deploy

```powershell
vercel --prod
```

---

## 💡 OPCIÓN 2: Sin Dominio Propio

Si **NO tienes dominio** y quieres empezar rápido:

### Opción 2A: Usar Gmail SMTP (Alternativa Gratis)

Cambia a usar Gmail directamente en lugar de Resend:

**Ventajas:**
- ✅ Gratis
- ✅ Funciona con cualquier destinatario
- ✅ No requiere dominio

**Desventajas:**
- ❌ Límite de 500 emails/día
- ❌ Menos profesional
- ❌ Puede ir a SPAM

### Opción 2B: Upgrade Resend (Plan de Pago)

1. Ve a https://resend.com/pricing
2. Selecciona plan "Pro" ($20/mes)
3. Con plan de pago puedes usar `onboarding@resend.dev` sin restricciones

---

## 🎯 RECOMENDACIÓN FINAL

### Para Testing/Desarrollo:
✅ Usar configuración actual:
```env
EMAIL_TO=kevin.martinez.jq@gmail.com
```

### Para Producción:

**MEJOR OPCIÓN:** Verificar dominio
```env
EMAIL_FROM=Perimetral Tandil <contacto@perimetraltandil.com>
EMAIL_TO=perimetralalambrados@gmail.com
```

**Beneficios:**
- 100,000 emails/mes GRATIS
- Profesional
- Mejor deliverability
- No restricciones

---

## 🔧 Configuración en Vercel (Producción)

Una vez que tengas dominio verificado:

### 1. Variables de Entorno en Vercel

```
RESEND_API_KEY=re_9wyxNPLr_MkUGncB18qwELyAJsZhUxZeJ
EMAIL_FROM=Perimetral Tandil <contacto@tudominio.com>
EMAIL_TO=perimetralalambrados@gmail.com
```

### 2. Deploy a Producción

```powershell
# Desde el proyecto
vercel --prod
```

### 3. Probar en Producción

Ve a tu URL: `https://perimetral-tandil.vercel.app`
- Llena el formulario de contacto
- Verifica que llegue a `perimetralalambrados@gmail.com`

---

## 📊 Límites de Resend

| Plan | Precio | Emails/mes | Destinatarios |
|------|--------|------------|---------------|
| **Free (sin dominio)** | $0 | 100/día | Solo tu email |
| **Free (con dominio)** | $0 | 3,000/mes | ✅ Cualquiera |
| **Pro** | $20/mes | 50,000/mes | ✅ Cualquiera |
| **Business** | $80/mes | 200,000/mes | ✅ Cualquiera |

---

## ⚡ Inicio Rápido (Sin Dominio)

Si quieres probar YA en producción sin configurar dominio:

### Opción Temporal: Mantener email testing

```env
# .env y Vercel
EMAIL_TO=kevin.martinez.jq@gmail.com
```

Luego configuras forwarding en Gmail:
1. En `kevin.martinez.jq@gmail.com` → Settings → Forwarding
2. Agrega `perimetralalambrados@gmail.com`
3. Todos los emails se reenvían automáticamente

---

## 🆘 Problemas Comunes

### "You can only send testing emails to your own email"

**Causa:** Dominio no verificado en Resend

**Solución:** 
- Verifica dominio en https://resend.com/domains
- O actualiza `EMAIL_TO` a tu email registrado

### Emails van a SPAM

**Solución:**
- Verifica dominio en Resend
- Configura DKIM y SPF correctamente
- Usa dominio verificado en el remitente

### DNS no verifica

**Solución:**
- Espera 24-48 horas
- Verifica que los registros están exactos
- Usa herramientas como https://mxtoolbox.com para verificar

---

## 📞 ¿Necesitas Ayuda?

- Documentación Resend: https://resend.com/docs
- Dashboard: https://resend.com/domains
- Soporte: support@resend.com
