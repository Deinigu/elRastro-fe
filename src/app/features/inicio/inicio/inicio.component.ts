import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent {
  productos = [
    {
      Nombre: 'manolo',
      descripcion: 'soy manolo',
      fotoURL: 'https://i.imgur.com/PIOafIe.jpeg',
    },
    {
      Nombre: 'paco',
      descripcion: 'soy paco',
      fotoURL: 'https://i.imgur.com/EnNBJtR.jpeg',
    },
    {
      Nombre: 'sapo',
      descripcion: 'soy sapo',
      fotoURL: 'https://i.imgur.com/yz6eVNk.jpeg',
    },
  ];
}
