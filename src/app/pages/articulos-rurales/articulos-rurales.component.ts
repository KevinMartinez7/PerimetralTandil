import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrl: './articulos-rurales.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
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
  
  // Estado de carga
  cargando: boolean = true;
  
  constructor(
    private productosService: ProductosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('🚀 ArticulosRuralesComponent ngOnInit iniciado');
    console.log('🔧 Estado inicial:', {
      cargando: this.cargando,
      articulos: this.articulos.length,
      articulosFiltrados: this.articulosFiltrados.length
    });
    
    // Resetear estado al inicio
    this.articulos = [];
    this.articulosFiltrados = [];
    this.categorias = [];
    this.marcas = [];
    this.filtros = {};
    this.busqueda = '';
    this.cargando = true;
    
    // Forzar detección de cambios inicial con estrategia agresiva
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    
    this.cargarDatos();
    
    // Verificación automática del estado cada 2 segundos
    const intervaloVerificacion = setInterval(() => {
      if (this.cargando && this.articulos.length > 0 && this.articulosFiltrados.length > 0) {
        console.log('🔧 AUTO-RECOVERY: Detectado estado inconsistente, corrigiendo...');
        this.cargando = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        clearInterval(intervaloVerificacion);
      }
    }, 2000);
    
    // Limpiar el intervalo después de 30 segundos
    setTimeout(() => {
      clearInterval(intervaloVerificacion);
    }, 30000);
    
    // Timeout de seguridad para evitar loading infinito
    setTimeout(() => {
      if (this.cargando) {
        console.warn('⚠️ Timeout de carga alcanzado, ejecutando recuperación...');
        console.warn('Estado al timeout:', {
          articulos: this.articulos.length,
          articulosFiltrados: this.articulosFiltrados.length
        });
        
        // Usar método de recuperación
        this.forzarRecuperacion();
      }
    }, 15000); // 15 segundos máximo (aumentado)
  }

  async cargarDatos() {
    console.log('🔄 Iniciando carga de datos...');
    console.log('🔧 Estado antes de cargar:', {
      cargando: this.cargando,
      articulos: this.articulos.length,
      articulosFiltrados: this.articulosFiltrados.length
    });
    
    this.cargando = true;
    this.cdr.detectChanges(); // Asegurar que el loading se muestre
    
    try {
      // Paso 1: Verificar que el servicio esté disponible
      console.log('🔍 Paso 1: Verificando servicio...');
      if (!this.productosService) {
        throw new Error('ProductosService no está disponible');
      }

      // Paso 2: Cargar productos tipo 'rural'
      console.log('� Paso 2: Llamando a getProductos("rural")...');
      const productos = await this.productosService.getProductos('rural');
      console.log('📦 Paso 2 completado. Productos recibidos:', productos?.length || 0);

      if (!productos || !Array.isArray(productos)) {
        console.error('❌ Productos no es un array válido:', productos);
        throw new Error('Respuesta de productos inválida');
      }

      if (productos.length === 0) {
        console.log('⚠️ No se encontraron productos rurales');
        this.articulos = [];
        this.articulosFiltrados = [];
        this.cargando = false;
        return;
      }

      // Paso 3: Transformar productos
      console.log('� Paso 3: Transformando productos...');
      this.articulos = productos.map((p, index) => {
        console.log(`  - Procesando producto ${index + 1}:`, p.nombre);
        return {
          ...p,
          imagen: (p.imagenes && p.imagenes[0]) || '/imagenes/no-image.png',
          categoria: p.categoria || '',
          marca: p.marca || '',
          en_oferta: p.en_oferta || false,
          precio_original: p.precio_original,
          caracteristicas: Array.isArray(p.caracteristicas) ? p.caracteristicas : []
        } as ArticuloRural;
      });

      console.log('✅ Paso 3 completado. Artículos procesados:', this.articulos.length);

      // Paso 4: Mostrar todos los productos inicialmente
      console.log('🔍 Paso 4: Inicializando artículos filtrados...');
      this.articulosFiltrados = [...this.articulos];
      console.log('✅ Paso 4 completado. Artículos filtrados:', this.articulosFiltrados.length);

      // Paso 5: Finalizar carga principal
      console.log('🔍 Paso 5: Finalizando carga principal...');
      this.cargando = false;
      
      // Estrategia agresiva de detección de cambios
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        console.log('🔄 Detección de cambios adicional ejecutada');
      }, 50);
      
      setTimeout(() => {
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        console.log('🔄 Detección de cambios (2do intento) ejecutada');
      }, 200);
      
      console.log('🎉 Carga principal completa. Mostrando', this.articulosFiltrados.length, 'productos');
      console.log('🔧 Estado después de carga principal:', {
        cargando: this.cargando,
        articulos: this.articulos.length,
        articulosFiltrados: this.articulosFiltrados.length
      });

      // Paso 6: Cargar categorías y marcas (ahora que tenemos los productos)
      console.log('🔍 Paso 6: Iniciando carga de categorías y marcas...');
      await this.cargarCategoriasYMarcas();
      
    } catch (error) {
      console.error('❌ Error crítico al cargar datos:', error);
      if (error instanceof Error) {
        console.error('❌ Stack trace:', error.stack);
      }
      this.cargando = false;
      this.articulos = [];
      this.articulosFiltrados = [];
      this.cdr.detectChanges(); // Forzar actualización también en error
    }
  }

  async cargarCategoriasYMarcas() {
    try {
      console.log('🔄 Cargando categorías y marcas en segundo plano...');
      
      // Cargar categorías tipo 'rural'
      const categoriasData = await this.productosService.getCategorias('rural');
      this.categorias = categoriasData.map(c => ({
        id: c.id || c.nombre,
        nombre: c.nombre,
        slug: c.nombre.toLowerCase().replace(/\s+/g, '-'),
        cantidad: 0 // Se calculará después
      }));
      
      // Calcular cantidades después de tener los artículos cargados
      this.categorias.forEach(categoria => {
        categoria.cantidad = this.contarProductosPorCategoria(categoria.nombre);
      });
      
      console.log('✅ Categorías cargadas:', this.categorias.length);
      console.log('📊 Categorías con cantidades:', this.categorias);

      // Cargar marcas
      const marcasData = await this.productosService.getMarcas();
      this.marcas = marcasData.map(m => ({
        id: m.id || m.nombre,
        nombre: m.nombre,
        cantidad: 0 // Se calculará después
      }));
      
      // Calcular cantidades después de tener los artículos cargados
      this.marcas.forEach(marca => {
        marca.cantidad = this.contarProductosPorMarca(marca.nombre);
      });
      
      console.log('✅ Marcas cargadas:', this.marcas.length);
      console.log('📊 Marcas con cantidades:', this.marcas);

      // Forzar detección de cambios después de cargar categorías y marcas
      this.cdr.detectChanges();
      
      // Pequeño delay para asegurar que la vista se actualice
      setTimeout(() => {
        this.cdr.detectChanges();
        console.log('🔄 Vista actualizada con categorías y marcas');
      }, 100);

    } catch (error) {
      console.error('⚠️ Error al cargar categorías/marcas (no crítico):', error);
      // No afecta la funcionalidad principal
    }
  }

  aplicarFiltros() {
    // Solo aplicar filtros si los datos ya están cargados
    if (this.cargando || this.articulos.length === 0) {
      console.log('⏳ Esperando datos antes de aplicar filtros...');
      return;
    }

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
    this.cdr.detectChanges(); // Forzar actualización después de filtrar
  }

  filtrarPorCategoria(categoria: string) {
    console.log('🔍 Filtrar por categoría:', categoria);
    if (this.filtros.categoria === categoria) {
      delete this.filtros.categoria;
    } else {
      this.filtros.categoria = categoria;
    }
    this.aplicarFiltros();
  }

  filtrarPorMarca(marca: string) {
    console.log('🔍 Filtrar por marca:', marca);
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
    console.log('🧹 Limpiando filtros...');
    console.log('🔧 Estado antes de limpiar:', {
      cargando: this.cargando,
      articulos: this.articulos.length,
      articulosFiltrados: this.articulosFiltrados.length,
      filtros: this.filtros
    });
    
    this.filtros = {};
    this.busqueda = '';
    
    // Mostrar todos los productos cuando se limpian los filtros
    if (this.articulos.length > 0) {
      this.articulosFiltrados = [...this.articulos];
      this.cargando = false; // Asegurar que no esté cargando
      this.cdr.detectChanges(); // Forzar actualización
      console.log('📋 Mostrando todos los productos después de limpiar:', this.articulosFiltrados.length);
    } else {
      // Si no hay artículos, intentar recargar
      console.log('⚠️ No hay artículos, intentando recargar...');
      this.cargarDatos();
    }
    
    console.log('🔧 Estado después de limpiar:', {
      cargando: this.cargando,
      articulos: this.articulos.length,
      articulosFiltrados: this.articulosFiltrados.length
    });
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

  // Método de recuperación para problemas de estado
  forzarRecuperacion() {
    console.log('🛠️ RECOVERY: Forzando recuperación de estado');
    console.log('🔧 Estado actual:', {
      cargando: this.cargando,
      articulos: this.articulos.length,
      articulosFiltrados: this.articulosFiltrados.length
    });
    
    // Si hay productos pero no están filtrados, restaurar
    if (this.articulos.length > 0 && this.articulosFiltrados.length === 0) {
      this.articulosFiltrados = [...this.articulos];
      console.log('✅ RECOVERY: Productos restaurados');
    }
    
    // Si está cargando indefinidamente, detener
    if (this.cargando) {
      this.cargando = false;
      console.log('✅ RECOVERY: Loading detenido');
    }
    
    // Estrategia agresiva de detección de cambios
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    
    setTimeout(() => {
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      console.log('✅ RECOVERY: Vista actualizada');
    }, 100);
    
    setTimeout(() => {
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      console.log('✅ RECOVERY: Vista actualizada (2do intento)');
    }, 300);
  }
}