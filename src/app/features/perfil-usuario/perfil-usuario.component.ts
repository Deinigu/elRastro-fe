import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../../services/usuario-service/usuario.service';
import { MaterialModule } from '../../material.module';
import { NavuserComponent } from '../navuser/navuser/navuser.component';
import { ActivatedRoute } from '@angular/router';
import { StarsComponent } from './stars/stars.component';
@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, MaterialModule, NavuserComponent, HttpClientModule, StarsComponent],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css',
  providers: [UsuarioService]
})

export class PerfilUsuarioComponent implements OnInit {
  title = 'Perfil de usuario';
  nombreUsuario = "";
  imagen = [''];
  idUsuario = "";
  valoracion = 0;
  ubicacion = "";
  vivienda = "";
  constructor(private http: HttpClient, private route: ActivatedRoute, private usuarioService: UsuarioService){}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idUsuario = params['id'];
    });

    this.usuarioService.getUsuarioInfo(this.idUsuario).subscribe(data => {
      this.nombreUsuario = data.nombreUsuario;
      this.valoracion = data.reputacion;
      this.vivienda = data.vivienda;
      this.imagen = data.fotoURL;
    })
  }
}

