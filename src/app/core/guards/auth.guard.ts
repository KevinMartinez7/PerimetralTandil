import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard = () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  if (supabaseService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/admin/login']);
  return false;
};
