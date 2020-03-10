import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Mensaje } from '../interfaces/chat.interface';
import { UidService } from './uid.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  uid: string;

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }


  listenMsg() {
    const idCliente = this.uidService.getUid();
    return this.db.list(`usuarios/${idCliente}/chat/unread`).valueChanges();
  }

  listenMsgPedido(idPedido) {
    const idCliente = this.uidService.getUid();
    return this.db.object(`usuarios/${idCliente}/chat/unread/${idPedido}`).valueChanges();
  }


  // Anteriores

  // listenMsg(idRepartidor, idPedido) {
  //   return this.db.list(`usuarios/${this.uid}/chat/${idPedido}/${idRepartidor}/mensajes`);
  // }

  publicarMsg(msg: Mensaje, idRepartidor, idPedido) {
    this.db.list(`usuarios/${this.uid}/chat/${idPedido}/${idRepartidor}/mensajes`).push(msg);
  }

  setSeen(idRepartidor, idPedido) {
    this.uid = this.uidService.getUid();
    this.db.object(`usuarios/${this.uid}/chat/${idPedido}/${idRepartidor}/msgPend`).remove();
  }

  // newMsg(idRepartidor, idPedido) {
  //   this.uid = this.uidService.getUid();
  //   return this.db.object(`usuarios/${this.uid}/chat/${idPedido}/${idRepartidor}/msgPend`).valueChanges();
  // }

  listenStatus(idRepartidor, idPedido) {
    return this.db.object(`usuarios/${this.uid}/chat/${idPedido}/${idRepartidor}/status`).valueChanges();
  }

  listenNoti(idRepartidor, idPedido) {
    return this.db.object(`usuarios/${this.uid}/chat/${idPedido}/${idRepartidor}/mensajes`).valueChanges();
  }

}
