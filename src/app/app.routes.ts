import { Routes } from '@angular/router';
import { InicioComponent } from './features/inicio/inicio/inicio.component';
import { PerfilUsuarioComponent } from './features/perfil-usuario/perfil-usuario.component';
import { LoginComponent } from './features/login/login/login.component';
import { ChatsComponent } from './features/chats/chats/chats.component';
import { MischatsComponent } from './features/chats/mischats/mischats.component';
import { ValoracionComponent } from './features/valoracion/valoracion.component';
import { StarRatingComponent } from './features/valoracion/star-rating/star-rating.component';
import { EditarPerfilComponent } from './features/perfil-usuario/editar-perfil/editar-perfil.component';
import { BusquedaComponent } from './features/navbar/busqueda/busqueda.component';
import { ProductInfoComponent } from './features/product-info/product-info/product-info.component';
import { CrearProductoComponent } from './features/crear-producto/crear-producto.component';
import { PujaComponent } from './features/puja/puja/puja.component';
import { EditarProductoComponent } from './features/editar-producto/editar-producto.component';
import { FotoperfilComponent } from './features/fotoperfil/fotoperfil.component';
import { CrearUsuarioComponent } from './features/crear-usuario/crear-usuario.component';

export const routes: Routes = [
    {
        path: '',
        component: InicioComponent,
        title: 'Inicio'
    },
    // Empezar a poner vuestros path aqui abajo:
    {
        path: 'producto/crear',
        component: CrearProductoComponent,
        title: 'Crear producto'
    },
    {
        path: 'producto/editar/:id',
        component: EditarProductoComponent,
        title: 'Información del producto'
    },
    {
        path: 'producto/:id',
        component: ProductInfoComponent,
        title: 'Información del producto'
    },
    {

        path: 'usuario/cambiarimagen/:id',
        component: FotoperfilComponent,
        title: 'Foto de perfil'
    },
    {

        path: 'usuario/crear',
        component: CrearUsuarioComponent,
        title: 'Crear un usuario'
    },
    {

        path: 'usuario/:id',
        component: PerfilUsuarioComponent,
        title: 'Perfil de usuario'
    },
    {
        path: 'iniciarsesion',
        component: LoginComponent,
        title: 'Inicio de sesión'
    },
    {
        path: 'chats/:idChat',
        component: ChatsComponent,
        title: 'Chat privado'
    },
    {
        path: 'usuario/:id/chats',
        component: MischatsComponent,
        title: 'Mis chats'
    },
    {
        path: 'usuario/:id/valoracion',
        component: ValoracionComponent,
        title: 'Valoracion'
    },
    {
        path: 'usuario/:id/star',
        component: StarRatingComponent,
        title: 'EJEMPLO ESTRELLAS'
    },
    {
        path: 'editar-perfil/:id',
        component: EditarPerfilComponent,
        title: 'Editar Perfil'
    },

    {
        path: 'puja/:id',
        component: PujaComponent,
        title: 'Puja por un producto'
    },
    {
        path: 'busqueda/:tags',
        component: BusquedaComponent,
        title: 'Busqueda'
    }
];
