/**
 * Script para probar el envío de emails en PRODUCCIÓN
 * URL: https://www.perimetraltandil.com.ar/api/send-email
 */

const fetch = require('node-fetch');

const URL_PRODUCCION = 'https://www.perimetraltandil.com.ar/api/send-email';

const datosTest = {
  nombre: 'Test Producción',
  email: 'test@example.com',
  telefono: '+54 9 11 1234-5678',
  comentario: 'Este es un email de prueba desde el script de testing en PRODUCCIÓN después de verificar el email.',
  producto: 'Consulta General',
  seccion: 'cercos'
};

async function probarEmailProduccion() {
  console.log('🚀 Probando envío de email en PRODUCCIÓN...\n');
  console.log('📍 URL:', URL_PRODUCCION);
  console.log('📧 Datos de prueba:', JSON.stringify(datosTest, null, 2));
  console.log('\n⏳ Enviando solicitud...\n');

  try {
    const respuesta = await fetch(URL_PRODUCCION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosTest)
    });

    const datos = await respuesta.json();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESPUESTA DEL SERVIDOR:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Status HTTP:', respuesta.status);
    console.log('Status Text:', respuesta.statusText);
    console.log('\nDatos:', JSON.stringify(datos, null, 2));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (respuesta.ok && datos.success) {
      console.log('✅ ¡Email enviado correctamente en PRODUCCIÓN! 🎉');
      if (datos.id) {
        console.log('📧 ID del email:', datos.id);
        console.log('🔗 Ver en Resend: https://resend.com/emails/' + datos.id);
      }
      console.log('\n💡 Revisa la bandeja de perimetraltandil@gmail.com');
    } else {
      console.log('❌ Error al enviar email');
      if (datos.error) {
        console.log('Error:', datos.error);
      }
      if (datos.details) {
        console.log('Detalles:', JSON.stringify(datos.details, null, 2));
      }
    }

  } catch (error) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💥 ERROR EN LA SOLICITUD:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Error:', error.message);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}

probarEmailProduccion();
