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
    complementos?: ComplementosElegidos[];
    cuentaComplementos?: number;
    observaciones?: string;
}

export interface Complementos {
    titulo: string;
    obligatorio: boolean;
    productos: any;
    elegido?: boolean;
}

export interface ComplementosElegidos {
    producto: string;
    precio: number;
}
