import { Producto } from './producto';

export interface Negocio {
    abierto: boolean;
    foto: string;
    id: string;
    nombre: string;
    rate: number;
    subCategoria: string;
    tipo: string;
    valoraciones: number;
}

export interface DetallesNegocio {
    descripcion: string;
    direccion: string;
    lat: number;
    lng: number;
    telefono: number;
    horario: Horario[];
}

export interface ProductoPasillo {
    nombre: string;
    productos: Producto[];
}

export interface DatosParaCuenta {
    logo: string;
    idNegocio: string;
    nombreNegocio: string;
    categoria: string;
    abierto?: boolean;
}

export interface Horario {
    activo: boolean;
    dia: string;
    corrido?: boolean;
    horaApertura: string;
    horaCierre: string;
}

export interface NegocioInfo {
    datos: DatosParaCuenta;
    detalles: DetallesNegocio;
    status: string;
}

export interface Oferta {
    categoria: string;
    foto: string;
    id: string;
    idNegocio: string;
    abierto: boolean;
}

export interface InfoPasillos {
    pasillos: Pasillo[];
    vista: string;
    portada: string;
    telefono?: string;
    whats?: string;
}

export interface Pasillo {
    nombre: string;
    prioridad: number;
}

export interface InfoGral {
    abierto: boolean;
    categoria: string;
    foto: string;
    idNegocio: string;
    nombre: string;
    subCategoria: string;
}

export interface NegocioBusqueda{
    foto: string;
    idNegocio: string;
    nombre: string;
    palabras: string;
}

export interface visistasNegocio {
    idNegocio: string;
    visitas: number
}
