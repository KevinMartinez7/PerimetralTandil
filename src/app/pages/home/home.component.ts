import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { SectionSelectorComponent } from '../../components/section-selector/section-selector.component';
import { CompanyInfoComponent } from '../../components/company-info/company-info.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    SectionSelectorComponent,
    CompanyInfoComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToSection(section: string) {
    console.log(`Navegando a la sección: ${section}`);
    
    if (section === 'cercos') {
      alert('Próximamente: Sección de Cercos Perimetrales para Ciudad');
    } else if (section === 'rurales') {
      this.router.navigate(['/articulos-rurales']);
    }
  }
}