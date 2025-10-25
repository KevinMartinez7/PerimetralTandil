import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ArticuloRural {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  categoria: string;
  marca: string;
  stock: number;
  caracteristicas: string[];
  enOferta?: boolean;
  precioOriginal?: number;
}

export interface Categoria {
  id: string;
  nombre: string;
  cantidad: number;
}

export interface Marca {
  id: string;
  nombre: string;
  cantidad: number;
}

export interface FiltrosArticulos {
  categoria?: string;
  marca?: string;
  conPrecio?: boolean;
  sinPrecio?: boolean;
  busqueda?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticulosRuralesService {

  private articulos: ArticuloRural[] = [
    {
      id: 1,
      nombre: 'Alambrado Galvanizado 17/15',
      precio: 850,
      imagen: '/assets/images/alambrado-galvanizado.jpg',
      descripcion: 'Alambre galvanizado ideal para cercos rurales',
      categoria: 'alambrados',
      marca: 'Acindar',
      stock: 25,
      caracteristicas: ['Galvanizado en caliente', 'Resistente a la corrosión', '100 metros']
    },
    {
      id: 2,
      nombre: 'Poste de Eucalipto Tratado',
      precio: 1200,
      imagen: '/assets/images/poste-eucalipto.jpg',
      descripcion: 'Poste de eucalipto tratado para durabilidad',
      categoria: 'postes',
      marca: 'Forestal',
      stock: 50,
      caracteristicas: ['Tratado CCA', '2.40m altura', 'Resistente a insectos']
    },
    {
      id: 3,
      nombre: 'Tranquera Tubular 3m',
      precio: 15500,
      imagen: '/assets/images/tranquera-tubular.jpg',
      descripcion: 'Tranquera tubular galvanizada de 3 metros',
      categoria: 'tranqueras',
      marca: 'MetalRural',
      stock: 8,
      caracteristicas: ['Galvanizada', '3 metros', 'Incluye herrajes']
    },
    {
      id: 4,
      nombre: 'Grapa para Alambre',
      precio: 45,
      imagen: '/assets/images/grapas.jpg',
      descripcion: 'Grapas galvanizadas para fijación de alambre',
      categoria: 'accesorios',
      marca: 'Ferrum',
      stock: 200,
      caracteristicas: ['Galvanizadas', 'Pack x 100', 'Múltiples medidas']
    },
    {
      id: 5,
      nombre: 'Boyero Eléctrico Solar',
      precio: 18900,
      imagen: '/assets/images/boyero-solar.jpg',
      descripcion: 'Boyero eléctrico con panel solar incluido',
      categoria: 'boyeros',
      marca: 'ElectroRural',
      stock: 12,
      caracteristicas: ['Panel solar 10W', 'Batería recargable', '5km alcance'],
      enOferta: true,
      precioOriginal: 21500
    },
    {
      id: 6,
      nombre: 'Malla Romboidal 2x50m',
      precio: 8700,
      imagen: '/assets/images/malla-romboidal.jpg',
      descripcion: 'Malla romboidal galvanizada',
      categoria: 'mallas',
      marca: 'Sima',
      stock: 15,
      caracteristicas: ['Galvanizada', '2m altura', '50m longitud']
    },
    {
      id: 7,
      nombre: 'Herramientas de Campo Set',
      precio: 0, // Sin precio - consultar
      imagen: '/assets/images/herramientas-campo.jpg',
      descripcion: 'Set completo de herramientas para trabajo rural',
      categoria: 'herramientas',
      marca: 'Bahco',
      stock: 5,
      caracteristicas: ['Incluye pala', 'Incluye pico', 'Incluye tenaza']
    },
    {
      id: 8,
      nombre: 'Bebedero Automático',
      precio: 3450,
      imagen: '/assets/images/bebedero.jpg',
      descripcion: 'Bebedero automático para ganado',
      categoria: 'bebederos',
      marca: 'AgroTech',
      stock: 30,
      caracteristicas: ['Acero inoxidable', 'Flotante automático', '50L capacidad']
    }
  ];

  constructor() { }

  getArticulos(): Observable<ArticuloRural[]> {
    return of(this.articulos);
  }

  getArticulosFiltrados(filtros: FiltrosArticulos): Observable<ArticuloRural[]> {
    let articulosFiltrados = [...this.articulos];

    if (filtros.categoria) {
      articulosFiltrados = articulosFiltrados.filter(a => a.categoria === filtros.categoria);
    }

    if (filtros.marca) {
      articulosFiltrados = articulosFiltrados.filter(a => a.marca === filtros.marca);
    }

    if (filtros.conPrecio) {
      articulosFiltrados = articulosFiltrados.filter(a => a.precio > 0);
    }

    if (filtros.sinPrecio) {
      articulosFiltrados = articulosFiltrados.filter(a => a.precio === 0);
    }

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      articulosFiltrados = articulosFiltrados.filter(a => 
        a.nombre.toLowerCase().includes(busqueda) ||
        a.descripcion.toLowerCase().includes(busqueda) ||
        a.marca.toLowerCase().includes(busqueda)
      );
    }

    return of(articulosFiltrados);
  }

  getCategorias(): Observable<Categoria[]> {
    const categorias = this.articulos.reduce((acc, articulo) => {
      const categoria = acc.find(c => c.id === articulo.categoria);
      if (categoria) {
        categoria.cantidad++;
      } else {
        acc.push({
          id: articulo.categoria,
          nombre: this.getNombreCategoria(articulo.categoria),
          cantidad: 1
        });
      }
      return acc;
    }, [] as Categoria[]);

    return of(categorias);
  }

  getMarcas(): Observable<Marca[]> {
    const marcas = this.articulos.reduce((acc, articulo) => {
      const marca = acc.find(m => m.id === articulo.marca);
      if (marca) {
        marca.cantidad++;
      } else {
        acc.push({
          id: articulo.marca,
          nombre: articulo.marca,
          cantidad: 1
        });
      }
      return acc;
    }, [] as Marca[]);

    return of(marcas);
  }

  private getNombreCategoria(categoria: string): string {
    const nombres: { [key: string]: string } = {
      'alambrados': 'Alambrados',
      'postes': 'Postes',
      'tranqueras': 'Tranqueras',
      'accesorios': 'Accesorios',
      'boyeros': 'Boyeros Eléctricos',
      'mallas': 'Mallas',
      'herramientas': 'Herramientas',
      'bebederos': 'Bebederos'
    };
    return nombres[categoria] || categoria;
  }
}