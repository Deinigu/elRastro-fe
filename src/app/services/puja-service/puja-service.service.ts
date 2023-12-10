import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Puja } from '../../interfaces/puja';

@Injectable({
  providedIn: 'root',
})
export class PujaService {
  constructor(private http: HttpClient) {}

  getUltimaPuja(idProducto: string): Observable<any> {
    const url =
      'http://localhost:8002/api/pujas/ultima_puja/producto/' +
      idProducto +
      '/';
    return this.http.get<any>(url);
  }

  createPuja(puja: Puja): Observable<Puja> {
    const url = 'http://localhost:8002/api/pujas/create/';
    return this.http.post<Puja>(url, puja);
  }

  getPujasByUser(idUser: string): Observable<any> {
    const url = 'http://localhost:8002/api/pujas/usuario/' + idUser + '/';
    return this.http.get<any>(url);
  }
}

