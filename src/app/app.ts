import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { SectionSelectorComponent } from './components/section-selector/section-selector.component';
import { CompanyInfoComponent } from './components/company-info/company-info.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    HeroComponent,
    SectionSelectorComponent,
    CompanyInfoComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Perimetral Tandil');

  constructor(private router: Router) {}

  navigateToSection(section: string) {
    console.log(`Navegando a la sección: ${section}`);
    // Aquí podrías agregar la lógica de navegación cuando tengas las rutas configuradas
    // this.router.navigate([`/${section}`]);
    
    // Por ahora, solo mostramos un alert para demostración
    if (section === 'cercos') {
      alert('Próximamente: Sección de Cercos Perimetrales para Ciudad');
    } else if (section === 'rurales') {
      alert('Próximamente: Sección de Artículos Rurales');
    }
  }
}
