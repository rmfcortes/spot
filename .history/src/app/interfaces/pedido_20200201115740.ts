import { Producto } from 'src/app/interfaces/producto';
import { Direccion } from 'src/app/interfaces/direcciones';

export interface Pedido {
    id: string;
    productos: Producto[];
    cliente: Direccion;
    negocio: Direccion;
    repartidor: Repartidor;
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
}
