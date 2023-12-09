import { Routes } from '@angular/router';
import { InicioComponent } from './features/inicio/inicio/inicio.component';
import { ProductInfoComponent } from './features/product-info/product-info/product-info.component';
import { CrearProductoComponent } from './features/crear-producto/crear-producto.component';

export const routes: Routes = [
    {
        path : '',
        component : InicioComponent,
        title : 'Inicio'
    },
    // Empezar a poner vuestros path aqui abajo:
    {
        path: 'producto/crear',
        component : CrearProductoComponent,
        title: 'Crear producto'
    },
    {
        path :'producto/:id',
        component : ProductInfoComponent,
        title : 'Información del producto' 
    }

];
