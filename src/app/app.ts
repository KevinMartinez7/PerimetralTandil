import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
