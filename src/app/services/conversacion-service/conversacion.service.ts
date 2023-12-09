import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  
}