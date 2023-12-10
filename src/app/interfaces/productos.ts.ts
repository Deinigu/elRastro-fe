export interface Producto {
    Nombre: string;
    descripcion: string;
    fotoURL: Array<string>;
    precio: number;
    tags:Array<string>;
    cierre: Date;
    vendedor: string;
}
