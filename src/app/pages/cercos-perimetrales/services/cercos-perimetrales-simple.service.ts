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
  rango?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CercosPerimetralesService {

  private cercos: CercoPerimetral[] = [
    {
      id: 1,
      nombre: 'Cerco Perimetral Residencial Premium',
      precio: 25000,
      imagen: '/imagenes/cerco-premium.jpg',
      descripcion: 'Cerco perimetral de alta calidad para residencias exclusivas. Fabricado con materiales de primera línea y acabados premium.',
      categoria: 'urbano',
      marca: 'MetalPro',
      stock: 15,
      caracteristicas: ['Altura 2m', 'Postes galvanizados', 'Malla electrosoldada', 'Garantía 10 años'],
      enOferta: true,
      precioOriginal: 30000
    },
    {
      id: 2,
      nombre: 'Cerco Perimetral Industrial',
      precio: 35000,
      imagen: '/imagenes/cerco-industrial.jpg',
      descripcion: 'Solución robusta para perímetros industriales. Resistente a impactos y condiciones adversas.',
      categoria: 'industrial',
      marca: 'IndustrialFence',
      stock: 10,
      caracteristicas: ['Altura 3m', 'Malla romboidal', 'Alambre de púa', 'Anticorrosivo']
    },
    {
      id: 3,
      nombre: 'Cerco Rural Ganadero',
      precio: 18000,
      imagen: '/imagenes/cerco-rural.jpg',
      descripcion: 'Ideal para delimitar campos y contención de ganado. Diseño específico para uso rural.',
      categoria: 'rural',
      marca: 'RuralCerco',
      stock: 25,
      caracteristicas: ['Altura variable', 'Alambre liso', 'Postes de madera', 'Fácil instalación'],
      enOferta: true,
      precioOriginal: 22000
    },
    {
      id: 4,
      nombre: 'Cerco Deportivo',
      precio: 28000,
      imagen: '/imagenes/cerco-deportivo.jpg',
      descripcion: 'Cerco especializado para canchas deportivas y espacios recreativos. Cumple normativas deportivas.',
      categoria: 'deportivo',
      marca: 'SportFence',
      stock: 8,
      caracteristicas: ['Altura 4m', 'Malla verde', 'Postes reforzados', 'Base hormigón']
    },
    {
      id: 5,
      nombre: 'Cerco Residencial Estándar',
      precio: 15000,
      imagen: '/imagenes/cerco-estandar.jpg',
      descripcion: 'Opción económica para residencias. Buena relación calidad-precio para uso doméstico.',
      categoria: 'urbano',
      marca: 'MetalPro',
      stock: 20,
      caracteristicas: ['Altura 1.8m', 'Malla simple', 'Postes estándar', 'Garantía 5 años'],
      enOferta: true,
      precioOriginal: 18000
    },
    {
      id: 6,
      nombre: 'Cerco de Seguridad Máxima',
      precio: 45000,
      imagen: '/imagenes/cerco-seguridad.jpg',
      descripcion: 'Solución de alta seguridad para instalaciones críticas. Incluye sistemas anti-intrusión.',
      categoria: 'seguridad',
      marca: 'SecureFence',
      stock: 5,
      caracteristicas: ['Altura 3.5m', 'Alambre navaja', 'Sensores', 'Certificado seguridad']
    },
    {
      id: 7,
      nombre: 'Cerco Agrícola Protección Cultivos',
      precio: 20000,
      imagen: '/imagenes/cerco-agricola.jpg',
      descripcion: 'Protección especializada para cultivos. Evita el ingreso de animales y personas no autorizadas.',
      categoria: 'agricola',
      marca: 'AgriCerco',
      stock: 12,
      caracteristicas: ['Altura 2.2m', 'Malla fina', 'Tratamiento UV', 'Resistente clima'],
      enOferta: true,
      precioOriginal: 24000
    },
    {
      id: 8,
      nombre: 'Cerco Temporal Obras',
      precio: 12000,
      imagen: '/imagenes/cerco-temporal.jpg',
      descripcion: 'Solución móvil para obras en construcción. Fácil montaje y desmontaje.',
      categoria: 'temporal',
      marca: 'TempFence',
      stock: 30,
      caracteristicas: ['Altura 2m', 'Paneles móviles', 'Base con agua', 'Reutilizable']
    }
  ];

  private categorias: CategoriaCerco[] = [
    { id: 'urbano', nombre: 'Urbanos', cantidad: 2 },
    { id: 'industrial', nombre: 'Industriales', cantidad: 1 },
    { id: 'rural', nombre: 'Rurales', cantidad: 1 },
    { id: 'deportivo', nombre: 'Deportivos', cantidad: 1 },
    { id: 'seguridad', nombre: 'Seguridad', cantidad: 1 },
    { id: 'agricola', nombre: 'Agrícolas', cantidad: 1 },
    { id: 'temporal', nombre: 'Temporales', cantidad: 1 }
  ];

  private marcas: MarcaCerco[] = [
    { id: 'metalpro', nombre: 'MetalPro', cantidad: 2 },
    { id: 'industrialfence', nombre: 'IndustrialFence', cantidad: 1 },
    { id: 'ruralcerco', nombre: 'RuralCerco', cantidad: 1 },
    { id: 'sportfence', nombre: 'SportFence', cantidad: 1 },
    { id: 'securefence', nombre: 'SecureFence', cantidad: 1 },
    { id: 'agricerco', nombre: 'AgriCerco', cantidad: 1 },
    { id: 'tempfence', nombre: 'TempFence', cantidad: 1 }
  ];

  getCercos(): Observable<CercoPerimetral[]> {
    return of(this.cercos);
  }

  getCercosConFiltros(filtros: FiltrosCercos): Observable<CercoPerimetral[]> {
    let cercosFiltrados = [...this.cercos];
    
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      cercosFiltrados = cercosFiltrados.filter(cerco =>
        cerco.nombre.toLowerCase().includes(busqueda) ||
        cerco.descripcion.toLowerCase().includes(busqueda)
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