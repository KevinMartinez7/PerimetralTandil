import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticulosRuralesComponent } from './pages/articulos-rurales/articulos-rurales.component';
import { ArticuloDetalleComponent } from './pages/articulos-rurales/detalle/articulo-detalle.component';
import { CercosPerimetralesComponent } from './pages/cercos-perimetrales/cercos-perimetrales.component';
import { CercoDetalleComponent } from './pages/cercos-perimetrales/detalle/cerco-detalle.component';
import { LoginComponent } from './admin/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'articulos-rurales', component: ArticulosRuralesComponent },
  { path: 'articulos-rurales/detalle/:id', component: ArticuloDetalleComponent },
  { path: 'cercos-perimetrales', component: CercosPerimetralesComponent },
  { path: 'cercos-perimetrales/detalle/:id', component: CercoDetalleComponent },
  
  // Rutas de administración
  { path: 'admin/login', component: LoginComponent },
  { 
    path: 'admin', 
    canActivate: [authGuard],
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      { 
        path: 'productos', 
        loadComponent: () => import('./admin/productos/productos.component').then(m => m.ProductosComponent)
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  
  { path: '**', redirectTo: '' }
];
