import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HuellaCarbonoService {
  private localStorageKey = 'huellaCarbonoCache';
  private cache: { [key: string]: any } = {};

  constructor(private http: HttpClient) {
    // Cargar la caché desde el almacenamiento local al inicializar el servicio
    const cachedData = localStorage.getItem(this.localStorageKey);
    this.cache = cachedData ? JSON.parse(cachedData) : {};
  }

  getHuellaCarbono(idUsuario1: string, idUsuario2: string): Observable<any> {
    const cacheKey = `${idUsuario1}-${idUsuario2}`;
    const cachedValue = this.cache[cacheKey];
    console.log('Contenido del caché al inicializar:', this.cache);

    if (cachedValue) {
      console.log('Valor obtenido de la caché:', cachedValue);
      return of(cachedValue);
    } else {
      const url = `http://localhost:8003/api/huella/${idUsuario1}/${idUsuario2}/`;
      return this.http.get<any>(url).pipe(
        // Actualizar la caché y almacenarla en el almacenamiento local
        tap(value => {
          this.cache[cacheKey] = value.tasa_emisiones;
          localStorage.setItem(this.localStorageKey, JSON.stringify(this.cache));
        })
      );
    }
  }
}
