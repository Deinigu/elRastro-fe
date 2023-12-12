import { Component, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../../services/product-service/product.service';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { ActivatedRoute, Router, Params, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [UsuarioService, ProductService],
})
export class NavbarComponent {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private productService: ProductService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
  }

  idUsuario = '654c0a5b02d9a04cac884db7';
  idProducto = '';
  mostrarDropdown = false;
  nombreUsuario = '';
  tags = '';

  redirectInicio() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   this.idUsuario = params['id'];
    //   console.log(this.idUsuario);
    // });
    this.route.params.subscribe((params: Params) => {
      this.tags = params['tags'];
    });

    if (this.idUsuario !== '') {
      this.usuarioService.getUsuarioInfo(this.idUsuario).subscribe((data) => {
        this.nombreUsuario = data.nombreUsuario;
      });

      this.mostrarDropdown = true;
    }
  }

  redirectBusqueda(busqueda: { busca: string }) {
    if (busqueda.busca === '') {
      this.router.navigate(['/']); // Navigate to the default search route if input is empty
    }  else {
      this.router.navigate(['/busqueda', busqueda.busca]).then(() => {
        // Reload the current route to refresh the component
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/busqueda', busqueda.busca]);
        });
      });
    }
  }

  numero(n: number) {
    localStorage.setItem('abrir', n.toString()); //PRUEBAS
  }
}
