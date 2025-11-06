import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  loading = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    // Si ya está autenticado, redirigir al dashboard
    if (this.supabaseService.isAuthenticated()) {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      await this.supabaseService.signIn(this.email, this.password);
      this.router.navigate(['/admin/dashboard']);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.errorMessage = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
    } finally {
      this.loading = false;
    }
  }
}
