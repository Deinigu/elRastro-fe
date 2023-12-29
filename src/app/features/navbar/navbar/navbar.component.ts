import { Component, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../../services/product-service/product.service';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { ActivatedRoute, Router, Params, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { OauthService } from '../../../services/oauth-service/oauth-service.service';
import { OauthComponent } from '../../oauth/oauth.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, OauthComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [UsuarioService, ProductService, OauthService],
})
export class NavbarComponent {
  constructor(
    private authService: SocialAuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private productService: ProductService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
  }

  idUsuario = '';
  idProducto = '';
  mostrarDropdown = false;
  nombreUsuario = '';
  tags = '';
  loggedIn : any;
  token = localStorage.getItem("token");
  email = localStorage.getItem("email");

  redirectInicio() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.tags = params['tags'];
    });

    if(this.token!=null && this.token!=undefined){
      this.loggedIn = true;
    }

    //ESTO HAY Q CAMBIARLO A QUE BUSQUE POR TOKEN
    if (this.loggedIn && this.email!=null) {
      this.usuarioService.getUsuarioInfoPorMail(this.email).subscribe((data) => {
        this.idUsuario = data._id;
        localStorage.setItem('iduser', this.idUsuario);
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

  signOut(): void{
    this.authService.signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("photoUrl");
    localStorage.removeItem('iduser');
    location.reload();
  }
}
