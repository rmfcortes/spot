export interface Mensaje {
    isMe: boolean;
    idPedido: string;
    createdAt: number;
    msg: string;
}

export interface UnreadMsg {
    idPedido: string;
    cantidad: number;
}
