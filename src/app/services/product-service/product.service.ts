import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../interfaces/productos.ts';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) {}

  getProductInfo(idProducto: string): Observable<any> {

    const url = 'https://13.38.223.212:8001/api/productos/'+idProducto + '/';
    return this.http.get<any>(url);
  }

  getAllProducts() : Observable<any> {
    const url = 'https://13.38.223.212:8001/api/productos/';
    return this.http.get<any>(url);
  }

  createProducto(producto: Producto): Observable<Producto> {
    const url = 'https://13.38.223.212:8001/api/productos/';
    return this.http.post<Producto>(url, producto);
  }
  
  getSearchProducts(tags : string) : Observable<any> {
    const url = 'https://13.38.223.212:8001/api/productos/busqueda/' +tags;
    return this.http.get<any>(url);
  }
  editProducto(idProducto : string, producto: Producto): Observable<any> {
    const url = "https://13.38.223.212:8001/api/productos/" + idProducto + "/";
    return this.http.put(url, producto);
  }
  deleteProducto(productoID: string): Observable<any> {
    const url = 'https://13.38.223.212:8001/api/productos/'+productoID + "/";
    return this.http.delete<any>(url);
  }
}



  

