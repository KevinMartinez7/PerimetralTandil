function generarHTMLEmail(data) {
  const seccionNombre = data.seccion === 'cerco' ? 'Cercos Perimetrales' : 'Artículos Rurales';
  const colorSeccion = data.seccion === 'cerco' ? '#FCD34D' : '#60A5FA';

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Consulta - Perimetral Tandil</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%); padding: 30px; text-align: center;">
              <h1 style="color: #DC2626; margin: 0; font-size: 28px; font-weight: 700;">
                Perimetral Tandil
              </h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">
                Nueva Consulta de Cliente
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 30px 0 30px;">
              <div style="display: inline-block; background-color: ${colorSeccion}; color: #000000; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                ${seccionNombre}
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 10px 0; color: #1a1a1a; font-size: 20px;">
                      📦 Producto Consultado
                    </h2>
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #DC2626;">
                      ${data.producto.nombre}
                    </p>
                    <p style="margin: 10px 0 0 0; font-size: 24px; font-weight: 700; color: #000000;">
                      $${data.producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">
                👤 Datos del Cliente
              </h2>

              <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #e5e5e5;">
                  <td style="padding: 12px 0; font-weight: 600; color: #666; width: 140px;">
                    Nombre:
                  </td>
                  <td style="padding: 12px 0; color: #1a1a1a;">
                    ${data.nombre}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e5e5;">
                  <td style="padding: 12px 0; font-weight: 600; color: #666;">
                    Teléfono:
                  </td>
                  <td style="padding: 12px 0; color: #1a1a1a;">
                    <a href="tel:${data.telefono}" style="color: #DC2626; text-decoration: none;">
                      ${data.telefono}
                    </a>
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e5e5;">
                  <td style="padding: 12px 0; font-weight: 600; color: #666;">
                    Email:
                  </td>
                  <td style="padding: 12px 0; color: #1a1a1a;">
                    <a href="mailto:${data.email}" style="color: #DC2626; text-decoration: none;">
                      ${data.email}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">
                💬 Consulta del Cliente
              </h2>
              <div style="background-color: #f9fafb; border-left: 4px solid #DC2626; padding: 20px; border-radius: 0 8px 8px 0;">
                <p style="margin: 0; color: #1a1a1a; line-height: 1.6; white-space: pre-wrap;">
${data.comentario}
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right: 10px;">
                    <a href="https://wa.me/${data.telefono.replace(/\D/g, '')}"
                       style="display: block; background-color: #25D366; color: white; text-align: center; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                      📱 Responder por WhatsApp
                    </a>
                  </td>
                  <td style="padding-left: 10px;">
                    <a href="mailto:${data.email}"
                       style="display: block; background-color: #DC2626; color: white; text-align: center; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                      📧 Responder por Email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #1a1a1a; padding: 20px 30px; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 14px;">
                Este es un mensaje automático de tu sistema de consultas<br>
                Perimetral Tandil - Magallanes 1250, Tandil, Buenos Aires<br>
                📞 2494316864 | 📧 perimetralalambrados@gmail.com
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

export default async function handler(req, res) {
  console.log('🚀 API Handler iniciado - Método:', req.method);
  
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight request OK');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('❌ Método no permitido:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📧 Recibiendo petición de email:', JSON.stringify(req.body, null, 2));

    const { nombre, telefono, email, comentario, producto, seccion } = req.body;

    // Validar datos
    if (!nombre || !telefono || !email || !comentario || !producto) {
      console.log('❌ Faltan datos requeridos:', { nombre: !!nombre, telefono: !!telefono, email: !!email, comentario: !!comentario, producto: !!producto });
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos'
      });
    }

    console.log('✅ Datos validados correctamente');

    // Generar HTML del email
    const htmlContent = generarHTMLEmail({ nombre, telefono, email, comentario, producto, seccion });
    console.log('✅ HTML generado');

    // API key de Resend
    const resendApiKey = 're_9wyxNPLr_MkUGncB18qwELyAJsZhUxZeJ';
    console.log('🔑 API Key configurada');
    
    // Configurar payload para Resend
    const payload = {
      from: 'Perimetral Tandil <onboarding@resend.dev>',
      to: ['kevin.martinez.jq@gmail.com'],
      reply_to: email,
      subject: `Nueva consulta: ${producto.nombre}`,
      html: htmlContent
    };

    console.log('📤 Enviando email a:', payload.to[0]);

    // Enviar email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify(payload)
    });

    console.log('📨 Respuesta de Resend - Status:', response.status);

    const data = await response.json();
    console.log('📨 Respuesta de Resend - Data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('❌ Error de Resend:', JSON.stringify(data, null, 2));
      return res.status(500).json({
        success: false,
        error: 'Error al enviar email',
        details: data,
        status: response.status
      });
    }

    console.log('✅ Email enviado exitosamente');
    return res.json({ 
      success: true, 
      data,
      message: 'Email enviado correctamente'
    });

  } catch (error) {
    console.error('❌ Error en API de email:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
}
