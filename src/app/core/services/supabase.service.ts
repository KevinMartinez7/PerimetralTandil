import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  id: string;
  email: string;
  nombre: string;
  rol: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<AdminUser | null>(null);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );

    // Cargar usuario desde localStorage solo si estamos en el navegador
    if (this.isBrowser) {
      const savedUser = localStorage.getItem('admin_user');
      if (savedUser) {
        try {
          this.currentUser.next(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error al parsear usuario guardado:', error);
          localStorage.removeItem('admin_user');
        }
      }
    }
  }

  // Obtener el cliente de Supabase
  get client(): SupabaseClient {
    return this.supabase;
  }

  // Observable de usuario
  get user$(): Observable<AdminUser | null> {
    return this.currentUser.asObservable();
  }

  // Obtener usuario actual
  get currentUserValue(): AdminUser | null {
    return this.currentUser.value;
  }

  // Verificar si hay usuario autenticado
  isAuthenticated(): boolean {
    return this.currentUser.value !== null;
  }

  // Iniciar sesión con Supabase
  async signIn(email: string, password: string) {
    try {
      console.log('Intentando autenticar:', email);
      
      const { data, error } = await this.supabase
        .rpc('authenticate_user', {
          user_email: email,
          user_password: password
        });

      console.log('Respuesta de autenticación:', { data, error });

      if (error) {
        console.error('Error en la llamada RPC:', error);
        throw new Error('Error al autenticar: ' + error.message);
      }

      // Verificar si hay datos
      if (!data || data.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const userData = Array.isArray(data) ? data[0] : data;

      if (!userData.authenticated) {
        throw new Error('Contraseña incorrecta');
      }

      // Autenticación exitosa
      const user: AdminUser = {
        id: userData.id,
        email: userData.email,
        nombre: userData.nombre,
        rol: userData.rol,
        activo: userData.activo
      };

      console.log('✅ Usuario autenticado correctamente:', user);

      this.currentUser.next(user);
      if (this.isBrowser) {
        localStorage.setItem('admin_user', JSON.stringify(user));
      }

      return { user };
    } catch (error: any) {
      console.error('❌ Error en signIn:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async signOut() {
    this.currentUser.next(null);
    if (this.isBrowser) {
      localStorage.removeItem('admin_user');
    }
  }

  // Cambiar contraseña
  async updatePassword(email: string, newPassword: string) {
    const { data, error } = await this.supabase
      .from('usuarios_admin')
      .update({ 
        password_hash: await this.encryptPassword(newPassword)
      })
      .eq('email', email);

    if (error) throw error;
    return data;
  }

  // Función auxiliar para encriptar contraseña (usando la función de PostgreSQL)
  private async encryptPassword(password: string): Promise<string> {
    const { data, error } = await this.supabase
      .rpc('encrypt_password', { password });

    if (error) throw error;
    return data;
  }
}
