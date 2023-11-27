import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  ngOnInit(): void {
    const location = { latitude: 36.71781, longitude: -4.28771 };
    this.initMap(location);
  }

  private initMap(location: { latitude: number; longitude: number }): void {
    const map = L.map('map').setView([location.latitude, location.longitude], 30);
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'  
    }).addTo(map);
  
    L.marker([location.latitude, location.longitude])
      .addTo(map)
      .bindPopup('Specified Location')
      .openPopup();
  }
  
}
