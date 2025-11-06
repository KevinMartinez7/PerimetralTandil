import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService, Producto, Categoria as CategoriaProducto, Marca as MarcaProducto } from '../../core/services/productos.service';

// Interfaces locales para compatibilidad con el template
interface ArticuloRural extends Producto {
  imagen: string;
  en_oferta?: boolean;
  precio_original?: number;
}

interface Categoria {
  id: string;
  nombre: string;
  slug?: string;
  cantidad?: number;
}

interface Marca {
  id: string;
  nombre: string;
  cantidad?: number;
}

interface FiltrosArticulos {
  categoria?: string;
  marca?: string;
  conPrecio?: boolean;
  sinPrecio?: boolean;
  busqueda?: string;
}

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
    private productosService: ProductosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    try {
      console.log('🔄 Cargando artículos rurales desde Supabase...');

      // Cargar productos tipo 'rural'
      const productos = await this.productosService.getProductos('rural');
      console.log('📦 Productos rurales recibidos:', productos);

      // Transformar productos a artículos para compatibilidad con el template
      this.articulos = productos.map(p => ({
        ...p,
        imagen: (p.imagenes && p.imagenes[0]) || '/imagenes/no-image.png',
        categoria: p.categoria || '',
        marca: p.marca || '',
        en_oferta: p.en_oferta || false,
        precio_original: p.precio_original,
        caracteristicas: Array.isArray(p.caracteristicas) ? p.caracteristicas : []
      })) as ArticuloRural[];

      console.log('✅ Artículos procesados:', this.articulos.length);

      // Cargar categorías tipo 'rural'
      const categoriasData = await this.productosService.getCategorias('rural');
      this.categorias = categoriasData.map(c => ({
        id: c.id || c.nombre,
        nombre: c.nombre,
        slug: c.nombre.toLowerCase().replace(/\s+/g, '-'),
        cantidad: this.contarProductosPorCategoria(c.nombre)
      }));

      console.log('✅ Categorías cargadas:', this.categorias.length);

      // Cargar marcas
      const marcasData = await this.productosService.getMarcas();
      this.marcas = marcasData.map(m => ({
        id: m.id || m.nombre,
        nombre: m.nombre,
        cantidad: this.contarProductosPorMarca(m.nombre)
      }));

      console.log('✅ Marcas cargadas:', this.marcas.length);

      // Aplicar filtros iniciales
      this.aplicarFiltros();
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
    }
  }

  aplicarFiltros() {
    console.log('🔍 Aplicando filtros:', this.filtros, 'Búsqueda:', this.busqueda);
    
    this.articulosFiltrados = this.articulos.filter(articulo => {
      // Filtro de búsqueda
      if (this.busqueda) {
        const busquedaLower = this.busqueda.toLowerCase();
        const matchBusqueda = 
          articulo.nombre.toLowerCase().includes(busquedaLower) ||
          (articulo.descripcion && articulo.descripcion.toLowerCase().includes(busquedaLower));
        if (!matchBusqueda) return false;
      }

      // Filtro por categoría
      if (this.filtros.categoria) {
        if (articulo.categoria !== this.filtros.categoria) return false;
      }

      // Filtro por marca
      if (this.filtros.marca) {
        if (articulo.marca !== this.filtros.marca) return false;
      }

      // Filtro por precio
      if (this.filtros.conPrecio) {
        if (!articulo.precio || articulo.precio === 0) return false;
      }
      if (this.filtros.sinPrecio) {
        if (articulo.precio && articulo.precio > 0) return false;
      }

      return true;
    });

    console.log('✅ Artículos filtrados:', this.articulosFiltrados.length);
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
    const mensaje = `¡Hola Perimetral Tandil! Me interesa el producto: ${articulo.nombre}. ¿Podrían darme más información?`;
    const enlaceWhatsApp = `https://wa.me/2494316864?text=${encodeURIComponent(mensaje)}`;
    window.open(enlaceWhatsApp, '_blank');
  }

  verDetalleArticulo(articulo: ArticuloRural) {
    // Navegar a la página de detalle del artículo
    this.router.navigate(['/articulos-rurales/detalle', articulo.id]);
  }

  getCategoriaNombre(categoria: string): string {
    // Si ya es un nombre, retornarlo directamente
    if (typeof categoria === 'string') {
      return categoria;
    }
    return this.categorias.find(c => c.id === categoria || c.nombre === categoria)?.nombre || '';
  }
  
  getMarcaNombre(marca: string | undefined): string {
    // Si ya es un nombre, retornarlo directamente
    if (!marca) return '';
    if (typeof marca === 'string') {
      return marca;
    }
    return this.marcas.find(m => m.id === marca || m.nombre === marca)?.nombre || '';
  }

  contarProductosPorCategoria(categoria: string): number {
    return this.articulos.filter(a => a.categoria === categoria).length;
  }

  contarProductosPorMarca(marca: string): number {
    return this.articulos.filter(a => a.marca === marca).length;
  }

  goBack() {
    this.router.navigate(['/']);
  }
}