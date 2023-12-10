import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as L from 'leaflet';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product-service/product.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  providers: [UsuarioService, ProductService]
})
export class MapComponent implements OnInit{
  idUsuario = "";
  idProducto = "";
  location = {latitude: 0, longitude: 0};

  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService, private usuarioService: UsuarioService){}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idProducto = params['id'];
    });

    this.productService.getProductInfo(this.idProducto).subscribe(data1 => {
      this.idUsuario = data1.vendedor;

      this.usuarioService.getLocation(this.idUsuario).subscribe(data2 => {
        this.location = {latitude: data2.latitud, longitude: data2.longitud};
        this.initMap(this.location);
      })
      
    })
  }

  private initMap(location: { latitude: number; longitude: number }): void {
    const map = L.map('map').setView([location.latitude, location.longitude], 200);
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 15,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'  
    }).addTo(map);
  
    /*L.marker([location.latitude, location.longitude])
      .addTo(map)
      .openPopup();*/

      L.circle([location.latitude, location.longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
      }).addTo(map);
  }
  
}
