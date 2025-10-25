import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ArticulosRuralesComponent } from './pages/articulos-rurales/articulos-rurales.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'articulos-rurales', component: ArticulosRuralesComponent },
  { path: '**', redirectTo: '' }
];
