// Servidor local simple para testing de API
// Solo para desarrollo local - simula Vercel Functions
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Log de todas las peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Importar el handler de send-email (ahora es CommonJS)
const sendEmailHandler = require('./api/send-email');

app.post('/api/send-email', async (req, res) => {
  console.log('📧 Petición recibida en /api/send-email');
  
  try {
    await sendEmailHandler(req, res);
  } catch (error) {
    console.error('❌ Error en handler:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        details: error.message
      });
    }
  }
});

app.options('/api/send-email', (req, res) => {
  res.status(200).end();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API local funcionando',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('==============================================');
  console.log('  🚀 API Local Server Iniciado');
  console.log('==============================================');
  console.log(`  Puerto: ${PORT}`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log('');
  console.log('  Endpoints disponibles:');
  console.log(`    POST http://localhost:${PORT}/api/send-email`);
  console.log(`    GET  http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('  Variables de entorno:');
  console.log(`    RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Configurada' : '❌ NO configurada'}`);
  console.log(`    EMAIL_FROM: ${process.env.EMAIL_FROM || 'No configurado'}`);
  console.log(`    EMAIL_TO: ${process.env.EMAIL_TO || 'No configurado'}`);
  console.log('');
  console.log('  Presiona Ctrl+C para detener');
  console.log('==============================================');
  console.log('');
});
