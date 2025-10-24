import { Component } from '@angular/core';

@Component({
  selector: 'app-section-selector',
  standalone: true,
  templateUrl: './section-selector.component.html',
  styleUrl: './section-selector.component.scss'
})
export class SectionSelectorComponent {
  
  navigateToSection(section: string) {
    console.log(`Navegando a sección: ${section}`);
    // Aquí se implementará la navegación cuando se configure el routing
  }
}