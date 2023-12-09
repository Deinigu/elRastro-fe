import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValoracionesService {

  constructor(private http:HttpClient) {}

  getValoraciones(idUsuario: string): Observable<any> {
    const url = 'http://localhost:8007/api/valoraciones_recibidas/'+idUsuario;
    return this.http.get<any>(url);
  }

}