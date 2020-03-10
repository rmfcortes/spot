import { Producto } from 'src/app/interfaces/producto';
import { Direccion } from 'src/app/interfaces/direcciones';

export interface Pedido {
    aceptado: any;
    cliente: Direccion;
    id?: string;
    negocio: DatosNegocioParaPedido;
    productos: Producto[];
    repartidor?: Repartidor;
}
export interface Repartidor {
    nombre: string;
    telefono: string;
    foto: string;
    lat: number;
    lng: number;
    id: string;
}

export interface DatosNegocioParaPedido {
    envio: number;
    idNegocio: string;
    direccion: Direccion;
    nombreNegocio: string;
    logo: string;
    preparacion: number;
    telefono: number;
}
