import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticulosRuralesComponent } from './pages/articulos-rurales/articulos-rurales.component';
import { ArticuloDetalleComponent } from './pages/articulos-rurales/detalle/articulo-detalle.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'articulos-rurales', component: ArticulosRuralesComponent },
  { path: 'articulos-rurales/detalle/:id', component: ArticuloDetalleComponent },
  { path: '**', redirectTo: '' }
];
