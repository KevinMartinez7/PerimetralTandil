import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  ArticulosRuralesService, 
  ArticuloRural, 
  Categoria, 
  Marca, 
  FiltrosArticulos 
} from './services/articulos-rurales.service';

@Component({
  selector: 'app-articulos-rurales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articulos-rurales.component.html',
  styleUrl: './articulos-rurales.component.scss'
})
export class ArticulosRuralesComponent implements OnInit {
  articulos: ArticuloRural[] = [];
  articulosFiltrados: ArticuloRural[] = [];
  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  
  filtros: FiltrosArticulos = {};
  busqueda: string = '';
  
  // Estado del menú lateral
  mostrarFiltros = true;
  
  constructor(
    private articulosService: ArticulosRuralesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // Cargar artículos
    this.articulosService.getArticulos().subscribe(articulos => {
      this.articulos = articulos;
      this.aplicarFiltros();
    });

    // Cargar categorías
    this.articulosService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });

    // Cargar marcas
    this.articulosService.getMarcas().subscribe(marcas => {
      this.marcas = marcas;
    });
  }

  aplicarFiltros() {
    this.filtros.busqueda = this.busqueda;
    this.articulosService.getArticulosFiltrados(this.filtros).subscribe(articulos => {
      this.articulosFiltrados = articulos;
    });
  }

  filtrarPorCategoria(categoria: string) {
    if (this.filtros.categoria === categoria) {
      delete this.filtros.categoria;
    } else {
      this.filtros.categoria = categoria;
    }
    this.aplicarFiltros();
  }

  filtrarPorMarca(marca: string) {
    if (this.filtros.marca === marca) {
      delete this.filtros.marca;
    } else {
      this.filtros.marca = marca;
    }
    this.aplicarFiltros();
  }

  toggleConPrecio() {
    this.filtros.conPrecio = !this.filtros.conPrecio;
    if (this.filtros.conPrecio) {
      this.filtros.sinPrecio = false;
    }
    this.aplicarFiltros();
  }

  toggleSinPrecio() {
    this.filtros.sinPrecio = !this.filtros.sinPrecio;
    if (this.filtros.sinPrecio) {
      this.filtros.conPrecio = false;
    }
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.filtros = {};
    this.busqueda = '';
    this.aplicarFiltros();
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  formatearPrecio(precio: number): string {
    if (precio === 0) {
      return 'Consultar precio';
    }
    return '$' + precio.toLocaleString();
  }

  contactarPorArticulo(articulo: ArticuloRural) {
    const mensaje = `Hola! Me interesa el producto: ${articulo.nombre}`;
    const enlaceWhatsApp = `https://wa.me/5492494567890?text=${encodeURIComponent(mensaje)}`;
    window.open(enlaceWhatsApp, '_blank');
  }

  verDetalleArticulo(articulo: ArticuloRural) {
    // Aquí se podría implementar un modal o navegación a detalle
    console.log('Ver detalle de:', articulo.nombre);
  }

  getCategoriaNombre(categoriaId: string): string {
    return this.categorias.find(c => c.id === categoriaId)?.nombre || '';
  }
  
  getMarcaNombre(marcaId: string): string {
    return this.marcas.find(m => m.id === marcaId)?.nombre || '';
  }

  goBack() {
    this.router.navigate(['/']);
  }
}