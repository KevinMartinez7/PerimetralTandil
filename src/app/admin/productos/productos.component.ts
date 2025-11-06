import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductosService, Producto, Categoria, Marca } from '../../core/services/productos.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  loading = true;
  showModal = false;
  editMode = false;
  
  // Filtros
  searchTerm = '';
  selectedCategoria = '';
  selectedTipo: 'cerco' | 'rural' | '' = '';

  // Image upload
  isDragging = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  uploadProgress = 0;

  // Tipo de producto seleccionado en el formulario
  selectedTipoProducto: 'cerco' | 'rural' | '' = '';

  // Producto actual para editar/crear
  currentProducto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: '',
    tipo: 'cerco',
    marca: '',
    imagenes: [],
    activo: true
  };

  constructor(
    private productosService: ProductosService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      console.log('🔄 Iniciando carga de datos...');
      
      const [productos, categorias, marcas] = await Promise.all([
        this.productosService.getProductos(),
        this.productosService.getCategorias(),
        this.productosService.getMarcas()
      ]);

      console.log('📦 Datos recibidos:');
      console.log('  - Productos:', productos);
      console.log('  - Categorías:', categorias);
      console.log('  - Marcas:', marcas);

      this.productos = productos || [];
      this.categorias = categorias || [];
      this.marcas = marcas || [];
      
      console.log('✅ Datos asignados al componente:');
      console.log('  - this.productos.length:', this.productos.length);
      console.log('  - this.categorias.length:', this.categorias.length);
      console.log('  - this.marcas.length:', this.marcas.length);
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
    } finally {
      this.loading = false;
      console.log('✓ Carga completada');
    }
  }

  get filteredCategorias() {
    console.log('🔍 Filtrando categorías:');
    console.log('  - selectedTipoProducto:', this.selectedTipoProducto);
    console.log('  - Total categorías:', this.categorias.length);
    
    if (!this.selectedTipoProducto) {
      console.log('  → Retornando todas las categorías:', this.categorias);
      return this.categorias;
    }
    
    const filtered = this.categorias.filter(cat => cat.tipo === this.selectedTipoProducto);
    console.log('  → Categorías filtradas para tipo', this.selectedTipoProducto, ':', filtered);
    return filtered;
  }

  get filteredProductos() {
    return this.productos.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchCategoria = !this.selectedCategoria || p.categoria === this.selectedCategoria;
      const matchTipo = !this.selectedTipo || p.tipo === this.selectedTipo;
      return matchSearch && matchCategoria && matchTipo;
    });
  }

  openCreateModal() {
    this.editMode = false;
    this.currentProducto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoria: '',
      tipo: 'cerco',
      marca: '',
      imagenes: [],
      activo: true
    };
    this.selectedFile = null;
    this.imagePreview = null;
    this.selectedTipoProducto = '';
    this.showModal = true;
  }

  openEditModal(producto: any) {
    this.editMode = true;
    this.currentProducto = { ...producto };
    this.imagePreview = (producto.imagenes && producto.imagenes[0]) || null;
    this.selectedFile = null;
    
    // Obtener el tipo de producto
    this.selectedTipoProducto = producto.tipo || '';
    
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.selectedTipoProducto = '';
  }

  onTipoProductoChange() {
    // Resetear la categoría seleccionada cuando cambia el tipo
    this.currentProducto.categoria = '';
    // Actualizar el tipo del producto
    this.currentProducto.tipo = this.selectedTipoProducto as 'cerco' | 'rural';
  }

  async saveProducto() {
    try {
      // Subir imagen si hay una seleccionada
      if (this.selectedFile) {
        const imageUrl = await this.uploadImage();
        if (imageUrl) {
          // Inicializar array de imágenes si no existe
          if (!this.currentProducto.imagenes) {
            this.currentProducto.imagenes = [];
          }
          // Agregar la nueva imagen al array
          this.currentProducto.imagenes.push(imageUrl);
        }
      }

      // Asegurar que el tipo esté establecido
      if (!this.currentProducto.tipo) {
        this.currentProducto.tipo = this.selectedTipoProducto as 'cerco' | 'rural';
      }

      // 🔍 DEBUG: Ver exactamente qué estamos enviando
      console.log('💾 Intentando guardar producto...');
      console.log('  → Modo:', this.editMode ? 'EDITAR' : 'CREAR');
      console.log('  → Datos:', JSON.stringify(this.currentProducto, null, 2));

      if (this.editMode && this.currentProducto.id) {
        await this.productosService.updateProducto(this.currentProducto.id, this.currentProducto);
      } else {
        await this.productosService.createProducto(this.currentProducto);
      }
      
      await this.loadData();
      this.closeModal();
      
      // Limpiar preview
      this.selectedFile = null;
      this.imagePreview = null;
    } catch (error: any) {
      console.error('❌ Error al guardar producto:', error);
      console.error('  → message:', error.message);
      console.error('  → details:', error.details);
      console.error('  → hint:', error.hint);
      console.error('  → code:', error.code);
      alert('Error al guardar el producto: ' + (error.message || 'Error desconocido'));
    }
  }

  async deleteProducto(id: string) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      await this.productosService.deleteProducto(id);
      await this.loadData();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  }

  async toggleActivo(producto: any) {
    try {
      await this.productosService.updateProducto(producto.id, {
        activo: !producto.activo
      });
      await this.loadData();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
    }
  }

  // Drag & Drop handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    this.selectedFile = file;

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.imagePreview = null;
    // Limpiar el array de imágenes si existe
    if (this.currentProducto.imagenes && this.currentProducto.imagenes.length > 0) {
      this.currentProducto.imagenes = [];
    }
  }

  async uploadImage(): Promise<string | null> {
    if (!this.selectedFile) return null;

    try {
      const fileName = `${Date.now()}-${this.selectedFile.name}`;
      const filePath = `productos/${fileName}`;

      this.uploadProgress = 0;

      // Subir archivo a Supabase Storage
      const { data, error } = await this.supabaseService.client.storage
        .from('productos-imagenes')
        .upload(filePath, this.selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      this.uploadProgress = 100;

      // Obtener URL pública
      const { data: { publicUrl } } = this.supabaseService.client.storage
        .from('productos-imagenes')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen');
      return null;
    } finally {
      setTimeout(() => {
        this.uploadProgress = 0;
      }, 1000);
    }
  }

  logout() {
    this.supabaseService.signOut();
    this.router.navigate(['/admin/login']);
  }
}
