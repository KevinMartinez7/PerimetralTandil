import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CercoPerimetral {
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

export interface CategoriaCerco {
  id: string;
  nombre: string;
  cantidad: number;
}

export interface MarcaCerco {
  id: string;
  nombre: string;
  cantidad: number;
}

export interface FiltrosCercos {
  categoria?: string;
  marca?: string;
  conPrecio?: boolean;
  sinPrecio?: boolean;
  busqueda?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CercosPerimetralesService {

  private cercos: CercoPerimetral[] = [
    {
      id: 1,
      nombre: 'Cerco Metálico Residencial Premium',
      precio: 2500,
      imagen: '/imagenes/cerco-metalico-premium.jpg',
      descripcion: 'Cerco metálico de alta calidad para residencias, con diseño moderno y elegante',
      categoria: 'metalicos',
      marca: 'MetalPro',
      stock: 15,
      caracteristicas: ['Altura 1.80m', 'Galvanizado en caliente', 'Postes reforzados', 'Incluye instalación']
    },
    {
      id: 2,
      nombre: 'Cerco de Malla Ciclónica Urbana',
      precio: 1200,
      imagen: '/imagenes/malla-ciclonica.jpg',
      descripcion: 'Malla ciclónica galvanizada ideal para cercos urbanos y deportivos',
      categoria: 'mallas',
      marca: 'CercoFlex',
      stock: 30,
      caracteristicas: ['Malla galvanizada', 'Altura 2.00m', 'Alambre calibre 11', 'Postes cada 3m']
    },
    {
      id: 3,
      nombre: 'Cerco Decorativo con Paneles',
      precio: 3200,
      imagen: '/imagenes/cerco-decorativo.jpg',
      descripcion: 'Cerco decorativo con paneles metálicos diseñados para espacios residenciales exclusivos',
      categoria: 'decorativos',
      marca: 'DesignCerco',
      stock: 8,
      caracteristicas: ['Diseño exclusivo', 'Paneles modulares', 'Acabado premium', 'Garantía 10 años']
    },
    {
      id: 4,
      nombre: 'Portón Corredizo Automático',
      precio: 8500,
      imagen: '/imagenes/porton-automatico.jpg',
      descripcion: 'Portón corredizo con motor automático y control remoto, ideal para accesos vehiculares',
      categoria: 'portones',
      marca: 'AutoGate',
      stock: 5,
      caracteristicas: ['Motor 500kg', 'Control remoto', 'Sensor de obstáculos', 'Apertura 4m'],
      enOferta: true,
      precioOriginal: 9800
    },
    {
      id: 5,
      nombre: 'Cerco de Hormigón Premoldeado',
      precio: 1800,
      imagen: '/imagenes/cerco-hormigon.jpg',
      descripcion: 'Cerco de hormigón premoldeado, resistente y duradero para perímetros urbanos',
      categoria: 'hormigon',
      marca: 'ConcretoCerco',
      stock: 20,
      caracteristicas: ['Altura 2.00m', 'Resistente al clima', 'Fácil instalación', 'Bajo mantenimiento']
    },
    {
      id: 6,
      nombre: 'Sistema de Videovigilancia',
      precio: 4500,
      imagen: '/imagenes/camaras-seguridad.jpg',
      descripcion: 'Sistema completo de videovigilancia para cercos perimetrales con cámaras HD',
      categoria: 'seguridad',
      marca: 'SecureCam',
      stock: 12,
      caracteristicas: ['4 cámaras HD', 'Visión nocturna', 'Grabación digital', 'App móvil']
    },
    {
      id: 7,
      nombre: 'Cerco Eléctrico Residencial',
      precio: 3800,
      imagen: '/imagenes/cerco-electrico.jpg',
      descripcion: 'Sistema de cerco eléctrico para máxima seguridad perimetral residencial',
      categoria: 'electricos',
      marca: 'ElectroSafe',
      stock: 10,
      caracteristicas: ['6000V pulsantes', 'Central de alarma', '500m cobertura', 'Batería respaldo']
    },
    {
      id: 8,
      nombre: 'Puerta Peatonal Premium',
      precio: 1500,
      imagen: '/imagenes/puerta-peatonal.jpg',
      descripcion: 'Puerta peatonal metálica con cerradura de seguridad y diseño moderno',
      categoria: 'puertas',
      marca: 'MetalPro',
      stock: 18,
      caracteristicas: ['Cerradura multipunto', 'Marco reforzado', 'Manija ergonómica', 'Pintura anticorrosiva']
    }
  ];

  private categorias: CategoriaCerco[] = [
    { id: 'metalicos', nombre: 'Metálicos', cantidad: 2 },
    { id: 'mallas', nombre: 'Mallas', cantidad: 1 },
    { id: 'decorativos', nombre: 'Decorativos', cantidad: 1 },
    { id: 'portones', nombre: 'Portones', cantidad: 1 },
    { id: 'hormigon', nombre: 'Hormigón', cantidad: 1 },
    { id: 'seguridad', nombre: 'Seguridad', cantidad: 1 },
    { id: 'electricos', nombre: 'Eléctricos', cantidad: 1 },
    { id: 'puertas', nombre: 'Puertas', cantidad: 1 }
  ];

  private marcas: MarcaCerco[] = [
    { id: 'metalpro', nombre: 'MetalPro', cantidad: 2 },
    { id: 'cercoflex', nombre: 'CercoFlex', cantidad: 1 },
    { id: 'designcerco', nombre: 'DesignCerco', cantidad: 1 },
    { id: 'autogate', nombre: 'AutoGate', cantidad: 1 },
    { id: 'concretocerco', nombre: 'ConcretoCerco', cantidad: 1 },
    { id: 'securecam', nombre: 'SecureCam', cantidad: 1 },
    { id: 'electrosafe', nombre: 'ElectroSafe', cantidad: 1 }
  ];

  constructor() { }

  getCercos(): Observable<CercoPerimetral[]> {
    return of(this.cercos);
  }

  getCercosConFiltros(filtros: FiltrosCercos): Observable<CercoPerimetral[]> {
    let cercosFiltrados = [...this.cercos];

    if (filtros.categoria) {
      cercosFiltrados = cercosFiltrados.filter(cerco => cerco.categoria === filtros.categoria);
    }

    if (filtros.marca) {
      cercosFiltrados = cercosFiltrados.filter(cerco => 
        cerco.marca.toLowerCase().includes(filtros.marca!.toLowerCase())
      );
    }

    if (filtros.conPrecio) {
      cercosFiltrados = cercosFiltrados.filter(cerco => cerco.precio > 0);
    }

    if (filtros.sinPrecio) {
      cercosFiltrados = cercosFiltrados.filter(cerco => cerco.precio === 0);
    }

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      cercosFiltrados = cercosFiltrados.filter(cerco =>
        cerco.nombre.toLowerCase().includes(busqueda) ||
        cerco.descripcion.toLowerCase().includes(busqueda) ||
        cerco.caracteristicas.some(caracteristica => 
          caracteristica.toLowerCase().includes(busqueda)
        )
      );
    }

    return of(cercosFiltrados);
  }

  getCategorias(): Observable<CategoriaCerco[]> {
    return of(this.categorias);
  }

  getMarcas(): Observable<MarcaCerco[]> {
    return of(this.marcas);
  }

  getCercoPorId(id: number): Observable<CercoPerimetral | undefined> {
    const cerco = this.cercos.find(c => c.id === id);
    return of(cerco);
  }
}