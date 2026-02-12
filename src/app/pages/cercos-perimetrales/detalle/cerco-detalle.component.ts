import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductosService, Producto } from '../../../core/services/productos.service';
import { EmailService } from '../../../core/services/email.service';

// Interface local para compatibilidad con el template
interface CercoPerimetral extends Producto {
  imagen: string;
  en_oferta?: boolean;
  precio_original?: number;
}

@Component({
  selector: 'app-cerco-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cerco-detalle.component.html',
  styleUrl: './cerco-detalle.component.scss'
})
export class CercoDetalleComponent implements OnInit, OnDestroy {
  cerco: CercoPerimetral | null = null;
  imagenesCarrusel: string[] = [];
  imagenActualIndex: number = 0;
  loading: boolean = true;

  // Auto-recuperación
  private intentosRecuperacion = 0;
  private maxIntentosRecuperacion = 3;
  private timerRecuperacion: any = null;
  private timerTimeoutSeguridad: any = null;
  private timerBackupRecuperacion: any = null;

  // Control del modal del formulario
  mostrarFormulario: boolean = false;
  enviandoEmail: boolean = false;
  mensajeRespuesta: string = '';
  
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
    private emailService: EmailService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('🚀 CercoDetalleComponent inicializado');
    const cercoId = this.route.snapshot.paramMap.get('id');
    console.log('🆔 ID del cerco desde la ruta:', cercoId);
    if (cercoId) {
      // Inicializar mecanismo de auto-recuperación
      this.iniciarRecuperacionAutomatica();
      this.cargarCerco(cercoId);
    } else {
      console.error('❌ No se proporcionó ID del cerco');
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    console.log('🧹 CercoDetalleComponent destruyéndose - limpiando todos los timers');
    this.detenerRecuperacionAutomatica();
    
    // Limpieza adicional por si acaso
    if (this.timerRecuperacion) {
      clearInterval(this.timerRecuperacion);
      this.timerRecuperacion = null;
    }
    if (this.timerTimeoutSeguridad) {
      clearTimeout(this.timerTimeoutSeguridad);
      this.timerTimeoutSeguridad = null;
    }
    if (this.timerBackupRecuperacion) {
      clearInterval(this.timerBackupRecuperacion);
      this.timerBackupRecuperacion = null;
    }
  }

  async cargarCerco(id: string) {
    console.log('🔍 Buscando producto con ID:', id);
    this.loading = true;
    this.cdr.markForCheck();
    this.cdr.detectChanges(); // Forzar actualización del loading
    
    try {
      // Cargar productos cercos desde Supabase
      console.log('📞 Llamando a ProductosService.getProductos()...');
      const productos = await this.productosService.getProductos('cerco');
      console.log('📦 Productos recibidos:', productos);
      
      // Buscar el producto por ID
      const productoEncontrado = productos.find(p => p.id?.toString() === id);
      console.log('✅ Producto encontrado:', productoEncontrado);
      console.log('🔍 Propiedades del producto encontrado:', Object.keys(productoEncontrado || {}));
      console.log('📊 Stock crudo del producto:', productoEncontrado?.stock);
      console.log('📊 Tipo de stock:', typeof productoEncontrado?.stock);
      
      if (productoEncontrado) {
        // Convertir Producto a CercoPerimetral
        this.cerco = {
          ...productoEncontrado,
          imagen: productoEncontrado.imagenes && productoEncontrado.imagenes.length > 0 
            ? productoEncontrado.imagenes[0] 
            : '/imagenes/placeholder-cerco.jpg',
          en_oferta: productoEncontrado.en_oferta,
          precio_original: productoEncontrado.precio_original
        };
        
        console.log('🎯 Cerco asignado al componente:', this.cerco);
        console.log('📊 Stock del producto:', this.cerco?.stock, typeof this.cerco?.stock);
        console.log('🏷️ Características del producto:', this.cerco?.caracteristicas, typeof this.cerco?.caracteristicas);
        
        // Configurar carrusel de imágenes
        if (productoEncontrado.imagenes && productoEncontrado.imagenes.length > 0) {
          this.imagenesCarrusel = productoEncontrado.imagenes;
        } else {
          // Si no hay imágenes, usar placeholder
          const imagenFallback = this.cerco?.imagen || '/imagenes/placeholder-cerco.jpg';
          this.imagenesCarrusel = [
            imagenFallback,
            imagenFallback,
            imagenFallback,
            imagenFallback
          ];
        }
        
        console.log('🖼️ Imágenes del carrusel:', this.imagenesCarrusel);
        console.log('🔄 Estado del componente - cerco existe:', !!this.cerco);
        
        // Múltiples actualizaciones agresivas para asegurar que se renderice
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        setTimeout(() => {
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }, 50);
        
      } else {
        console.error('❌ No se encontró el producto con ID:', id);
        this.cerco = null;
      }
    } catch (error) {
      console.error('❌ Error al cargar producto:', error);
      this.cerco = null;
    } finally {
      this.loading = false;
      // Usar setTimeout para evitar el error de detección de cambios
      setTimeout(() => {
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }, 0);
      console.log('✨ Loading finalizado. Estado:', { loading: this.loading, cerco: !!this.cerco });
      
      // Detener auto-recuperación si fue exitoso
      if (this.cerco) {
        this.detenerRecuperacionAutomatica();
      }
    }
  }

