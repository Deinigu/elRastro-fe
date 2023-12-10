import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario-service/usuario.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule,CommonModule, FormsModule, RouterModule, HttpClientModule],
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

  editarPerfilForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private usuarioService: UsuarioService, private router: Router) {
    this.editarPerfilForm = this.formBuilder.group({
      nombreUsuario: ['', Validators.required],
      vivienda: ['', [Validators.required, this.direccionValidator()]],
      telefono: ['', Validators.required],
    });
   }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.idUsuario = params['id'];
      console.log('ID del usuario:', this.idUsuario);
    });

    this.usuarioService.getUsuarioInfo(this.idUsuario).subscribe((usuario: any) => {
      this.nuevosDatos = usuario;
  
        this.editarPerfilForm = this.formBuilder.group({
          nombreUsuario: [this.nuevosDatos.nombreUsuario, Validators.required],
          vivienda: [this.nuevosDatos.vivienda, [Validators.required, this.direccionValidator()]],
          telefono: [this.nuevosDatos.telefono, Validators.required],
        });
      },
      (error) => console.error('Error al obtener información del usuario:', error)
    );
  }
  direccionValidator() {
    return Validators.pattern(/^[\w\s.,\/]+\/\d{5}\/[\w\s.,\/]+$/);
  }

  guardarCambios() {
    const nuevosDatosFormulario = {
      nombreUsuario: this.editarPerfilForm.get('nombreUsuario')?.value,
      vivienda: this.editarPerfilForm.get('vivienda')?.value,
      telefono: this.editarPerfilForm.get('telefono')?.value,
    };
    const nuevosDatosActualizados = {
      ...this.nuevosDatos,  
      ...nuevosDatosFormulario,   
    };
  
    this.usuarioService.editarPerfil(this.idUsuario, nuevosDatosActualizados)
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
