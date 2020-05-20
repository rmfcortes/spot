export interface Tarjeta {
    name: string;
    number: string;
    cvc: string;
    exp_year: string;
    exp_month: string;
    tipo: string;
}

export interface TarjetaSafe {
    last_four: string;
    tipo: string;
}
