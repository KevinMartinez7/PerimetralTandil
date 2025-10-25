import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticulosRuralesService, ArticuloRural } from '../services/articulos-rurales.service';

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

      const enlaceWhatsApp = `https://wa.me/5492494316864?text=${encodeURIComponent(mensaje)}`;
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