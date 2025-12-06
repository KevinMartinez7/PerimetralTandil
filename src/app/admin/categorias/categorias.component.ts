import { Component, OnInit, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductosService, Categoria } from '../../core/services/productos.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = true;
  showModal = false;
  editMode = false;
  showDeleteModal = false;
  categoriaToDelete: any = null;
  showSuccessModal = false;
  successMessage = '';
  
  // Filtros
  searchTerm = '';
  selectedTipo: 'cerco' | 'rural' | '' = '';

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;

  // Categoría actual para editar/crear
  currentCategoria: Categoria = {
    nombre: '',
    tipo: 'cerco',
    descripcion: ''
  };

  constructor(
    private productosService: ProductosService,
    private supabaseService: SupabaseService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Solo verificar autenticación en el navegador
    if (isPlatformBrowser(this.platformId)) {
      if (!this.supabaseService.isAuthenticated()) {
        console.log('⚠️ CategoriasComponent: Usuario no autenticado, redirigiendo a login');
        this.router.navigate(['/admin/login']);
      }
    }
  }

  async ngOnInit() {
    // Solo verificar autenticación en el navegador
    if (isPlatformBrowser(this.platformId)) {
      if (!this.supabaseService.isAuthenticated()) {
        console.log('⚠️ CategoriasComponent.ngOnInit: Usuario no autenticado, redirigiendo a login');
        this.router.navigate(['/admin/login']);
        return;
      }
    }
    
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    this.cdr.detectChanges();
    
    try {
      console.log('🔄 Cargando categorías...');
      const categorias = await this.productosService.getCategorias();
      this.categorias = categorias || [];
      console.log('✅ Categorías cargadas:', this.categorias.length);
    } catch (error) {
      console.error('❌ Error al cargar categorías:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  get filteredCategorias() {
    return this.categorias.filter(cat => {
      const matchSearch = cat.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchTipo = !this.selectedTipo || cat.tipo === this.selectedTipo;
      return matchSearch && matchTipo;
    });
  }

  get totalPages() {
    return Math.ceil(this.filteredCategorias.length / this.itemsPerPage);
  }

  get paginatedCategorias() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCategorias.slice(startIndex, endIndex);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1);
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(this.currentPage - 1);
        pages.push(this.currentPage);
        pages.push(this.currentPage + 1);
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  openCreateModal() {
    this.editMode = false;
    this.currentCategoria = {
      nombre: '',
      tipo: 'cerco',
      descripcion: ''
    };
    this.showModal = true;
  }

  openEditModal(categoria: Categoria) {
    this.editMode = true;
    this.currentCategoria = { ...categoria };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentCategoria = {
      nombre: '',
      tipo: 'cerco',
      descripcion: ''
    };
  }

  async saveCategoria() {
    try {
      if (!this.currentCategoria.nombre.trim()) {
        alert('El nombre de la categoría es obligatorio');
        return;
      }

      // Generar slug automáticamente desde el nombre
      const slug = this.currentCategoria.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
        .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final
      
      this.currentCategoria.slug = slug;

      console.log('💾 Guardando categoría:', this.currentCategoria);

      if (this.editMode && this.currentCategoria.id) {
        await this.productosService.updateCategoria(this.currentCategoria.id, this.currentCategoria);
        
        // Actualizar en el array local
        const index = this.categorias.findIndex(c => c.id === this.currentCategoria.id);
        if (index !== -1) {
          this.categorias[index] = { ...this.currentCategoria };
        }
        
        this.successMessage = `Categoría "${this.currentCategoria.nombre}" actualizada exitosamente`;
      } else {
        const nuevaCategoria = await this.productosService.createCategoria(this.currentCategoria);
        
        // Agregar al array local
        this.categorias.push(nuevaCategoria);
        
        this.successMessage = `Categoría "${nuevaCategoria.nombre}" creada exitosamente`;
      }
      
      this.closeModal();
      
      // Mostrar modal de éxito
      this.showSuccessModal = true;
      
      // Cerrar automáticamente después de 3 segundos
      setTimeout(() => {
        this.showSuccessModal = false;
        this.cdr.detectChanges();
      }, 3000);
      
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('❌ Error al guardar categoría:', error);
      alert('Error al guardar la categoría: ' + (error.message || 'Error desconocido'));
    }
  }

  openDeleteModal(categoria: Categoria) {
    this.categoriaToDelete = categoria;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.categoriaToDelete = null;
  }

  async confirmDelete() {
    if (!this.categoriaToDelete) return;

    try {
      const categoriaId = this.categoriaToDelete.id;
      
      await this.productosService.deleteCategoria(categoriaId);
      
      // Eliminar del array local
      this.categorias = this.categorias.filter(c => c.id !== categoriaId);
      
      this.closeDeleteModal();
      
      this.successMessage = `Categoría "${this.categoriaToDelete.nombre}" eliminada exitosamente`;
      this.showSuccessModal = true;
      
      setTimeout(() => {
        this.showSuccessModal = false;
        this.cdr.detectChanges();
      }, 3000);
      
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('Error al eliminar categoría:', error);
      alert('Error al eliminar la categoría: ' + (error.message || 'Puede que tenga productos asociados'));
      this.closeDeleteModal();
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  logout() {
    this.supabaseService.signOut();
    this.router.navigate(['/admin/login']);
  }
}
