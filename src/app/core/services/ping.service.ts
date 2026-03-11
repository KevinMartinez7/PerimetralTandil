import { Injectable } from '@angular/core';

/**
 * 🏓 Servicio de Ping a Supabase
 * 
 * Propósito:
 * - Despertar la instancia de Supabase antes de cargar datos
 * - Evitar que el primer request falle por inactividad
 * - Mejorar la experiencia de usuario
 * 
 * Uso:
 * ```typescript
 * constructor(private pingService: PingService) {}
 * 
 * async ngOnInit() {
 *   await this.pingService.wakeUpSupabase();
 *   // Ahora cargar los productos...
 * }
 * ```
 */

export interface PingResponse {
  ok: boolean;
  message: string;
  timestamp: string;
  latency: string;
  data?: {
    recordsReturned: number;
    sampleId: string | null;
  };
  error?: {
    type: string;
    message: string;
    details: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PingService {
  
  // URL del endpoint de ping (relativa para que funcione en producción y desarrollo)
  private readonly pingEndpoint = '/api/ping';
  
  // Cache del resultado del ping para evitar múltiples llamadas
  private pingCache: PingResponse | null = null;
  private pingPromise: Promise<PingResponse> | null = null;

  constructor() {
    console.log('🏓 PingService inicializado');
  }

  /**
   * Despertar Supabase haciendo una petición al endpoint de ping
   * 
   * Características:
   * - Solo hace el ping una vez (usa cache)
   * - Si se llama múltiples veces simultáneamente, reutiliza la misma promesa
   * - Timeout de 10 segundos en el cliente
   * - No bloquea la aplicación si falla
   * 
   * @returns Promise con el resultado del ping
   */
  async wakeUpSupabase(): Promise<PingResponse> {
    console.log('🏓 [PingService] wakeUpSupabase() llamado');

    // Si ya tenemos un resultado en cache, devolverlo inmediatamente
    if (this.pingCache) {
      console.log('📦 [PingService] Usando resultado en cache');
      return this.pingCache;
    }

    // Si ya hay un ping en progreso, esperar a que termine
    if (this.pingPromise) {
      console.log('⏳ [PingService] Ping en progreso, esperando...');
      return this.pingPromise;
    }

    // Crear una nueva promesa de ping
    this.pingPromise = this.executePing();

    try {
      const result = await this.pingPromise;
      
      // Guardar en cache solo si fue exitoso
      if (result.ok) {
        this.pingCache = result;
        console.log('✅ [PingService] Ping exitoso, resultado en cache');
      } else {
        console.warn('⚠️ [PingService] Ping completó pero con error:', result.error);
      }

      return result;
    } finally {
      // Limpiar la promesa en progreso
      this.pingPromise = null;
    }
  }

  /**
   * Ejecutar el ping a la API
   * @private
   */
  private async executePing(): Promise<PingResponse> {
    const startTime = Date.now();
    console.log('📡 [PingService] Iniciando petición a', this.pingEndpoint);

    try {
      // Crear AbortController para timeout del lado del cliente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('⏱️ [PingService] Timeout del cliente alcanzado');
      }, 10000); // 10 segundos

      // Realizar la petición
      const response = await fetch(this.pingEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Parsear respuesta
      const data: PingResponse = await response.json();
      
      const clientLatency = Date.now() - startTime;
      console.log(`⚡ [PingService] Latencia del cliente: ${clientLatency}ms`);
      console.log('📥 [PingService] Respuesta:', data);

      return data;

    } catch (error: any) {
      const clientLatency = Date.now() - startTime;
      console.error('❌ [PingService] Error en ping:', error);

      // Crear respuesta de error
      const errorResponse: PingResponse = {
        ok: false,
        message: 'Error al hacer ping desde el cliente',
        timestamp: new Date().toISOString(),
        latency: `${clientLatency}ms`,
        error: {
          type: error.name === 'AbortError' ? 'timeout' : 'network',
          message: error.message || 'Error desconocido',
          details: error.toString()
        }
      };

      return errorResponse;
    }
  }

  /**
   * Limpiar el cache del ping
   * Útil si quieres forzar un nuevo ping
   */
  clearCache(): void {
    console.log('🗑️ [PingService] Cache limpiado');
    this.pingCache = null;
    this.pingPromise = null;
  }

  /**
   * Verificar si Supabase ya está despierto (según cache)
   */
  isSupabaseAwake(): boolean {
    return this.pingCache?.ok ?? false;
  }

  /**
   * Obtener el último resultado del ping
   */
  getLastPingResult(): PingResponse | null {
    return this.pingCache;
  }
}
