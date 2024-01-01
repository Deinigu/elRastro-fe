import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../interfaces/usuario';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ImageService } from '../../services/image-service/image-service.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service/usuario.service';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, HttpClientModule],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css',
  providers: [UsuarioService, ImageService]
})
export class CrearUsuarioComponent {
  usuario: Usuario = {
    correo: localStorage.getItem('email'),
    fotoURL: '',
    listaConver: [],
    productosVenta: [],
    reputacion: 0,
    telefono: '',
    vivienda: '',
    nombreUsuario: '',
  };

  selectedFiles: File[] = [];
  fotos_subidas: boolean = false;
  usuario_creado: boolean = false;
  url: any = '';

  error_empty_field: boolean = false;
  error_fotos: boolean = false;
  error_general: boolean = false;
  error_telefono: boolean = false;
  usuario_en_proceso: boolean = false;
  not_iniciado: boolean = false;

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private imageService: ImageService,
    private router : Router
  ) { }

  ngOnInit(): void {

    if(localStorage.getItem('token')==null){
      this.router.navigate(['/']);
    }

    this.usuarioService.getUsuarioInfoPorMail(this.usuario.correo).subscribe((data) => {
      this.not_iniciado=false;
    }, (error) => {
      this.not_iniciado = true;
    });
      this.fotos_subidas = false;
      this.usuario_creado = false;
  }

  onSubmit() {
    
    // Reiniciar errores
    this.error_empty_field = false;
    this.error_fotos = false;
    this.error_general = false;

    if (this.usuario.nombreUsuario.length == 0 || this.usuario.vivienda.length == 0 || this.usuario.telefono.length == 0) {
      this.error_empty_field = true;
    } else if (this.usuario.telefono.length != 9 ) {
      this.error_telefono = true;
    }
    else if (!this.fotos_subidas) {
      this.error_fotos = true;
    }
    else {
      this.usuario_en_proceso = true;

      this.usuarioService.createUsuario(this.usuario).subscribe(
        (createdUsuario) => {
          console.log('Usuario creado:', createdUsuario);
          this.usuario_en_proceso = false;
          this.usuario_creado = true;
        },
        (error) => {
          console.error('Error creando usuario:', error);
          this.usuario_en_proceso = false;
          this.error_general = true;
        }
      );
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Ensure only the first file is taken
      this.selectedFiles.push(input.files[0]);
    }
  }

  onButtonClicked(): void {
    if (this.selectedFiles.length > 0) {
      this.imageService.uploadImage(this.selectedFiles).subscribe(response => {
        if (response) {
          this.url = response.urls[0];
          this.usuario.fotoURL = this.url;
          this.fotos_subidas = true;
        }
      });
    }
  }

  onButtonVolverClick() : void {
    window.location.reload();
    this.router.navigate(['/']);
  }

}
