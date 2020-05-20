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
    agregados?: number;
    cantidad?: number;
    idAsCart?: string;
    complementos?: ListaComplementosElegidos[];
    observaciones?: string;
    total?: number;
}

export interface ListaComplementos {
    titulo: string;
    limite: number;
    obligatorio: boolean;
    productos: Complemento[];
    elegido?: boolean;
}

export interface ListaComplementosElegidos {
    titulo: string;
    complementos: Complemento[];
}
export interface Complemento {
    nombre: string;
    precio: number;
    isChecked?: boolean;
    deshabilitado?: boolean;
}

export interface MasVendido {
    categoria: string;
    descripcion: string;
    id: string;
    idNegocio: string;
    nombre: string;
    nombreNegocio: string;
    precio: number;
    url: string;
    ventas?: number;
}
