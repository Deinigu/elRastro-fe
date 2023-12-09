import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../../services/product-service/product.service';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HttpClientModule ,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers: [UsuarioService, ProductService]
})
export class NavbarComponent {

  constructor(private http: HttpClient, private route: ActivatedRoute, private productService: ProductService, private usuarioService: UsuarioService){}

  idUsuario = "654c0a5b02d9a04cac884db7";
  idProducto = "";
  mostrarDropdown = false;
  nombreUsuario = "";

  redirectBusqueda(busqueda: {busca: string}){
    // if(busqueda.busca===null){
    //   window.location.href = `http://localhost:4200/busqueda/`;
    // }

    //LO DE ARRIBA SERÁ QUE SI ESTÁ VACÍO DEVUELVE TODOS
    
    window.location.href = `http://localhost:4200/busqueda/${busqueda.busca}`;
  }

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   this.idUsuario = params['id'];
    //   console.log(this.idUsuario);
    // });

    if(this.idUsuario !== ""){
      this.usuarioService.getUsuarioInfo(this.idUsuario).subscribe(data => {
        this.nombreUsuario = data.nombreUsuario;
      });

    this.mostrarDropdown = true;
    }
  }

  numero(n: number){
    localStorage.setItem('abrir', n.toString()); //PRUEBAS
  }
}
