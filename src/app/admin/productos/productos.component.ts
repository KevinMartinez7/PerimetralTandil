import { Component, OnInit, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  showDeleteModal = false;
  productoToDelete: any = null;
  showSuccessModal = false;
  successMessage = '';
  
  // Filtros
  searchTerm = '';
  selectedCategoria = '';
  selectedTipo: 'cerco' | 'rural' | '' = '';

  // Image upload
  isDragging = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  uploadProgress = 0;
  
  // Múltiples imágenes para el carrusel
  imagenesCarrusel: string[] = [];
  uploadingCarrusel = false;

  // Tipo de producto seleccionado en el formulario
  selectedTipoProducto: 'cerco' | 'rural' | '' = '';

  // Campos para cercos perimetrales
  badges: string[] = [];
  newBadge: string = '';
  caracteristicasVisuales: string[] = [];
  newCaracteristica: string = '';

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
    badges: [],
    caracteristicas_visuales: [],
    activo: true
  };

  constructor(
    private productosService: ProductosService,
    private supabaseService: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Solo verificar autenticación en el navegador, no en el servidor
    if (isPlatformBrowser(this.platformId)) {
      if (!this.supabaseService.isAuthenticated()) {
        console.log('⚠️ ProductosComponent: Usuario no autenticado en navegador, redirigiendo a login');
        this.router.navigate(['/admin/login']);
      }
    }
  }

  async ngOnInit() {
    // Solo verificar autenticación en el navegador
    if (isPlatformBrowser(this.platformId)) {
      if (!this.supabaseService.isAuthenticated()) {
        console.log('⚠️ ProductosComponent.ngOnInit: Usuario no autenticado en navegador, redirigiendo a login');
        this.router.navigate(['/admin/login']);
        return;
      }
    }
    
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    this.cdr.detectChanges(); // Forzar actualización para mostrar loading
    
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
      // Forzar detección de cambios múltiples veces para asegurar renderizado
      this.cdr.detectChanges();
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 100);
      console.log('✓ Carga completada. Loading:', this.loading, 'Productos:', this.productos.length);
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
      // IMPORTANTE: Mostrar TODOS los productos (activos e inactivos)
      // Los inactivos se verán grises y deshabilitados por CSS
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
      badges: [],
      caracteristicas_visuales: [],
      activo: true
    };
    this.selectedFile = null;
    this.imagePreview = null;
    this.selectedTipoProducto = '';
    this.badges = [];
    this.caracteristicasVisuales = [];
    this.imagenesCarrusel = [];
    this.newBadge = '';
    this.newCaracteristica = '';
    this.showModal = true;
  }

  openEditModal(producto: any) {
    this.editMode = true;
    this.currentProducto = { ...producto };
    this.imagePreview = (producto.imagenes && producto.imagenes[0]) || null;
    this.selectedFile = null;
    
    // Obtener el tipo de producto
    this.selectedTipoProducto = producto.tipo || '';
    
    // Cargar badges y características visuales si existen
    this.badges = producto.badges ? [...producto.badges] : [];
    this.caracteristicasVisuales = producto.caracteristicas_visuales ? [...producto.caracteristicas_visuales] : [];
    
    // Cargar imágenes del carrusel (todas excepto la primera que es la principal)
    this.imagenesCarrusel = producto.imagenes && producto.imagenes.length > 1 
      ? [...producto.imagenes.slice(1)] 
      : [];
    
    this.newBadge = '';
    this.newCaracteristica = '';
    
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.selectedTipoProducto = '';
    this.badges = [];
    this.caracteristicasVisuales = [];
    this.imagenesCarrusel = [];
    this.newBadge = '';
    this.newCaracteristica = '';
  }

  onTipoProductoChange() {
    // Resetear la categoría seleccionada cuando cambia el tipo
    this.currentProducto.categoria = '';
    // Actualizar el tipo del producto
    this.currentProducto.tipo = this.selectedTipoProducto as 'cerco' | 'rural';
  }

  async saveProducto() {
    try {
      // Construir array completo de imágenes
      const todasLasImagenes: string[] = [];
      
      // 1. Imagen principal (obligatoria)
      if (this.selectedFile) {
        const imageUrl = await this.uploadImage();
        if (imageUrl) {
          todasLasImagenes.push(imageUrl);
        }
      } else if (this.imagePreview) {
        // Si estamos editando y no se cambió la imagen principal, mantener la existente
        todasLasImagenes.push(this.imagePreview);
      }
      
      // 2. Agregar imágenes del carrusel
      todasLasImagenes.push(...this.imagenesCarrusel);
      
      // Asignar todas las imágenes al producto
      this.currentProducto.imagenes = todasLasImagenes;

      // Asegurar que el tipo esté establecido
      if (!this.currentProducto.tipo) {
        this.currentProducto.tipo = this.selectedTipoProducto as 'cerco' | 'rural';
      }

      // Asignar badges y características visuales desde los arrays temporales
      this.currentProducto.badges = [...this.badges];
      this.currentProducto.caracteristicas_visuales = [...this.caracteristicasVisuales];

      // 🔍 DEBUG: Ver exactamente qué estamos enviando
      console.log('💾 Intentando guardar producto...');
      console.log('  → Modo:', this.editMode ? 'EDITAR' : 'CREAR');
      console.log('  → Datos:', JSON.stringify(this.currentProducto, null, 2));

      if (this.editMode && this.currentProducto.id) {
        await this.productosService.updateProducto(this.currentProducto.id, this.currentProducto);
        
        // Actualizar el producto en el array local
        const index = this.productos.findIndex(p => p.id === this.currentProducto.id);
        if (index !== -1) {
          this.productos[index] = { ...this.currentProducto };
        }
        
        this.successMessage = `Producto "${this.currentProducto.nombre}" actualizado exitosamente`;
      } else {
        const nuevoProducto = await this.productosService.createProducto(this.currentProducto);
        
        // Agregar el nuevo producto al array local
        this.productos.push(nuevoProducto);
        
        this.successMessage = `Producto "${nuevoProducto.nombre}" creado exitosamente`;
      }
      
      this.closeModal();
      
      // Limpiar preview
      this.selectedFile = null;
      this.imagePreview = null;
      
      // Mostrar modal de éxito
      this.showSuccessModal = true;
      
      // Cerrar automáticamente después de 3 segundos
      setTimeout(() => {
        this.showSuccessModal = false;
        this.cdr.detectChanges();
      }, 3000);
      
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('❌ Error al guardar producto:', error);
      console.error('  → message:', error.message);
      console.error('  → details:', error.details);
      console.error('  → hint:', error.hint);
      console.error('  → code:', error.code);
      alert('Error al guardar el producto: ' + (error.message || 'Error desconocido'));
    }
  }

  openDeleteModal(producto: any) {
    this.productoToDelete = producto;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.productoToDelete = null;
  }

  async confirmDelete() {
    if (!this.productoToDelete) return;

    try {
      const productoId = this.productoToDelete.id;
      
      await this.productosService.deleteProducto(productoId);
      
      // Eliminar del array local
      this.productos = this.productos.filter(p => p.id !== productoId);
      
      this.closeDeleteModal();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
      this.closeDeleteModal();
    }
  }

  async toggleActivo(producto: any) {
    try {
      const nuevoEstado = !producto.activo;
      
      // Actualizar en la base de datos primero
      await this.productosService.updateProducto(producto.id, {
        activo: nuevoEstado
      });
      
      // Actualizar localmente después de confirmar el guardado
      const index = this.productos.findIndex(p => p.id === producto.id);
      if (index !== -1) {
        this.productos[index].activo = nuevoEstado;
      }
      
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar el estado del producto');
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
      // Forzar detección de cambios para mostrar la imagen inmediatamente
      this.cdr.detectChanges();
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
    // Forzar detección de cambios para ocultar la imagen inmediatamente
    this.cdr.detectChanges();
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

  // Métodos para gestionar badges
  addBadge() {
    if (this.newBadge.trim() && !this.badges.includes(this.newBadge.trim().toUpperCase())) {
      this.badges.push(this.newBadge.trim().toUpperCase());
      this.newBadge = '';
    }
  }

  removeBadge(badge: string) {
    this.badges = this.badges.filter(b => b !== badge);
  }

  // Métodos para gestionar características visuales
  addCaracteristica() {
    if (this.newCaracteristica.trim() && !this.caracteristicasVisuales.includes(this.newCaracteristica.trim())) {
      this.caracteristicasVisuales.push(this.newCaracteristica.trim());
      this.newCaracteristica = '';
    }
  }

  removeCaracteristica(caracteristica: string) {
    this.caracteristicasVisuales = this.caracteristicasVisuales.filter(c => c !== caracteristica);
  }

  // Métodos para gestionar imágenes del carrusel
  async onCarruselFileSelected(event: any) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    this.uploadingCarrusel = true;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert(`El archivo ${file.name} no es una imagen válida`);
        continue;
      }

      // Validar tamaño (máx 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`La imagen ${file.name} no debe superar los 5MB`);
        continue;
      }

      try {
        const imageUrl = await this.uploadCarruselImage(file);
        if (imageUrl) {
          this.imagenesCarrusel.push(imageUrl);
          this.cdr.detectChanges();
        }
      } catch (error) {
        console.error(`Error al subir ${file.name}:`, error);
      }
    }

    this.uploadingCarrusel = false;
    this.cdr.detectChanges();
    
    // Limpiar el input para permitir seleccionar los mismos archivos nuevamente
    event.target.value = '';
  }

  async uploadCarruselImage(file: File): Promise<string | null> {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `productos/${fileName}`;

      const { data, error } = await this.supabaseService.client.storage
        .from('productos-imagenes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = this.supabaseService.client.storage
        .from('productos-imagenes')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error al subir imagen del carrusel:', error);
      return null;
    }
  }

  removeCarruselImage(index: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.imagenesCarrusel.splice(index, 1);
    this.cdr.detectChanges();
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  logout() {
    this.supabaseService.signOut();
    this.router.navigate(['/admin/login']);
  }
}
