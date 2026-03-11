/**
 * 🏓 Función Serverless de Ping a Supabase
 * 
 * Propósito:
 * - Despertar la instancia de Supabase antes de que el frontend cargue los datos
 * - Evitar que el proyecto en plan gratuito entre en pausa por inactividad
 * - Realizar una consulta mínima y rápida para activar la conexión
 * 
 * Uso:
 * - Endpoint: GET /api/ping
 * - No requiere parámetros
 * - Debe ser llamado desde Angular al iniciar la aplicación
 * 
 * Características:
 * ✅ Consulta ligera (1 registro, 1 campo)
 * ✅ Timeout de 8 segundos para evitar cuelgues
 * ✅ Manejo robusto de errores
 * ✅ CORS habilitado para peticiones desde el frontend
 * ✅ Logging detallado para debugging
 * ✅ Variables de entorno para credenciales
 */

// Configuración de Supabase desde variables de entorno
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://poeakqcynxbrksdvxwmw.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZWFrcWN5bnhicmtzZHZ4d213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4NTg3OTMsImV4cCI6MjA3MjQzNDc5M30.1glKTBCdPI6zQXtMFRwdA4WU9J3Iu5c5RIuKRxPGJaw';

// Timeout para la petición (8 segundos)
const REQUEST_TIMEOUT = 8000;

/**
 * Handler principal de la función serverless
 */
module.exports = async (req, res) => {
  // Timestamp de inicio para medir la latencia
  const startTime = Date.now();

  // Log inicial
  console.log('🏓 [PING] Iniciando ping a Supabase...');
  console.log('📍 [PING] URL:', SUPABASE_URL);
  console.log('⏰ [PING] Timestamp:', new Date().toISOString());

  // Configurar headers CORS para permitir peticiones desde el frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Manejar preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  // Solo permitir método GET
  if (req.method !== 'GET') {
    console.log('❌ [PING] Método no permitido:', req.method);
    return res.status(405).json({
      ok: false,
      error: 'Method not allowed',
      message: 'Solo se permiten peticiones GET a este endpoint'
    });
  }

  try {
    // Construir la URL del endpoint REST de Supabase
    // Realizamos una consulta mínima: obtener solo 1 registro con solo el campo 'id'
    const endpoint = `${SUPABASE_URL}/rest/v1/productos?select=id&limit=1`;
    
    console.log('🔗 [PING] Endpoint completo:', endpoint);

    // Crear AbortController para implementar timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.log('⏱️ [PING] Timeout alcanzado');
    }, REQUEST_TIMEOUT);

    // Realizar la petición a Supabase
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    // Limpiar el timeout si la petición terminó antes
    clearTimeout(timeoutId);

    // Calcular latencia
    const latency = Date.now() - startTime;
    console.log(`⚡ [PING] Latencia: ${latency}ms`);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      console.error('❌ [PING] Error HTTP:', response.status, response.statusText);
      throw new Error(`Supabase respondió con status ${response.status}: ${response.statusText}`);
    }

    // Parsear la respuesta JSON
    const data = await response.json();
    console.log('✅ [PING] Respuesta recibida:', data);

    // Respuesta exitosa
    return res.status(200).json({
      ok: true,
      message: 'Supabase está activo',
      timestamp: new Date().toISOString(),
      latency: `${latency}ms`,
      data: {
        recordsReturned: data?.length || 0,
        sampleId: data?.[0]?.id || null
      }
    });

  } catch (error) {
    // Calcular latencia incluso en caso de error
    const latency = Date.now() - startTime;
    
    // Determinar el tipo de error
    let errorMessage = error.message;
    let errorType = 'unknown';

    if (error.name === 'AbortError') {
      errorType = 'timeout';
      errorMessage = `La petición excedió el timeout de ${REQUEST_TIMEOUT}ms. Supabase puede estar despertándose.`;
    } else if (error.message.includes('fetch')) {
      errorType = 'network';
      errorMessage = 'Error de red al conectar con Supabase';
    } else if (error.message.includes('status')) {
      errorType = 'http';
    }

    console.error('❌ [PING] Error:', errorType, errorMessage);
    console.error('❌ [PING] Stack:', error.stack);

    // Respuesta de error
    return res.status(200).json({
      ok: false,
      message: 'Error al hacer ping a Supabase',
      timestamp: new Date().toISOString(),
      latency: `${latency}ms`,
      error: {
        type: errorType,
        message: errorMessage,
        details: error.message
      }
    });
  }
};
