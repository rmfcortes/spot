export interface Producto {
    codigo: string;
    descripcion: string;
    id: string;
    nombre: string;
    pasillo: string;
    precio: number;
    unidad: string;
    url: string;
    variables: boolean;
    cantidad?: number;
    complementos?: Complemento[];
    observaciones?: string;
    total?: number;
}

export interface ListaComplementos {
    titulo: string;
    obligatorio: boolean;
    productos: Complemento[];
    elegido?: boolean;
}

export interface Complemento {
    nombre: string;
    precio: number;
}
