import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CercosPerimetralesService, CercoPerimetral, CategoriaCerco, MarcaCerco, FiltrosCercos } from './services/cercos-perimetrales-simple.service';

@Component({
  selector: 'app-cercos-perimetrales',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="cercos-page">
      <div class="container">
        <h1>Cercos Perimetrales</h1>
        <p>Soluciones profesionales para seguridad y estética urbana</p>
        
        <button (click)="goBack()" class="back-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Volver al Inicio
        </button>

        <!-- Sección de filtros -->
        <div class="filtros-section">
          <div class="search-container">
            <input 
              type="text" 
              placeholder="Buscar cercos..." 
              [(ngModel)]="filtros.busqueda"
              (input)="aplicarFiltros()"
              class="search-input">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>

          <div class="filters-row">
            <div class="filter-group">
              <label>Categoría:</label>
              <select [(ngModel)]="filtros.categoria" (change)="aplicarFiltros()" class="filter-select">
                <option value="">Todas las categorías</option>
                <option *ngFor="let categoria of categorias" [value]="categoria.id">
                  {{categoria.nombre}} ({{categoria.cantidad}})
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label>Marca:</label>
              <select [(ngModel)]="filtros.marca" (change)="aplicarFiltros()" class="filter-select">
                <option value="">Todas las marcas</option>
                <option *ngFor="let marca of marcas" [value]="marca.id">
                  {{marca.nombre}} ({{marca.cantidad}})
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label>Precio:</label>
              <select [(ngModel)]="filtros.rango" (change)="aplicarFiltros()" class="filter-select">
                <option value="">Todos los precios</option>
                <option value="bajo">Hasta $20.000</option>
                <option value="medio">$20.000 - $35.000</option>
                <option value="alto">Más de $35.000</option>
              </select>
            </div>

            <button (click)="limpiarFiltros()" class="clear-filters-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" stroke-width="2"/>
              </svg>
              Limpiar
            </button>
          </div>

          <div class="results-info">
            <span>{{cercosFiltrados.length}} cercos encontrados</span>
            <div class="view-options">
              <button 
                [class.active]="vistaActual === 'grid'"
                (click)="cambiarVista('grid')"
                class="view-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                  <rect x="14" y="3" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                  <rect x="3" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                  <rect x="14" y="14" width="7" height="7" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              <button 
                [class.active]="vistaActual === 'list'"
                (click)="cambiarVista('list')"
                class="view-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2"/>
                  <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/>
                  <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2"/>
                  <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2"/>
                  <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2"/>
                  <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Lista de cercos -->
        <div class="cercos-list" [class.list-view]="vistaActual === 'list'">
          <div *ngFor="let cerco of cercosFiltrados" 
               class="cerco-card" 
               [class.list-item]="vistaActual === 'list'"
               (click)="verDetalle(cerco)">
            <div class="card-image">
              <img [src]="cerco.imagen" [alt]="cerco.nombre" onerror="this.src='/imagenes/placeholder-cerco.jpg'">
              <div *ngIf="cerco.enOferta" class="offer-badge">¡Oferta!</div>
              <div class="stock-badge" [class.low-stock]="cerco.stock <= 5">
                Stock: {{cerco.stock}}
              </div>
            </div>
            <div class="card-content">
              <h3>{{ cerco.nombre }}</h3>
              <div class="tags">
                <span class="categoria">{{ cerco.categoria }}</span>
                <span class="marca">{{ cerco.marca }}</span>
              </div>
              <p>{{ cerco.descripcion }}</p>
              <div class="caracteristicas">
                <span *ngFor="let caracteristica of cerco.caracteristicas" class="caracteristica">
                  {{ caracteristica }}
                </span>
              </div>
              <div class="precio-section">
                <span *ngIf="cerco.enOferta && cerco.precioOriginal" class="precio-original">
                  {{ formatearPrecio(cerco.precioOriginal) }}
                </span>
                <span class="precio-actual" [class.precio-oferta]="cerco.enOferta">
                  {{ formatearPrecio(cerco.precio) }}
                </span>
              </div>
              <div class="card-actions">
                <button (click)="verDetalle(cerco); $event.stopPropagation()" class="detail-btn">
                  Ver Detalles
                </button>
                <button (click)="contactarPorWhatsApp(cerco); $event.stopPropagation()" class="contact-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no hay resultados -->
        <div *ngIf="cercosFiltrados.length === 0" class="no-results">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2"/>
          </svg>
          <h3>No se encontraron cercos</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
          <button (click)="limpiarFiltros()" class="reset-btn">Mostrar todos</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
    
    .cercos-page {
      min-height: 100vh;
      background: #0a0a0a;
      color: #E5E7EB;
      padding: 2rem;
      font-family: 'Rajdhani', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .cercos-page::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(ellipse 1200px 400px at 50% 0%, rgba(252, 211, 77, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse 800px 300px at 80% 100%, rgba(220, 38, 38, 0.06) 0%, transparent 50%),
        radial-gradient(ellipse 600px 200px at 20% 50%, rgba(59, 130, 246, 0.04) 0%, transparent 50%);
      z-index: 1;
      pointer-events: none;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }
    
    h1 {
      font-family: 'Orbitron', monospace;
      font-size: 3.5rem;
      font-weight: 800;
      background: linear-gradient(145deg, #FCD34D 0%, #DC2626 30%, #FCD34D 60%, #DC2626 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
      text-align: center;
      letter-spacing: 2px;
      text-shadow: 0 0 30px rgba(252, 211, 77, 0.3);
      animation: titleGlow 3s ease-in-out infinite alternate;
    }

    .cercos-page p {
      font-family: 'Rajdhani', sans-serif;
      font-size: 1.3rem;
      font-weight: 400;
      color: #9CA3AF;
      text-align: center;
      margin-bottom: 2rem;
      letter-spacing: 1px;
    }

    @keyframes titleGlow {
      0% { 
        text-shadow: 0 0 30px rgba(252, 211, 77, 0.3);
        transform: scale(1);
      }
      100% { 
        text-shadow: 0 0 40px rgba(252, 211, 77, 0.5), 0 0 60px rgba(220, 38, 38, 0.2);
        transform: scale(1.02);
      }
    }
    
    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 2rem;
      background: linear-gradient(145deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.2));
      border: 2px solid #DC2626;
      border-radius: 12px;
      color: #DC2626;
      cursor: pointer;
      margin: 1.5rem 0;
      transition: all 0.4s ease;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 1.1rem;
      letter-spacing: 1px;
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
    }
    
    .back-button:hover {
      background: linear-gradient(145deg, #DC2626, #B91C1C);
      color: white;
      transform: translateX(-5px) translateY(-2px);
      box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
      border-color: #FCD34D;
    }
    
    /* Estilos para filtros */
    .filtros-section {
      background: linear-gradient(145deg, 
        rgba(25, 25, 25, 0.95) 0%, 
        rgba(35, 35, 35, 0.9) 50%, 
        rgba(30, 30, 30, 0.95) 100%);
      border: 1px solid rgba(252, 211, 77, 0.3);
      border-radius: 20px;
      padding: 2.5rem;
      margin: 2rem 0;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 40px rgba(252, 211, 77, 0.1);
      position: relative;
      overflow: hidden;
    }

    .filtros-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent 0%, 
        #FCD34D 20%, 
        #DC2626 50%, 
        #FCD34D 80%, 
        transparent 100%);
      animation: borderFlow 3s linear infinite;
    }

    @keyframes borderFlow {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    .search-container {
      position: relative;
      margin-bottom: 2rem;
    }
    
    .search-input {
      width: 100%;
      padding: 1.25rem 1.25rem 1.25rem 3.5rem;
      background: rgba(15, 15, 15, 0.8);
      border: 2px solid rgba(252, 211, 77, 0.3);
      border-radius: 15px;
      color: #E5E7EB;
      font-size: 1.1rem;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 500;
      transition: all 0.3s ease;
      letter-spacing: 0.5px;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #FCD34D;
      box-shadow: 0 0 20px rgba(252, 211, 77, 0.3), inset 0 2px 10px rgba(0, 0, 0, 0.3);
      background: rgba(20, 20, 20, 0.9);
    }

    .search-input::placeholder {
      color: #6B7280;
      font-weight: 400;
    }
    
    .search-icon {
      position: absolute;
      left: 1.25rem;
      top: 50%;
      transform: translateY(-50%);
      color: #FCD34D;
      filter: drop-shadow(0 0 8px rgba(252, 211, 77, 0.5));
    }
    
    .filters-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1.5rem;
      align-items: end;
    }
    
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .filter-group label {
      color: #FCD34D;
      font-size: 1rem;
      font-weight: 600;
      font-family: 'Rajdhani', sans-serif;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    
    .filter-select {
      padding: 1rem;
      background: rgba(15, 15, 15, 0.8);
      border: 2px solid rgba(220, 38, 38, 0.3);
      border-radius: 10px;
      color: #E5E7EB;
      cursor: pointer;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 500;
      font-size: 1rem;
      transition: all 0.3s ease;
    }
    
    .filter-select:focus {
      outline: none;
      border-color: #DC2626;
      box-shadow: 0 0 15px rgba(220, 38, 38, 0.3);
    }

    .filter-select option {
      background: #1a1a1a;
      color: #E5E7EB;
      padding: 0.5rem;
    }
    
    .clear-filters-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      background: linear-gradient(145deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.2));
      border: 2px solid #DC2626;
      border-radius: 10px;
      color: #DC2626;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    
    .clear-filters-btn:hover {
      background: linear-gradient(145deg, #DC2626, #B91C1C);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
    }
    
    .results-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 2px solid rgba(252, 211, 77, 0.2);
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 1.1rem;
      color: #FCD34D;
      letter-spacing: 0.5px;
    }
    
    .view-options {
      display: flex;
      gap: 0.75rem;
    }
    
    .view-btn {
      padding: 0.75rem;
      background: rgba(15, 15, 15, 0.8);
      border: 2px solid rgba(59, 130, 246, 0.3);
      border-radius: 10px;
      color: #9CA3AF;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .view-btn.active,
    .view-btn:hover {
      background: linear-gradient(145deg, #3B82F6, #2563EB);
      color: white;
      border-color: #FCD34D;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
    }
    
    .cercos-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 2.5rem;
      margin-top: 2.5rem;
    }
    
    .cerco-card {
      background: linear-gradient(145deg, 
        rgba(25, 25, 25, 0.95) 0%, 
        rgba(35, 35, 35, 0.9) 50%, 
        rgba(30, 30, 30, 0.95) 100%);
      border: 1px solid rgba(252, 211, 77, 0.2);
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s ease;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      position: relative;
    }

    .cerco-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(145deg, 
        rgba(252, 211, 77, 0.05) 0%, 
        transparent 50%, 
        rgba(220, 38, 38, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
      z-index: 1;
    }
    
    .cerco-card:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: rgba(252, 211, 77, 0.5);
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.4),
        0 0 40px rgba(252, 211, 77, 0.2);
    }

    .cerco-card:hover::before {
      opacity: 1;
    }
    
    .card-image {
      position: relative;
      height: 250px;
      overflow: hidden;
      background: linear-gradient(145deg, rgba(31, 41, 55, 0.5), rgba(15, 15, 15, 0.8));
    }
    
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
      filter: brightness(0.9) contrast(1.1);
    }
    
    .cerco-card:hover .card-image img {
      transform: scale(1.08);
      filter: brightness(1) contrast(1.2);
    }
    
    .offer-badge {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      background: linear-gradient(135deg, #DC2626, #B91C1C);
      color: white;
      padding: 0.75rem 1.25rem;
      border-radius: 25px;
      font-size: 0.9rem;
      font-weight: 700;
      font-family: 'Orbitron', monospace;
      letter-spacing: 1px;
      text-transform: uppercase;
      animation: pulseOffer 2s infinite;
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.5);
      z-index: 3;
    }

    @keyframes pulseOffer {
      0%, 100% { 
        transform: scale(1);
        box-shadow: 0 4px 15px rgba(220, 38, 38, 0.5);
      }
      50% { 
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(220, 38, 38, 0.7);
      }
    }
    
    .stock-badge {
      position: absolute;
      bottom: 1.25rem;
      left: 1.25rem;
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      font-family: 'Rajdhani', sans-serif;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
      z-index: 3;
    }
    
    .stock-badge.low-stock {
      background: linear-gradient(135deg, #DC2626, #B91C1C);
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
      animation: stockAlert 1.5s infinite;
    }

    @keyframes stockAlert {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .card-content {
      padding: 2rem;
      position: relative;
      z-index: 2;
    }
    
    .card-content h3 {
      color: #E5E7EB;
      margin-bottom: 1rem;
      font-size: 1.4rem;
      font-weight: 700;
      font-family: 'Orbitron', monospace;
      letter-spacing: 1px;
      line-height: 1.3;
    }
    
    .tags {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    
    .categoria {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.3));
      color: #93C5FD;
      padding: 0.4rem 1rem;
      border-radius: 15px;
      font-size: 0.85rem;
      font-weight: 600;
      font-family: 'Rajdhani', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid rgba(59, 130, 246, 0.4);
    }
    
    .marca {
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(220, 38, 38, 0.3));
      color: #FCA5A5;
      padding: 0.4rem 1rem;
      border-radius: 15px;
      font-size: 0.85rem;
      font-weight: 600;
      font-family: 'Rajdhani', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid rgba(220, 38, 38, 0.4);
    }
    
    .card-content p {
      color: #9CA3AF;
      margin: 1.25rem 0;
      font-size: 1rem;
      line-height: 1.6;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 400;
    }
    
    .caracteristicas {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    
    .caracteristica {
      background: linear-gradient(135deg, rgba(252, 211, 77, 0.1), rgba(252, 211, 77, 0.2));
      color: #FCD34D;
      padding: 0.4rem 0.9rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
      font-family: 'Rajdhani', sans-serif;
      border: 1px solid rgba(252, 211, 77, 0.3);
      letter-spacing: 0.3px;
    }
    
    .precio-section {
      margin-bottom: 1.5rem;
    }
    
    .precio-original {
      color: #6B7280;
      text-decoration: line-through;
      font-size: 1rem;
      display: block;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .precio-actual {
      font-size: 1.5rem;
      font-weight: 700;
      color: #E5E7EB;
      font-family: 'Orbitron', monospace;
      letter-spacing: 1px;
    }
    
    .precio-actual.precio-oferta {
      background: linear-gradient(135deg, #FCD34D, #F59E0B);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 0 10px rgba(252, 211, 77, 0.5));
    }
    
    .card-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .detail-btn {
      flex: 1;
      padding: 1rem;
      background: linear-gradient(145deg, rgba(107, 114, 128, 0.1), rgba(107, 114, 128, 0.2));
      border: 2px solid #6B7280;
      border-radius: 12px;
      color: #9CA3AF;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      letter-spacing: 0.5px;
    }
    
    .detail-btn:hover {
      background: linear-gradient(145deg, #6B7280, #4B5563);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(107, 114, 128, 0.3);
    }
    
    .contact-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1rem;
      background: linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2));
      border: 2px solid #10B981;
      border-radius: 12px;
      color: #10B981;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 1rem;
      letter-spacing: 0.5px;
    }
    
    .contact-btn:hover {
      background: linear-gradient(145deg, #10B981, #059669);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }
    
    /* Vista lista */
    .cercos-list.list-view {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .cerco-card.list-item {
      display: flex;
      flex-direction: row;
      max-width: none;
      height: 200px;
    }
    
    .cerco-card.list-item .card-image {
      width: 300px;
      flex-shrink: 0;
      height: 100%;
    }
    
    .cerco-card.list-item .card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.5rem;
    }

    .cerco-card.list-item .caracteristicas {
      margin-bottom: 1rem;
    }

    .cerco-card.list-item .caracteristica {
      font-size: 0.8rem;
      padding: 0.3rem 0.7rem;
    }
    
    /* No results */
    .no-results {
      text-align: center;
      padding: 4rem 2rem;
      color: #6B7280;
      font-family: 'Rajdhani', sans-serif;
    }
    
    .no-results svg {
      margin: 0 auto 1.5rem;
      color: #4B5563;
      filter: drop-shadow(0 0 20px rgba(252, 211, 77, 0.3));
    }
    
    .no-results h3 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
      font-family: 'Orbitron', monospace;
      color: #9CA3AF;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .no-results p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    
    .reset-btn {
      margin-top: 1.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(145deg, #FCD34D, #F59E0B);
      border: none;
      border-radius: 12px;
      color: #000;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      letter-spacing: 1px;
      text-transform: uppercase;
      box-shadow: 0 6px 20px rgba(252, 211, 77, 0.3);
    }
    
    .reset-btn:hover {
      background: linear-gradient(145deg, #F59E0B, #D97706);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(252, 211, 77, 0.5);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .cercos-page {
        padding: 1rem;
      }
      
      h1 {
        font-size: 2.5rem;
      }
      
      .filtros-section {
        padding: 1.5rem;
      }
      
      .filters-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      
      .cercos-list {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      
      .results-info {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .cerco-card.list-item {
        flex-direction: column;
        height: auto;
      }

      .cerco-card.list-item .card-image {
        width: 100%;
        height: 200px;
      }
    }

    @media (max-width: 480px) {
      h1 {
        font-size: 2rem;
      }
      
      .back-button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }
      
      .card-actions {
        flex-direction: column;
        gap: 0.75rem;
      }
    }
  `]
})
export class CercosPerimetralesComponent implements OnInit {
  cercos: CercoPerimetral[] = [];
  cercosFiltrados: CercoPerimetral[] = [];
  categorias: CategoriaCerco[] = [];
  marcas: MarcaCerco[] = [];
  vistaActual: 'grid' | 'list' = 'grid';
  
  filtros: FiltrosCercos = {
    busqueda: '',
    categoria: '',
    marca: '',
    rango: ''
  };
  
  constructor(
    private router: Router,
    private cercosService: CercosPerimetralesService
  ) {}
  
  ngOnInit() {
    this.cargarDatos();
  }
  
  cargarDatos() {
    this.cargarCercos();
    this.cargarCategorias();
    this.cargarMarcas();
  }
  
  cargarCercos() {
    this.cercosService.getCercos().subscribe(data => {
      this.cercos = data;
      this.cercosFiltrados = data;
    });
  }

  cargarCategorias() {
    this.cercosService.getCategorias().subscribe(data => {
      this.categorias = data;
    });
  }

  cargarMarcas() {
    this.cercosService.getMarcas().subscribe(data => {
      this.marcas = data;
    });
  }
  
  goBack() {
    this.router.navigate(['/']);
  }
  
  aplicarFiltros() {
    let resultado = [...this.cercos];
    
    // Filtro por búsqueda
    if (this.filtros.busqueda && this.filtros.busqueda.trim() !== '') {
      const busqueda = this.filtros.busqueda.toLowerCase().trim();
      resultado = resultado.filter(cerco =>
        cerco.nombre.toLowerCase().includes(busqueda) ||
        cerco.descripcion.toLowerCase().includes(busqueda) ||
        cerco.caracteristicas.some(c => c.toLowerCase().includes(busqueda))
      );
    }
    
    // Filtro por categoría
    if (this.filtros.categoria && this.filtros.categoria !== '') {
      resultado = resultado.filter(cerco => cerco.categoria === this.filtros.categoria);
    }
    
    // Filtro por marca
    if (this.filtros.marca && this.filtros.marca !== '') {
      resultado = resultado.filter(cerco => cerco.marca.toLowerCase() === this.filtros.marca);
    }
    
    // Filtro por rango de precio
    if (this.filtros.rango && this.filtros.rango !== '') {
      resultado = resultado.filter(cerco => {
        switch (this.filtros.rango) {
          case 'bajo':
            return cerco.precio <= 20000;
          case 'medio':
            return cerco.precio > 20000 && cerco.precio <= 35000;
          case 'alto':
            return cerco.precio > 35000;
          default:
            return true;
        }
      });
    }
    
    this.cercosFiltrados = resultado;
  }
  
  limpiarFiltros() {
    this.filtros = {
      busqueda: '',
      categoria: '',
      marca: '',
      rango: ''
    };
    this.cercosFiltrados = [...this.cercos];
  }
  
  cambiarVista(vista: 'grid' | 'list') {
    this.vistaActual = vista;
  }
  
  formatearPrecio(precio: number): string {
    if (precio === 0) {
      return 'Consultar precio';
    }
    return '$' + precio.toLocaleString();
  }
  
  verDetalle(cerco: CercoPerimetral) {
    this.router.navigate(['/cercos-perimetrales/detalle', cerco.id]);
  }
  
  contactarPorWhatsApp(cerco: CercoPerimetral) {
    const mensaje = `Hola Perimetral Tandil! Me interesa el ${cerco.nombre}. Podrian darme mas informacion?`;
    const enlaceWhatsApp = `https://wa.me/2494316864?text=${encodeURIComponent(mensaje)}`;
    window.open(enlaceWhatsApp, '_blank');
  }
}