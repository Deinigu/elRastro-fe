import { Routes } from '@angular/router';
import { InicioComponent } from './features/inicio/inicio/inicio.component';
import { BusquedaComponent } from './features/navbar/busqueda/busqueda.component';

export const routes: Routes = [
    {
        path : '',
        component : InicioComponent,
        title : 'Inicio'
     },
     {
        path : 'busqueda/:tags',
        component : BusquedaComponent,
        title : 'Busqueda'
     }
    // Empezar a poner vuestros path aqui abajo:
];
