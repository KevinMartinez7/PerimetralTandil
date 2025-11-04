import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CercosPerimetralesService, CercoPerimetral, CategoriaCerco, MarcaCerco, FiltrosCercos } from './services/cercos-perimetrales-simple.service';

@Component({
  selector: 'app-cercos-perimetrales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cercos-perimetrales.component.html',
  styleUrl: './cercos-perimetrales.component.scss'
})
export class CercosPerimetralesComponent implements OnInit {
  cercos: CercoPerimetral[] = [];
  cercosFiltrados: CercoPerimetral[] = [];
  categorias: CategoriaCerco[] = [];
  marcas: MarcaCerco[] = [];
  
  // Filtros
  filtros: FiltrosCercos = {};
  textoBusqueda: string = '';
  mostrarFiltros: boolean = false;
  
  // Paginación
  cercosPorPagina: number = 9;
  paginaActual: number = 1;
  totalPaginas: number = 1;
  
  // Vista
  vistaActual: 'grid' | 'list' = 'grid';
  
  // Ordenamiento
  ordenActual: string = 'nombre';
  direccionOrden: 'asc' | 'desc' = 'asc';

  constructor(
    private cercosService: CercosPerimetralesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cercosService.getCercos().subscribe(data => {
      this.cercos = data;
      this.aplicarFiltros();
    });
    
    this.cercosService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
    
    this.cercosService.getMarcas().subscribe(data => {
      this.marcas = data;
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  aplicarFiltros() {
    this.filtros.busqueda = this.textoBusqueda;
    
    this.cercosService.getCercosConFiltros(this.filtros).subscribe(data => {
      this.cercosFiltrados = this.ordenarCercos(data);
      this.calcularPaginacion();
      this.paginaActual = 1;
    });
  }

  ordenarCercos(cercos: CercoPerimetral[]): CercoPerimetral[] {
    return cercos.sort((a, b) => {
      let valorA: any;
      let valorB: any;
      
      switch(this.ordenActual) {
        case 'precio':
          valorA = a.precio;
          valorB = b.precio;
          break;
        case 'nombre':
          valorA = a.nombre.toLowerCase();
          valorB = b.nombre.toLowerCase();
          break;
        case 'categoria':
          valorA = a.categoria.toLowerCase();
          valorB = b.categoria.toLowerCase();
          break;
        default:
          valorA = a.nombre.toLowerCase();
          valorB = b.nombre.toLowerCase();
      }
      
      if (this.direccionOrden === 'asc') {
        return valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
      } else {
        return valorA > valorB ? -1 : valorA < valorB ? 1 : 0;
      }
    });
  }

  cambiarOrden(campo: string) {
    if (this.ordenActual === campo) {
      this.direccionOrden = this.direccionOrden === 'asc' ? 'desc' : 'asc';
    } else {
      this.ordenActual = campo;
      this.direccionOrden = 'asc';
    }
    this.aplicarFiltros();
  }

  calcularPaginacion() {
    this.totalPaginas = Math.ceil(this.cercosFiltrados.length / this.cercosPorPagina);
  }

  get cercosPaginados(): CercoPerimetral[] {
    const inicio = (this.paginaActual - 1) * this.cercosPorPagina;
    const fin = inicio + this.cercosPorPagina;
    return this.cercosFiltrados.slice(inicio, fin);
  }

  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  get paginasVisibles(): number[] {
    const paginas: number[] = [];
    const inicio = Math.max(1, this.paginaActual - 2);
    const fin = Math.min(this.totalPaginas, this.paginaActual + 2);
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  limpiarFiltros() {
    this.filtros = {};
    this.textoBusqueda = '';
    this.aplicarFiltros();
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  cambiarVista(vista: 'grid' | 'list') {
    this.vistaActual = vista;
  }

  verDetalle(cerco: CercoPerimetral) {
    this.router.navigate(['/cercos-perimetrales/detalle', cerco.id]);
  }

  formatearPrecio(precio: number): string {
    if (precio === 0) {
      return 'Consultar precio';
    }
    return '$' + precio.toLocaleString();
  }

  contactarPorWhatsApp(cerco: CercoPerimetral) {
    const mensaje = `¡Hola Perimetral Tandil! Me interesa el ${cerco.nombre}. ¿Podrían darme más información?`;
    const enlaceWhatsApp = `https://wa.me/2494316864?text=${encodeURIComponent(mensaje)}`;
    window.open(enlaceWhatsApp, '_blank');
  }

  get totalCercos(): number {
    return this.cercosFiltrados.length;
  }

  get resumenFiltros(): string {
    if (this.totalCercos === this.cercos.length) {
      return `Mostrando ${this.totalCercos} cercos`;
    }
    return `Mostrando ${this.totalCercos} de ${this.cercos.length} cercos`;
  }
}