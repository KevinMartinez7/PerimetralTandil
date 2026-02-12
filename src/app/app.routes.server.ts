import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'articulos-rurales/detalle/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'cercos-perimetrales/detalle/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
