import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HuellaCarbonoService {

  constructor(private http:HttpClient) { }

  getHuellaCarbono(idUsuario1: string, idUsuario2: string): Observable<any> {
    const url = 'http://localhost:8003/api/huella/'+idUsuario1+"/"+idUsuario2+"/";
    return this.http.get<any>(url);
  }
}
