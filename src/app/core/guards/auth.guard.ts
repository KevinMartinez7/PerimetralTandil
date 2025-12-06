import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from '../services/supabase.service';

export const authGuard = () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Si estamos en el servidor, permitir acceso temporalmente
  // (el componente se encargará de verificar en el cliente)
  if (!isPlatformBrowser(platformId)) {
    console.log('🖥️ Auth Guard: Ejecutando en servidor, permitiendo acceso temporal');
    return true;
  }

  console.log('🔐 Auth Guard ejecutándose en navegador...');
  console.log('  → Usuario actual:', supabaseService.currentUserValue);
  console.log('  → isAuthenticated:', supabaseService.isAuthenticated());

  if (supabaseService.isAuthenticated()) {
    console.log('✅ Auth Guard: Usuario autenticado, permitiendo acceso');
    return true;
  }

  console.log('❌ Auth Guard: Usuario no autenticado, redirigiendo a login');
  router.navigate(['/admin/login']);
  return false;
};
