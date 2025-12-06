import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

interface DashboardStats {
  totalProductos: number;
  productosActivos: number;
  totalCategorias: number;
  totalMarcas: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalProductos: 0,
    productosActivos: 0,
    totalCategorias: 0,
    totalMarcas: 0
  };
  loading = true;
  userName = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    // Solo verificar autenticación en el navegador
    if (isPlatformBrowser(this.platformId)) {
      if (!this.supabaseService.isAuthenticated()) {
        console.log('⚠️ DashboardComponent: Usuario no autenticado en navegador, redirigiendo a login');
        this.router.navigate(['/admin/login']);
        return;
      }
    }
    
    this.userName = this.supabaseService.currentUserValue?.email || 'Administrador';
    await this.loadStats();
  }

  async loadStats() {
    this.loading = true;
    
    try {
      console.log('🔄 Cargando estadísticas del dashboard...');
      
      // Cargar estadísticas desde Supabase con timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000)
      );

      const statsPromise = Promise.all([
        this.supabaseService.client.from('productos').select('id, activo'),
        this.supabaseService.client.from('categorias').select('id'),
        this.supabaseService.client.from('marcas').select('id')
      ]);

      const [productos, categorias, marcas] = await Promise.race([
        statsPromise,
        timeoutPromise
      ]) as any[];

      console.log('✅ Datos recibidos:', { 
        productos: productos?.data?.length, 
        categorias: categorias?.data?.length, 
        marcas: marcas?.data?.length 
      });

      if (productos?.data) {
        this.stats.totalProductos = productos.data.length;
        this.stats.productosActivos = productos.data.filter((p: any) => p.activo).length;
      }
      if (categorias?.data) {
        this.stats.totalCategorias = categorias.data.length;
      }
      if (marcas?.data) {
        this.stats.totalMarcas = marcas.data.length;
      }

      console.log('✅ Estadísticas cargadas:', this.stats);
    } catch (error: any) {
      console.error('❌ Error al cargar estadísticas:', error);
      
      // Valores por defecto en caso de error
      this.stats = {
        totalProductos: 0,
        productosActivos: 0,
        totalCategorias: 0,
        totalMarcas: 0
      };
      
      // Si hay timeout o error, mostrar mensaje
      if (error.message === 'Timeout') {
        console.warn('⏱️ Timeout al cargar estadísticas, mostrando valores por defecto');
      }
    } finally {
      this.loading = false;
      console.log('✅ Loading = false');
      this.cdr.detectChanges();
    }
  }

  async logout() {
    try {
      await this.supabaseService.signOut();
      this.router.navigate(['/admin/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
