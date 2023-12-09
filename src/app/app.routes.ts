import { Routes } from '@angular/router';
import { InicioComponent } from './features/inicio/inicio/inicio.component';
import { ProductInfoComponent } from './features/product-info/product-info/product-info.component';
import { PujaComponent } from './features/puja/puja/puja.component';

export const routes: Routes = [
    {
        path : '',
        component : InicioComponent,
        title : 'Inicio'
    },
    // Empezar a poner vuestros path aqui abajo:
    {
        path :'producto/:id',
        component : ProductInfoComponent,
        title : 'Información del producto' 
    },

    {
        path : 'puja/:id',
        component : PujaComponent,
        title : 'Puja por un producto'
    }
];
