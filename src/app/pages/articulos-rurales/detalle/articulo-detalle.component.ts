import { Component, OnInit } from '@angular/core';
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
    private productosService: ProductosService
  ) {}

  ngOnInit() {
    const articuloId = this.route.snapshot.paramMap.get('id');
    if (articuloId) {
      this.cargarArticulo(articuloId);
    }
  }

  async cargarArticulo(id: string) {
    console.log('🔍 Buscando producto con ID:', id);
    try {
      // Cargar productos rurales desde Supabase
      const productos = await this.productosService.getProductos('rural');
      console.log('📦 Productos recibidos:', productos);
      
      // Buscar el producto por ID
      const productoEncontrado = productos.find(p => p.id?.toString() === id);
      console.log('✅ Producto encontrado:', productoEncontrado);
      
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
      } else {
        console.error('❌ No se encontró el producto con ID:', id);
        this.articulo = null;
      }
    } catch (error) {
      console.error('❌ Error al cargar producto:', error);
      this.articulo = null;
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
}