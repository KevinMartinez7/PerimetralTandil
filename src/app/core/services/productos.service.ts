import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';

export interface Producto {
  id?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  precio_original?: number;
  stock: number;
  stock_minimo?: number;
  categoria: string;  // Nombre de la categoría directamente
  tipo: 'cerco' | 'rural';  // Tipo de producto
  marca?: string;  // Nombre de la marca directamente
  imagenes?: string[];  // Array de URLs de imágenes
  caracteristicas?: any;  // JSONB - características generales
  
  // Campos específicos para CERCOS PERIMETRALES
  badges?: string[];  // Ej: ['URBANO', 'METALPRO']
  caracteristicas_visuales?: string[];  // Ej: ['Altura 2m', 'Postes galvanizados', 'Malla electrosoldada', 'Garantía 10 años']
  
  en_oferta?: boolean;
  activo: boolean;
  vistas?: number;
  ventas_totales?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Categoria {
  id?: string;
  nombre: string;
  tipo: 'cerco' | 'rural';
  descripcion?: string;
}

export interface Marca {
  id?: string;
  nombre: string;
  logo_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  constructor(private supabase: SupabaseService) {}

  // PRODUCTOS
  async getProductos(tipo?: 'cerco' | 'rural') {
    console.log('📞 ProductosService.getProductos() llamado con tipo:', tipo);
    
    // IMPORTANTE: NO filtrar por activo para mostrar todos los productos en el admin
    // Los productos inactivos se mostrarán grises en la UI
    let query = this.supabase.client
      .from('productos')
      .select('*');

    if (tipo) {
      query = query.eq('tipo', tipo);
      console.log('🔍 Filtro aplicado: tipo =', tipo);
    }

    const { data, error } = await query.order('nombre');
    
    console.log('📥 Respuesta de Supabase (productos):');
    console.log('  - data:', data);
    console.log('  - error:', error);
    
    if (error) {
      console.error('❌ Error en getProductos:', error);
      // No hacer throw, devolver array vacío
      return [];
    }
    
    console.log('✅ getProductos retornando:', data);
    return data || [];
  }

  async getProductoById(id: string) {
    const { data, error } = await this.supabase.client
      .from('productos')
      .select(`
        *,
        categoria:categorias(*),
        marca:marcas(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createProducto(producto: Producto) {
    console.log('🔵 ProductosService.createProducto() iniciado');
    console.log('  → Producto a insertar:', JSON.stringify(producto, null, 2));
    
    // Limpiar el objeto para enviar solo campos definidos
    const productoLimpio: any = {
      nombre: producto.nombre,
      descripcion: producto.descripcion || null,
      precio: producto.precio,
      precio_original: producto.precio_original || null,
      stock: producto.stock,
      stock_minimo: producto.stock_minimo || 5,
      categoria: producto.categoria,
      tipo: producto.tipo,
      marca: producto.marca || null,
      imagenes: producto.imagenes || [],
      caracteristicas: producto.caracteristicas || {},
      badges: producto.badges || [],
      caracteristicas_visuales: producto.caracteristicas_visuales || [],
      en_oferta: producto.en_oferta || false,
      activo: producto.activo
    };

    console.log('  → Producto limpio a enviar:', JSON.stringify(productoLimpio, null, 2));
    
    const { data, error } = await this.supabase.client
      .from('productos')
      .insert(productoLimpio)
      .select()
      .single();

    if (error) {
      console.error('❌ Error en createProducto:', error);
      console.error('  → message:', error.message);
      console.error('  → details:', error.details);
      console.error('  → hint:', error.hint);
      console.error('  → code:', error.code);
      throw error;
    }
    
    console.log('✅ Producto creado exitosamente:', data);
    return data;
  }

  async updateProducto(id: string, producto: Partial<Producto>) {
    const { data, error } = await this.supabase.client
      .from('productos')
      .update(producto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProducto(id: string) {
    const { data, error } = await this.supabase.client
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  // CATEGORÍAS
  async getCategorias(tipo?: 'cerco' | 'rural') {
    console.log('📞 ProductosService.getCategorias() llamado con tipo:', tipo);
    
    let query = this.supabase.client
      .from('categorias')
      .select('*');

    if (tipo) {
      query = query.eq('tipo', tipo);
    }

    const { data, error } = await query.order('nombre');
    
    console.log('📥 Respuesta de Supabase:');
    console.log('  - data:', data);
    console.log('  - error:', error);
    
    if (error) {
      console.error('❌ Error en getCategorias:', error);
      throw error;
    }
    
    console.log('✅ getCategorias retornando:', data);
    return data;
  }

  async createCategoria(categoria: Categoria) {
    const { data, error } = await this.supabase.client
      .from('categorias')
      .insert(categoria)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCategoria(id: string, categoria: Partial<Categoria>) {
    const { data, error } = await this.supabase.client
      .from('categorias')
      .update(categoria)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCategoria(id: string) {
    const { data, error } = await this.supabase.client
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  // MARCAS
  async getMarcas() {
    console.log('📞 ProductosService.getMarcas() llamado');
    
    const { data, error } = await this.supabase.client
      .from('marcas')
      .select('*')
      .order('nombre');

    console.log('📥 Respuesta de Supabase (marcas):');
    console.log('  - data:', data);
    console.log('  - error:', error);

    if (error) {
      console.error('❌ Error en getMarcas:', error);
      throw error;
    }
    
    console.log('✅ getMarcas retornando:', data);
    return data;
  }

  async createMarca(marca: Marca) {
    const { data, error } = await this.supabase.client
      .from('marcas')
      .insert(marca)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateMarca(id: string, marca: Partial<Marca>) {
    const { data, error } = await this.supabase.client
      .from('marcas')
      .update(marca)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteMarca(id: string) {
    const { data, error } = await this.supabase.client
      .from('marcas')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  // BÚSQUEDA
  async searchProductos(query: string, tipo?: 'cerco' | 'rural') {
    let supabaseQuery = this.supabase.client
      .from('productos')
      .select(`
        *,
        categoria:categorias(*),
        marca:marcas(*)
      `)
      .eq('activo', true)
      .ilike('nombre', `%${query}%`);

    if (tipo) {
      supabaseQuery = supabaseQuery.eq('categorias.tipo', tipo);
    }

    const { data, error } = await supabaseQuery;
    if (error) throw error;
    return data;
  }
}
