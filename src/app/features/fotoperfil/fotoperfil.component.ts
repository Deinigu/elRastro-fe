import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario-service/usuario.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from '../../services/image-service/image-service.service';

@Component({
  selector: 'app-fotoperfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fotoperfil.component.html',
  styleUrl: './fotoperfil.component.css',
  providers: [UsuarioService, ImageService],
})
export class FotoperfilComponent implements OnInit {
  idUsuario: any;
  datos: any = {};
  url: any = '';
  selectedFiles: File[] = [];
  foto_subida: boolean = false;
  error: boolean = false;
  error_no_hay_imagen: boolean = false;


  constructor(private http: HttpClient, private route: ActivatedRoute, private usuarioService: UsuarioService, private imageService: ImageService, private router: Router) { }

  ngOnInit(): void {
    this.foto_subida = false;
    this.route.params.subscribe((params: any) => {
      this.idUsuario = params['id'];
      console.log('ID del usuario:', this.idUsuario);
    });

    this.usuarioService.getUsuarioInfo(this.idUsuario).subscribe((usuario: any) => {
      this.datos = usuario;
      console.log(this.datos);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Ensure only the first file is taken
      this.selectedFiles.push(input.files[0]);
    }
  }

  onButtonClicked(): void {
    this.foto_subida = false;
    this.error = false;
    this.error_no_hay_imagen = false;
    if (this.selectedFiles.length > 0) {
      this.imageService.uploadImage(this.selectedFiles).subscribe(response => {
        if (response) {
          console.log(response);
          this.url = response.urls[0];

          this.datos.fotoURL = this.url;
          this.usuarioService.editarPerfil(this.idUsuario, this.datos)
            .subscribe(
              (respuesta) => {
                console.log('Perfil actualizado con éxito:', respuesta);
                this.foto_subida = true;
              },
              (error) => {
                console.error('Error al actualizar el perfil:', error);
                this.error = true;
              });
        }
      });
    }
    else {
      this.error_no_hay_imagen = true;
    }
  }

  onButtonVolverClicked()
  {
    this.router.navigate(['/usuario/' + this.idUsuario]);

  }


  guardarCambios() {

  }

}
