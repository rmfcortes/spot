export interface Direccion {
    direccion: string;
    lat: number;
    lng: number;
    id?: string;
}

export interface Entrega {
    cliente: Direccion;
    negocio: Direccion;
}

export interface Repartidor {
    nombre: string;
    telefono: string;
    foto: string;
    lat: number;
    lng: number;
    id: string;
}

