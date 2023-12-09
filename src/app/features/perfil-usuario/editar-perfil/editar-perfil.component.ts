import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
  providers: [UsuarioService],
})
export class EditarPerfilComponent implements OnInit {
  idUsuario = '';
  nuevosDatos: any = {};
  nombreUsuario: string | undefined;
  correo: string | undefined;
  telefono: string | undefined;
  vivienda: string | undefined;
  imagen: string | undefined;

  constructor(private http: HttpClient, private route: ActivatedRoute, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.idUsuario = params['id'];
      console.log('ID del usuario:', this.idUsuario);
    });

    this.usuarioService.getUsuarioInfo(this.idUsuario).subscribe((usuario: any) => {
      this.nuevosDatos = usuario;
    });
  }

  guardarCambios() {
    this.usuarioService.editarPerfil(this.idUsuario, this.nuevosDatos)
      .subscribe(
        (respuesta) => {
          console.log('Perfil actualizado con éxito:', respuesta);
          this.router.navigate(['/usuario/' + this.idUsuario]);
        },
        (error) => {
          console.error('Error al actualizar el perfil:', error);
        });
  }  
  }
