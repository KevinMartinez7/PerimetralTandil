import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  
  openMaps(): void {
    const address = 'Magallanes 1250, Tandil, Buenos Aires, Argentina';
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  }

  openWhatsApp(): void {
    const phoneNumber = '2494316864';
    const message = encodeURIComponent('Hola, me interesa obtener información sobre sus productos y servicios.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}