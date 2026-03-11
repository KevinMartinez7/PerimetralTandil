import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { PingService } from './core/services/ping.service';

/**
 * 🏓 Inicializador de la aplicación
 * 
 * Despierta Supabase antes de que la aplicación se inicialice completamente
 * Esto previene que el primer request falle por inactividad
 */
function initializeApp(pingService: PingService) {
  return () => {
    console.log('🚀 [APP_INITIALIZER] Iniciando aplicación...');
    console.log('🏓 [APP_INITIALIZER] Despertando Supabase...');
    
    // Ejecutar el ping de forma asíncrona
    // No bloqueamos la aplicación si falla o tarda mucho
    return pingService.wakeUpSupabase()
      .then(result => {
        if (result.ok) {
          console.log('✅ [APP_INITIALIZER] Supabase está activo');
          console.log(`⚡ [APP_INITIALIZER] Latencia: ${result.latency}`);
        } else {
          console.warn('⚠️ [APP_INITIALIZER] Supabase no respondió correctamente:', result.error);
          // No lanzamos error, solo advertimos
        }
      })
      .catch(error => {
        console.error('❌ [APP_INITIALIZER] Error al despertar Supabase:', error);
        // No lanzamos error para no bloquear la app
      });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ), 
    provideClientHydration(withEventReplay()),
    // 🏓 Agregamos el inicializador para despertar Supabase
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [PingService],
      multi: true
    }
  ]
};
