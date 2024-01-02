import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Usuario } from '../../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private localStorageKey = 'usuarioLocationCache';

  constructor(private http: HttpClient) {}

  getLocation(idUsuario: string): Observable<any> {
    const cachedData = localStorage.getItem(this.localStorageKey);
    const cache = cachedData ? JSON.parse(cachedData) : {};

    if (cache[idUsuario]) {
      console.log('Valor obtenido de la caché:', cache[idUsuario]);
      return new Observable(observer => {
        observer.next(cache[idUsuario]);
        observer.complete();
      });
    } else {
      const url = 'http://51.21.137.60:8003/api/coordenadas/' + idUsuario + '/';
      return this.http.get<any>(url).pipe(
        // Actualizar la caché y almacenarla en el almacenamiento local
        tap(data => {
          this.saveToCache(idUsuario, data);
        })
      );
    }
  }

  private saveToCache(idUsuario: string, data: any) {
    const cachedData = localStorage.getItem(this.localStorageKey);
    const cache = cachedData ? JSON.parse(cachedData) : {};
    cache[idUsuario] = data;
    localStorage.setItem(this.localStorageKey, JSON.stringify(cache));
    console.log('Contenido del caché después de la actualización:', cache);
  }

  getUsuarioInfo(idUsuario: string): Observable<any> {
    const url = 'http://51.21.137.60:8000/api/usuarios/' + idUsuario + '/';
    return this.http.get<any>(url);
  }

  getUsuarioInfoPorMail(email: string): Observable<any> {
    const url = 'http://51.21.137.60:8000/api/usuarios/email/' + email + '/';
    return this.http.get<any>(url);
  }

  editarPerfil(idUsuario: string, nuevosDatos: any): Observable<any> {
    const url = 'http://51.21.137.60:8000/api/usuarios/' + idUsuario + '/';
    return this.http.put(url, nuevosDatos);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    const url = 'http://51.21.137.60:8000/api/usuarios/';
    return this.http.post<Usuario>(url, usuario);
  }
}
