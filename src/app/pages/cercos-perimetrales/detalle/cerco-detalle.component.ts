import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CercosPerimetralesService, CercoPerimetral } from '../services/cercos-perimetrales.service';

@Component({
  selector: 'app-cerco-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cerco-detalle.component.html',
  styleUrl: './cerco-detalle.component.scss'
})
export class CercoDetalleComponent implements OnInit {
  cerco: CercoPerimetral | null = null;
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
    private cercosService: CercosPerimetralesService
  ) {}

  ngOnInit() {
    const cercoId = this.route.snapshot.paramMap.get('id');
    if (cercoId) {
      this.cargarCerco(cercoId);
    }
  }

  cargarCerco(id: string) {
    this.cercosService.getCercos().subscribe(cercos => {
      this.cerco = cercos.find(c => c.id.toString() === id) || null;
      if (this.cerco) {
        // Configurar imágenes específicas para cada producto
        if (this.cerco.id === 1 && this.cerco.nombre === 'Cerco Metálico Residencial Premium') {
          // Imágenes específicas para el Cerco Metálico Premium
          this.imagenesCarrusel = [
            this.cerco.imagen, // Primera imagen (la principal)
            '/imagenes/cerco-metalico-premium-2.jpg', // Segunda imagen
            '/imagenes/cerco-metalico-premium-3.jpg', // Tercera imagen
            this.cerco.imagen  // Cuarta imagen (repetir la principal)
          ];
        } else if (this.cerco.id === 2 && this.cerco.nombre === 'Cerco de Malla Ciclónica Urbana') {
          // Imágenes específicas para Malla Ciclónica
          this.imagenesCarrusel = [
            this.cerco.imagen, // Primera imagen (la principal)
            '/imagenes/malla-ciclonica-instalacion.jpg', // Segunda imagen
            this.cerco.imagen,  // Tercera imagen (repetir la principal)
            this.cerco.imagen  // Cuarta imagen (repetir la principal)
          ];
        } else {
          // Para otros productos, usar la imagen principal repetida
          this.imagenesCarrusel = [
            this.cerco.imagen,
            this.cerco.imagen,
            this.cerco.imagen,
            this.cerco.imagen
          ];
        }
      }
    });
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

    if (this.cerco) {
      const mensaje = `¡Hola Perimetral Tandil!

📋 *CONSULTA SOBRE CERCO PERIMETRAL*
*Producto:* ${this.cerco.nombre}

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