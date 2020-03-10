export interface PasilloServicio {
    nombre: string;
    servicios: Servicio[];
}

export interface Servicio {
    codigo?: string;
    descripcion: string;
    id: string;
    nombre: string;
    pasillo: string;
    url: string;
    precio?: number;
}

