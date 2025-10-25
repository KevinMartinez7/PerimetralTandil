import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticulosRuralesService, ArticuloRural } from '../services/articulos-rurales.service';

@Component({
  selector: 'app-articulo-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './articulo-detalle.component.html',
  styleUrl: './articulo-detalle.component.scss'
})
export class ArticuloDetalleComponent implements OnInit {
  articulo: ArticuloRural | null = null;
  imagenesCarrusel: string[] = [];
  imagenActualIndex: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private articulosService: ArticulosRuralesService
  ) {}

  ngOnInit() {
    const articuloId = this.route.snapshot.paramMap.get('id');
    if (articuloId) {
      this.cargarArticulo(articuloId);
    }
  }

  cargarArticulo(id: string) {
    this.articulosService.getArticulos().subscribe(articulos => {
      this.articulo = articulos.find(a => a.id.toString() === id) || null;
      if (this.articulo) {
        // Simular múltiples imágenes para el carrusel
        this.imagenesCarrusel = [
          this.articulo.imagen,
          this.articulo.imagen, // En un caso real, serían diferentes imágenes
          this.articulo.imagen,
          this.articulo.imagen
        ];
      }
    });
  }

  goBack() {
    this.router.navigate(['/articulos-rurales']);
  }

  // Métodos para el carrusel
  siguienteImagen() {
    this.imagenActualIndex = (this.imagenActualIndex + 1) % this.imagenesCarrusel.length;
  }

  anteriorImagen() {
    this.imagenActualIndex = this.imagenActualIndex === 0 
      ? this.imagenesCarrusel.length - 1 
      : this.imagenActualIndex - 1;
  }

  irAImagen(index: number) {
    this.imagenActualIndex = index;
  }

  // Métodos para contacto
  contactarPorWhatsApp() {
    if (this.articulo) {
      const mensaje = `¡Hola Perimetral Tandil! Me interesa el producto: ${this.articulo.nombre}. ¿Podrían darme más información sobre precio y disponibilidad?`;
      const enlaceWhatsApp = `https://wa.me/5492494567890?text=${encodeURIComponent(mensaje)}`;
      window.open(enlaceWhatsApp, '_blank');
    }
  }

  preguntar() {
    if (this.articulo) {
      const mensaje = `¡Hola Perimetral Tandil! Tengo una consulta sobre: ${this.articulo.nombre}. ¿Podrían ayudarme con más detalles?`;
      const enlaceWhatsApp = `https://wa.me/5492494567890?text=${encodeURIComponent(mensaje)}`;
      window.open(enlaceWhatsApp, '_blank');
    }
  }

  formatearPrecio(precio: number): string {
    if (precio === 0) {
      return 'Consultar precio';
    }
    return '$' + precio.toLocaleString();
  }
}