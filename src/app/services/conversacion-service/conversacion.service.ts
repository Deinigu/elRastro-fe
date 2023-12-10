import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conversacion } from '../../interfaces/conversacion';

@Injectable({
  providedIn: 'root'
})
export class ConversacionService {

  constructor(private http:HttpClient) {}

    getConversacionInfo(idChat: string): Observable<any> {
        const url = 'http://localhost:8006/api/conversacion/'+ idChat;
        return this.http.get<any>(url);
    }    

  getAllConversaciones(usuarioId: string) : Observable<any> {
    const url = 'http://localhost:8006/api/conversacion/usuario/' +usuarioId;
    return this.http.get<any>(url);
  }

  enviarMensaje(idChat: string, nuevoMensaje: any): Observable<any> {
    const url = 'http://localhost:8006/api/conversacion/add_chat/' + idChat + '/';
    return this.http.post<any>(url, nuevoMensaje);
  }

  createConversacion(conversacion: Conversacion): Observable<Conversacion> {
    const url = 'http://localhost:8006/api/conversacion/create/';
    return this.http.post<Conversacion>(url, conversacion);
  }

  getConversacionDe(usuario1: string, usuario2: string) : Observable<any> {
    const url = 'http://localhost:8006/api/conversacion/id/' + usuario1 + "/" + usuario2 + "/";
    return this.http.get<any>(url);
  }
  
}