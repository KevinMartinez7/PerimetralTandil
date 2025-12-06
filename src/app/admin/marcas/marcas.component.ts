import { Component, OnInit, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductosService, Marca } from '../../core/services/productos.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-marcas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss']
})
export class MarcasComponent implements OnInit {
  marcas: Marca[] = [];
  loading = true;
  showModal = false;
  editMode = false;
  showDeleteModal = false;
  marcaToDelete: any = null;
  showSuccessModal = false;
  successMessage = '';
  
  // Filtros
  searchTerm = '';
  filterTipo: 'todas' | 'cerco' | 'rural' | 'ambas' = 'todas';

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;

  // Marca actual para editar/crear
  currentMarca: Marca = {
    nombre: '',
    tipo: 'ambas',
    logo_url: ''
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
        console.log('⚠️ MarcasComponent: Usuario no autenticado, redirigiendo a login');
        this.router.navigate(['/admin/login']);
      }
    }
  }

  async ngOnInit() {
    // Solo verificar autenticación en el navegador
    if (isPlatformBrowser(this.platformId)) {
      if (!this.supabaseService.isAuthenticated()) {
        console.log('⚠️ MarcasComponent.ngOnInit: Usuario no autenticado, redirigiendo a login');
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
      console.log('🔄 Cargando marcas...');
      const marcas = await this.productosService.getMarcas();
      this.marcas = marcas || [];
      console.log('✅ Marcas cargadas:', this.marcas.length);
    } catch (error) {
      console.error('❌ Error al cargar marcas:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  get filteredMarcas() {
    return this.marcas.filter(marca => {
      const matchSearch = marca.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchTipo = this.filterTipo === 'todas' || marca.tipo === this.filterTipo;
      return matchSearch && matchTipo;
    });
  }

  get totalPages() {
    return Math.ceil(this.filteredMarcas.length / this.itemsPerPage);
  }

  get paginatedMarcas() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredMarcas.slice(startIndex, endIndex);
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
    this.currentMarca = {
      nombre: '',
      tipo: 'ambas',
      logo_url: ''
    };
    this.showModal = true;
  }

  openEditModal(marca: Marca) {
    this.editMode = true;
    this.currentMarca = { ...marca };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.currentMarca = {
      nombre: '',
      tipo: 'ambas',
      logo_url: ''
    };
  }

  async saveMarca() {
    try {
      if (!this.currentMarca.nombre.trim()) {
        alert('El nombre de la marca es obligatorio');
        return;
      }

      // Generar slug automáticamente desde el nombre
      const slug = this.currentMarca.nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres especiales con guiones
        .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final
      
      this.currentMarca.slug = slug;
      
      // Asegurar que tipo tenga un valor válido
      if (!this.currentMarca.tipo) {
        this.currentMarca.tipo = 'ambas';
      }

      console.log('💾 Guardando marca:', this.currentMarca);

      if (this.editMode && this.currentMarca.id) {
        await this.productosService.updateMarca(this.currentMarca.id, this.currentMarca);
        
        // Actualizar en el array local
        const index = this.marcas.findIndex(m => m.id === this.currentMarca.id);
        if (index !== -1) {
          this.marcas[index] = { ...this.currentMarca };
        }
        
        this.successMessage = `Marca "${this.currentMarca.nombre}" actualizada exitosamente`;
      } else {
        const nuevaMarca = await this.productosService.createMarca(this.currentMarca);
        
        // Agregar al array local
        this.marcas.push(nuevaMarca);
        
        this.successMessage = `Marca "${nuevaMarca.nombre}" creada exitosamente`;
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
      console.error('❌ Error al guardar marca:', error);
      alert('Error al guardar la marca: ' + (error.message || 'Error desconocido'));
    }
  }

  openDeleteModal(marca: Marca) {
    if (!marca || !marca.id) {
      console.error('❌ Marca inválida para eliminar:', marca);
      return;
    }
    this.marcaToDelete = { ...marca };
    this.showDeleteModal = true;
    console.log('🗑️ Modal de eliminación abierto para:', this.marcaToDelete);
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.marcaToDelete = null;
  }

  async confirmDelete() {
    console.log('🔄 confirmDelete iniciado. marcaToDelete:', this.marcaToDelete);
    
    if (!this.marcaToDelete || !this.marcaToDelete.id) {
      console.error('❌ No hay marca seleccionada para eliminar');
      alert('Error: No se ha seleccionado una marca válida para eliminar');
      this.closeDeleteModal();
      return;
    }

    try {
      const marcaId = this.marcaToDelete.id;
      const marcaNombre = this.marcaToDelete.nombre;
      
      console.log('🗑️ Eliminando marca:', marcaId, marcaNombre);
      
      await this.productosService.deleteMarca(marcaId);
      
      // Eliminar del array local
      this.marcas = this.marcas.filter(m => m.id !== marcaId);
      
      this.closeDeleteModal();
      
      this.successMessage = `Marca "${marcaNombre}" eliminada exitosamente`;
      this.showSuccessModal = true;
      
      setTimeout(() => {
        this.showSuccessModal = false;
        this.cdr.detectChanges();
      }, 3000);
      
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('❌ Error al eliminar marca:', error);
      alert('Error al eliminar la marca: ' + (error.message || 'Puede que tenga productos asociados'));
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
