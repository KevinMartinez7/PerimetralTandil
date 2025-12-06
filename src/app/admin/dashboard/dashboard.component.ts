import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
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
    try {
      // Cargar estadísticas desde Supabase
      const [productos, categorias, marcas] = await Promise.all([
        this.supabaseService.client.from('productos').select('id, activo'),
        this.supabaseService.client.from('categorias').select('id'),
        this.supabaseService.client.from('marcas').select('id')
      ]);

      if (productos.data) {
        this.stats.totalProductos = productos.data.length;
        this.stats.productosActivos = productos.data.filter(p => p.activo).length;
      }
      if (categorias.data) {
        this.stats.totalCategorias = categorias.data.length;
      }
      if (marcas.data) {
        this.stats.totalMarcas = marcas.data.length;
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      this.loading = false;
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
