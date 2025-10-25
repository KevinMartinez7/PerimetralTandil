import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-section-selector',
  standalone: true,
  templateUrl: './section-selector.component.html',
  styleUrl: './section-selector.component.scss'
})
export class SectionSelectorComponent {
  
  @Output() sectionSelected = new EventEmitter<string>();
  
  navigateToSection(section: string) {
    console.log(`Navegando a sección: ${section}`);
    this.sectionSelected.emit(section);
  }
}