import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  profileID = null; ;
  mostrarDropdown = false;

  ngOnInit() {
    // Lógica para determinar si se debe mostrar el dropdown
    this.mostrarDropdown = this.profileID !== null ;
  }
}
