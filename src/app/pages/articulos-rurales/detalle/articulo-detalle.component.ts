import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductosService, Producto } from '../../../core/services/productos.service';

// Interface local para compatibilidad con el template
interface ArticuloRural extends Producto {
  imagen: string;
  en_oferta?: boolean;
  precio_original?: number;
}

@Component({
  selector: 'app-articulo-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './articulo-detalle.component.html',
  styleUrl: './articulo-detalle.component.scss'
})
export class ArticuloDetalleComponent implements OnInit {
  articulo: ArticuloRural | null = null;
  imagenesCarrusel: string[] = [];
  imagenActualIndex: number = 0;
  loading: boolean = true;

  // Control del modal del formulario
  mostrarFormularioWhatsApp: boolean = false;
  
  // Control del modal de imagen ampliada
  mostrarImagenAmpliada: boolean = false;
  imagenAmpliadaUrl: string = '';
  
  // Datos del formulario
  formularioContacto = {
    nombre: '',
    telefono: '',
    email: '',
    comentario: ''
  };

  // Control de validaciones
  erroresValidacion = {
    nombre: '',
    telefono: '',
    email: '',
    comentario: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('🚀 ArticuloDetalleComponent inicializado');
    const articuloId = this.route.snapshot.paramMap.get('id');
    console.log('🆔 ID del artículo desde la ruta:', articuloId);
    if (articuloId) {
      this.cargarArticulo(articuloId);
    } else {
      console.error('❌ No se proporcionó ID del artículo');
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async cargarArticulo(id: string) {
    console.log('🔍 Buscando producto con ID:', id);
    this.loading = true;
    this.cdr.detectChanges(); // Forzar actualización del loading
    
    try {
      // Cargar productos rurales desde Supabase
      const productos = await this.productosService.getProductos('rural');
      console.log('📦 Productos recibidos:', productos);
      
      // Buscar el producto por ID
      const productoEncontrado = productos.find(p => p.id?.toString() === id);
      console.log('✅ Producto encontrado:', productoEncontrado);
      console.log('🔍 Propiedades del producto encontrado:', Object.keys(productoEncontrado || {}));
      console.log('📊 Stock crudo del producto:', productoEncontrado?.stock);
      console.log('📊 Tipo de stock:', typeof productoEncontrado?.stock);
      
      if (productoEncontrado) {
        // Convertir Producto a ArticuloRural
        this.articulo = {
          ...productoEncontrado,
          imagen: productoEncontrado.imagenes && productoEncontrado.imagenes.length > 0 
            ? productoEncontrado.imagenes[0] 
            : '/imagenes/placeholder.jpg',
          en_oferta: productoEncontrado.en_oferta,
          precio_original: productoEncontrado.precio_original
        };
        
        console.log('🎯 Artículo asignado al componente:', this.articulo);
        console.log('📊 Stock del producto:', this.articulo?.stock, typeof this.articulo?.stock);
        console.log('🏷️ Características del producto:', this.articulo?.caracteristicas, typeof this.articulo?.caracteristicas);
        
        // Configurar carrusel de imágenes
        if (productoEncontrado.imagenes && productoEncontrado.imagenes.length > 0) {
          this.imagenesCarrusel = productoEncontrado.imagenes;
        } else {
          // Si no hay imágenes, usar placeholder
          const imagenFallback = this.articulo?.imagen || '/imagenes/placeholder.jpg';
          this.imagenesCarrusel = [
            imagenFallback,
            imagenFallback,
            imagenFallback,
            imagenFallback
          ];
        }
        
        console.log('🖼️ Imágenes del carrusel:', this.imagenesCarrusel);
        console.log('🔄 Estado del componente - articulo existe:', !!this.articulo);
      } else {
        console.error('❌ No se encontró el producto con ID:', id);
        this.articulo = null;
      }
    } catch (error) {
      console.error('❌ Error al cargar producto:', error);
      this.articulo = null;
    } finally {
      this.loading = false;
      // Usar setTimeout para evitar el error de detección de cambios
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
      console.log('✨ Loading finalizado. Estado:', { loading: this.loading, articulo: !!this.articulo });
    }
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

  // Métodos para ver imagen ampliada
  abrirImagenAmpliada(urlImagen: string) {
    this.imagenAmpliadaUrl = urlImagen;
    this.mostrarImagenAmpliada = true;
  }

  cerrarImagenAmpliada() {
    this.mostrarImagenAmpliada = false;
    this.imagenAmpliadaUrl = '';
  }

  // Métodos para contacto
  contactarPorWhatsApp() {
    // Abrir el formulario modal
    this.mostrarFormularioWhatsApp = true;
    this.limpiarFormulario();
  }

  cerrarFormulario() {
    this.mostrarFormularioWhatsApp = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.formularioContacto = {
      nombre: '',
      telefono: '',
      email: '',
      comentario: ''
    };
    this.erroresValidacion = {
      nombre: '',
      telefono: '',
      email: '',
      comentario: ''
    };
  }

  validarFormulario(): boolean {
    let esValido = true;
    
    // Limpiar errores previos
    this.erroresValidacion = {
      nombre: '',
      telefono: '',
      email: '',
      comentario: ''
    };

    // Validar nombre
    if (!this.formularioContacto.nombre.trim()) {
      this.erroresValidacion.nombre = 'El nombre es obligatorio';
      esValido = false;
    } else if (this.formularioContacto.nombre.trim().length < 2) {
      this.erroresValidacion.nombre = 'El nombre debe tener al menos 2 caracteres';
      esValido = false;
    }

    // Validar teléfono
    if (!this.formularioContacto.telefono.trim()) {
      this.erroresValidacion.telefono = 'El teléfono es obligatorio';
      esValido = false;
    } else if (!/^\d{10,}$/.test(this.formularioContacto.telefono.replace(/\s/g, ''))) {
      this.erroresValidacion.telefono = 'Ingrese un teléfono válido (mínimo 10 dígitos)';
      esValido = false;
    }

    // Validar email
    if (!this.formularioContacto.email.trim()) {
      this.erroresValidacion.email = 'El email es obligatorio';
      esValido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formularioContacto.email)) {
      this.erroresValidacion.email = 'Ingrese un email válido';
      esValido = false;
    }

    // Validar comentario
    if (!this.formularioContacto.comentario.trim()) {
      this.erroresValidacion.comentario = 'El comentario es obligatorio';
      esValido = false;
    } else if (this.formularioContacto.comentario.trim().length < 10) {
      this.erroresValidacion.comentario = 'El comentario debe tener al menos 10 caracteres';
      esValido = false;
    }

    return esValido;
  }

  enviarConsultaWhatsApp() {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.articulo) {
      const mensaje = `¡Hola Perimetral Tandil!

📋 *CONSULTA SOBRE PRODUCTO*
*Producto:* ${this.articulo.nombre}

👤 *DATOS DEL CLIENTE*
*Nombre:* ${this.formularioContacto.nombre}
*Teléfono:* ${this.formularioContacto.telefono}
*Email:* ${this.formularioContacto.email}

💬 *CONSULTA*
${this.formularioContacto.comentario}

¡Espero su respuesta! Gracias.`;

      const enlaceWhatsApp = `https://wa.me/2494316864?text=${encodeURIComponent(mensaje)}`;
      window.open(enlaceWhatsApp, '_blank');
      this.cerrarFormulario();
    }
  }

  preguntar() {
    // También abrir el formulario para consultas generales
    this.mostrarFormularioWhatsApp = true;
    this.limpiarFormulario();
  }

  formatearPrecio(precio: number): string {
    if (precio === 0) {
      return 'Consultar precio';
    }
    return '$' + precio.toLocaleString();
  }

  formatearStock(stock: number | undefined | null): string {
    console.log('🔢 Formateando stock:', stock, typeof stock);
    
    if (stock === undefined || stock === null) {
      return 'Consultar disponibilidad';
    }
    
    if (stock === 0) {
      return 'Sin stock';
    }
    
    return `${stock} unidades disponibles`;
  }

  obtenerCaracteristicas(): { clave: string, valor: string }[] {
    if (!this.articulo?.caracteristicas) {
      return [];
    }

    // Si es un array, devolverlo como está
    if (Array.isArray(this.articulo.caracteristicas)) {
      return this.articulo.caracteristicas.map((car, index) => ({
        clave: `Característica ${index + 1}`,
        valor: car
      }));
    }

    // Si es un objeto, convertir a array de pares clave-valor
    if (typeof this.articulo.caracteristicas === 'object') {
      return Object.entries(this.articulo.caracteristicas).map(([clave, valor]) => ({
        clave: clave,
        valor: String(valor)
      }));
    }

    // Si es una string, tratarla como característica única
    if (typeof this.articulo.caracteristicas === 'string') {
      return [{
        clave: 'Característica',
        valor: this.articulo.caracteristicas
      }];
    }

    return [];
  }
}