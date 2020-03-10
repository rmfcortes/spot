export interface Mensaje {
    isMe: boolean;
    idPedido: string;
    idRepartidor: string;
    createdAt: number;
    msg: string;
}

export interface UnreadMsg {
    idPedido: string;
    cantidad: number;
}
