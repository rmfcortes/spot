import { Producto } from 'src/app/interfaces/producto';
import { Direccion } from './direcciones';

export interface Pedido {
    aceptado: any;
    cliente: Cliente;
    id?: string;
    negocio: DatosNegocioParaPedido;
    productos: Producto[];
    repartidor?: Repartidor;
    total: number;
}

export interface Repartidor {
    nombre: string;
    telefono: string;
    foto: string;
    lat: number;
    lng: number;
    id: string;
}

export interface Cliente {
    direccion: Direccion;
    nombre: string;
    telefono?: string;
}


export interface DatosNegocioParaPedido {
    envio: number;
    idNegocio: string;
    direccion: Direccion;
    nombreNegocio: string;
    logo: string;
    telefono: number;
}
