import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) {}

  getLocation(idUsuario: string): Observable<any> {
    const url = 'http://localhost:8003/api/coordenadas/'+idUsuario+"/";
    return this.http.get<any>(url);
  }

  getUsuarioInfo(idUsuario: string): Observable<any> {
    const url = 'http://localhost:8000/api/usuarios/'+idUsuario+"/";
    return this.http.get<any>(url);
  }
}