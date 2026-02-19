// Script para probar el envío de emails localmente
// Ejecutar con: npm run test:email

const testData = {
  nombre: "Juan Pérez",
  telefono: "+5492494123456",
  email: "test@example.com",
  comentario: "Hola, me interesa este producto y quisiera más información sobre precios y disponibilidad.",
  producto: {
    nombre: "Alambrado Perimetral 50m",
    precio: 150000,
    imagen: ""
  },
  seccion: "cerco"
};

async function testEmail() {
  console.log('🧪 Iniciando prueba de email...\n');
  console.log('📤 Datos de prueba:', JSON.stringify(testData, null, 2));
  
  // Determinar la URL según el entorno
  // Prueba directamente contra el API local en 3001
  const apiUrl = process.env.TEST_URL || 'http://localhost:3001/api/send-email';
  
  console.log(`\n🔄 Enviando request a ${apiUrl}...\n`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Status:', response.status, response.statusText);
    const result = await response.json();
    
    console.log('\n📨 Respuesta del servidor:');
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✅ ¡Email enviado correctamente!');
      console.log('🎉 ID del email:', result.data?.id || 'N/A');
    } else {
      console.log('\n❌ Error al enviar email:');
      console.log('Error:', result.error);
      console.log('Detalles:', result.details);
    }

  } catch (error) {
    console.error('\n❌ Error de conexión:');
    console.error(error.message);
    console.log('\n💡 Asegúrate de que el servidor API esté corriendo:');
    console.log('   npm run api');
    console.log('\n   O usa npm run dev:all para iniciar todo');
  }
}

testEmail();
