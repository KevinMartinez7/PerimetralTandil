import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductosService, Producto, Categoria as CategoriaProducto, Marca as MarcaProducto } from '../../core/services/productos.service';

// Interfaces locales para compatibilidad con el template
interface CercoPerimetral extends Producto {
  imagen: string;
  en_oferta?: boolean;
  precio_original?: number;
  badges?: string[];
  caracteristicas_visuales?: string[];
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
  selector: 'app-cercos-perimetrales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cercos-perimetrales.component.html',
  styleUrl: './cercos-perimetrales.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class CercosPerimetralesComponent implements OnInit {
  articulos: CercoPerimetral[] = [];
  articulosFiltrados: CercoPerimetral[] = [];
  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  
  filtros: FiltrosArticulos = {};
  busqueda: string = '';
  
  // Estado del menú lateral
  mostrarFiltros = true;
  
  // Estado de carga
  cargando: boolean = true;
  
  constructor(
    private productosService: ProductosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('🚀 CercosPerimetralesComponent ngOnInit iniciado');
    this.cargarDatos();
  }

  async cargarDatos() {
    console.log('🔄 Cargando productos de cercos perimetrales...');
    this.cargando = true;
    
    try {
      // Cargar productos tipo 'cerco'
      const productos = await this.productosService.getProductos('cerco');
      console.log('📦 Productos cercos recibidos:', productos?.length || 0);

      if (!productos || !Array.isArray(productos)) {
        console.error('❌ Productos no es un array válido');
        this.articulos = [];
        this.articulosFiltrados = [];
        this.cargando = false;
        return;
      }

      // Transformar productos - SOLO MOSTRAR PRODUCTOS ACTIVOS en la página pública
      this.articulos = productos
        .filter(p => p.activo === true) // Filtrar solo productos activos
        .map(p => ({
          ...p,
          imagen: (p.imagenes && p.imagenes[0]) || '/imagenes/no-image.png',
          categoria: p.categoria || '',
          marca: p.marca || '',
          en_oferta: p.en_oferta || false,
          precio_original: p.precio_original,
          badges: p.badges || [],
          caracteristicas_visuales: p.caracteristicas_visuales || [],
          caracteristicas: Array.isArray(p.caracteristicas) ? p.caracteristicas : []
        } as CercoPerimetral));

      console.log('✅ Artículos cercos procesados:', this.articulos.length);

      // Mostrar todos los productos inicialmente
      this.articulosFiltrados = [...this.articulos];
      this.cargando = false;
      
      this.cdr.detectChanges();

      // Cargar categorías y marcas en paralelo
      await this.cargarCategoriasYMarcas();

    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  async cargarCategoriasYMarcas() {
    try {
      console.log('🔄 Cargando categorías y marcas...');
      
      const [categoriasData, marcasData] = await Promise.all([
        this.productosService.getCategorias('cerco'),
        this.productosService.getMarcas()
      ]);

      console.log('📦 Categorías recibidas:', categoriasData?.length || 0);
      console.log('📦 Marcas recibidas:', marcasData?.length || 0);

      // Procesar categorías - MOSTRAR TODAS, incluso sin productos
      this.categorias = (categoriasData || []).map(cat => {
        const cantidad = this.articulos.filter(a => 
          a.categoria === cat.nombre || a.categoria === cat.id
        ).length;
        
        return {
          id: cat.id || cat.nombre,
          nombre: cat.nombre,
          slug: cat.nombre.toLowerCase().replace(/\s+/g, '-'),
          cantidad: cantidad
        };
      });
      // NO filtrar categorías sin productos para que aparezcan todas

      // Procesar marcas - MOSTRAR TODAS, incluso sin productos
      this.marcas = (marcasData || []).map(marca => {
        const cantidad = this.articulos.filter(a => 
          a.marca === marca.nombre || a.marca === marca.id
        ).length;
        
        return {
          id: marca.id || marca.nombre,
          nombre: marca.nombre,
          cantidad: cantidad
        };
      });
      // NO filtrar marcas sin productos para que aparezcan todas

      console.log('✅ Categorías procesadas:', this.categorias.length);
      console.log('✅ Marcas procesadas:', this.marcas.length);
      
      this.cdr.detectChanges();

    } catch (error) {
      console.error('❌ Error al cargar categorías y marcas:', error);
    }
  }

  // Métodos de filtrado
  aplicarFiltros() {
    console.log('🔍 Aplicando filtros:', this.filtros, 'Búsqueda:', this.busqueda);
    
    this.articulosFiltrados = this.articulos.filter(articulo => {
      // Filtro de búsqueda
      if (this.busqueda) {
        const terminoBusqueda = this.busqueda.toLowerCase();
        const coincide = 
          articulo.nombre.toLowerCase().includes(terminoBusqueda) ||
          (articulo.descripcion && articulo.descripcion.toLowerCase().includes(terminoBusqueda));
        if (!coincide) return false;
      }

      // Filtro de categoría
      if (this.filtros.categoria) {
        const categoriaArticulo = articulo.categoria;
        if (categoriaArticulo !== this.filtros.categoria) {
          const categoriaMatch = this.categorias.find(c => c.id === this.filtros.categoria);
          if (!categoriaMatch || categoriaArticulo !== categoriaMatch.nombre) {
            return false;
          }
        }
      }

      // Filtro de marca
      if (this.filtros.marca) {
        const marcaArticulo = articulo.marca;
        if (marcaArticulo !== this.filtros.marca) {
          const marcaMatch = this.marcas.find(m => m.id === this.filtros.marca);
          if (!marcaMatch || marcaArticulo !== marcaMatch.nombre) {
            return false;
          }
        }
      }

      // Filtro de precio
      if (this.filtros.conPrecio && !articulo.precio) return false;
      if (this.filtros.sinPrecio && articulo.precio) return false;

      return true;
    });

    console.log('✅ Filtros aplicados. Resultados:', this.articulosFiltrados.length);
    this.cdr.detectChanges();
  }

  filtrarPorCategoria(categoriaId?: string) {
    if (this.filtros.categoria === categoriaId) {
      this.filtros.categoria = undefined;
    } else {
      this.filtros.categoria = categoriaId;
    }
    this.aplicarFiltros();
  }

  filtrarPorMarca(marcaId?: string) {
    if (this.filtros.marca === marcaId) {
      this.filtros.marca = undefined;
    } else {
      this.filtros.marca = marcaId;
    }
    this.aplicarFiltros();
  }

  toggleConPrecio() {
    this.filtros.conPrecio = !this.filtros.conPrecio;
    if (this.filtros.conPrecio) this.filtros.sinPrecio = false;
    this.aplicarFiltros();
  }

  toggleSinPrecio() {
    this.filtros.sinPrecio = !this.filtros.sinPrecio;
    if (this.filtros.sinPrecio) this.filtros.conPrecio = false;
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.filtros = {};
    this.busqueda = '';
    this.articulosFiltrados = [...this.articulos];
    this.cdr.detectChanges();
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  // Métodos de utilidad
  getCategoriaNombre(categoriaIdOrNombre: string): string {
    if (!categoriaIdOrNombre) return 'Sin categoría';
    const categoria = this.categorias.find(c => 
      c.id === categoriaIdOrNombre || c.nombre === categoriaIdOrNombre
    );
    return categoria ? categoria.nombre : categoriaIdOrNombre;
  }

  getMarcaNombre(marcaIdOrNombre?: string): string {
    if (!marcaIdOrNombre) return 'Sin marca';
    const marca = this.marcas.find(m => 
      m.id === marcaIdOrNombre || m.nombre === marcaIdOrNombre
    );
    return marca ? marca.nombre : marcaIdOrNombre;
  }

  formatearPrecio(precio?: number): string {
    if (!precio || precio === 0) return 'Consultar';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(precio);
  }

  getImagenUrl(articulo: CercoPerimetral): string {
    return articulo.imagen || '/imagenes/placeholder-cerco.jpg';
  }

  // Navegación
  verDetalleArticulo(articulo: CercoPerimetral) {
    if (articulo.id) {
      this.router.navigate(['/cercos-perimetrales/detalle', articulo.id]);
    }
  }

  contactarPorArticulo(articulo: CercoPerimetral) {
    const mensaje = `Hola! Me interesa el producto: ${articulo.nombre}`;
    const url = `https://wa.me/542494550000?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