  // Métodos de auto-recuperación
  private iniciarRecuperacionAutomatica() {
    console.log('🔄 Iniciando mecanismo de auto-recuperación AGRESIVO para detalle');
    
    // Timer de timeout de seguridad (3 segundos - más agresivo)
    this.timerTimeoutSeguridad = setTimeout(() => {
      console.log('⚠️ Timeout de seguridad activado - forzando recuperación inmediata');
      this.forzarRecuperacion();
    }, 3000);

    // Timer de verificación cada 1.5 segundos (más frecuente)
    this.timerRecuperacion = setInterval(() => {
      this.verificarEstadoYRecuperar();
    }, 1500);

    // Timer de backup que fuerza recuperación cada 5 segundos sin excepción
    this.timerBackupRecuperacion = setInterval(() => {
      console.log('🆘 RECUPERACIÓN DE EMERGENCIA - Forzando recarga');
      if (!this.cerco && this.loading) {
        this.forzarRecuperacionCompleta();
      }
    }, 5000);
  }

  private detenerRecuperacionAutomatica() {
    console.log('✅ Deteniendo auto-recuperación - producto cargado exitosamente');
    if (this.timerRecuperacion) {
      clearInterval(this.timerRecuperacion);
      this.timerRecuperacion = null;
    }
    if (this.timerTimeoutSeguridad) {
      clearTimeout(this.timerTimeoutSeguridad);
      this.timerTimeoutSeguridad = null;
    }
    if (this.timerBackupRecuperacion) {
      clearInterval(this.timerBackupRecuperacion);
      this.timerBackupRecuperacion = null;
    }
  }

  private verificarEstadoYRecuperar() {
    console.log('🔍 Verificando estado del componente:', {
      loading: this.loading,
      tieneCerco: !!this.cerco,
      intentos: this.intentosRecuperacion
    });

    // Si está cargando pero no hay cerco después de un tiempo
    if (this.loading && !this.cerco) {
      this.forzarRecuperacion();
    }
    
    // Si ya tiene cerco, detener recuperación
    if (this.cerco) {
      this.detenerRecuperacionAutomatica();
    }
  }

  private forzarRecuperacion() {
    if (this.intentosRecuperacion >= this.maxIntentosRecuperacion) {
      console.log('❌ Máximo de intentos de recuperación alcanzado');
      this.detenerRecuperacionAutomatica();
      return;
    }

    this.intentosRecuperacion++;
    console.log(`🔄 Forzando recuperación - intento ${this.intentosRecuperacion}/${this.maxIntentosRecuperacion}`);

    const cercoId = this.route.snapshot.paramMap.get('id');
    if (cercoId) {
      // Resetear estado y recargar
      this.loading = true;
      this.cerco = null;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      
      // Recargar con delay para evitar problemas
      setTimeout(() => {
        this.cargarCerco(cercoId);
      }, 500);
    }
  }

  private forzarRecuperacionCompleta() {
    console.log('🆘 RECUPERACIÓN COMPLETA DE EMERGENCIA');
    const cercoId = this.route.snapshot.paramMap.get('id');
    if (cercoId) {
      // Resetear completamente el estado
      this.loading = true;
      this.cerco = null;
      this.imagenesCarrusel = [];
      this.imagenActualIndex = 0;
      
      // Forzar múltiples actualizaciones
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      setTimeout(() => this.cdr.detectChanges(), 100);
      setTimeout(() => this.cdr.detectChanges(), 300);
      
      // Recargar inmediatamente
      this.cargarCerco(cercoId);
    }
  }

  goBack() {
    this.router.navigate(['/cercos-perimetrales']);
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
  preguntar() {
    // Abrir el formulario modal
    this.mostrarFormulario = true;
    this.limpiarFormulario();
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.enviandoEmail = false;
    this.mensajeRespuesta = '';
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

  async enviarConsulta() {
    if (!this.validarFormulario()) {
      return;
    }

    if (!this.cerco) {
      return;
    }

    this.enviandoEmail = true;
    this.mensajeRespuesta = '';

    try {
      const resultado = await this.emailService.enviarConsulta({
        nombre: this.formularioContacto.nombre,
        telefono: this.formularioContacto.telefono,
        email: this.formularioContacto.email,
        comentario: this.formularioContacto.comentario,
        producto: {
          nombre: this.cerco.nombre,
          precio: this.cerco.precio || 0,
          imagen: this.cerco.imagen
        },
        seccion: 'cerco'
      });

      if (resultado.success) {
        this.mensajeRespuesta = '✅ ¡Consulta enviada exitosamente! Nos pondremos en contacto contigo pronto.';
        setTimeout(() => {
          this.cerrarFormulario();
        }, 3000);
      } else {
        this.mensajeRespuesta = '❌ Error al enviar la consulta: ' + (resultado.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error al enviar consulta:', error);
      this.mensajeRespuesta = '❌ Error al enviar la consulta. Por favor, intente nuevamente.';
    } finally {
      this.enviandoEmail = false;
    }
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
    if (!this.cerco?.caracteristicas) {
      return [];
    }

    // Si es un array, devolverlo como está
    if (Array.isArray(this.cerco.caracteristicas)) {
      return this.cerco.caracteristicas.map((car, index) => ({
        clave: `Característica ${index + 1}`,
        valor: car
      }));
    }

    // Si es un objeto, convertir a array de pares clave-valor
    if (typeof this.cerco.caracteristicas === 'object') {
      return Object.entries(this.cerco.caracteristicas).map(([clave, valor]) => ({
        clave: clave,
        valor: String(valor)
      }));
    }

    // Si es una string, tratarla como característica única
    if (typeof this.cerco.caracteristicas === 'string') {
      return [{
        clave: 'Característica',
        valor: this.cerco.caracteristicas
      }];
    }

    return [];
  }
}