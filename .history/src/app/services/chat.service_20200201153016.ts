import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { UidService } from './uid.service';
import { Mensaje } from '../interfaces/chat.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  uid: string;

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  listenMsg(idVendedor) {
    return this.db.list(`usuarios/${this.uid}/chat/${idVendedor}/mensajes`);
  }

  publicarMsg(msg: Mensaje, idVendedor) {
    this.db.list(`usuarios/${this.uid}/chat/${idVendedor}/mensajes`).push(msg);
  }

  setSeen(idVendedor) {
    this.uid = this.uidService.getUid();
    this.db.object(`usuarios/${this.uid}/chat/${idVendedor}/msgPend`).remove();
  }

  newMsg(idVendedor) {
    this.uid = this.uidService.getUid();
    return this.db.object(`usuarios/${this.uid}/chat/${idVendedor}/msgPend`).valueChanges();
  }

  listenStatus(idVendedor) {
    return this.db.object(`usuarios/${this.uid}/chat/${idVendedor}/status`).valueChanges();
  }

  listenNoti(idVendedor) {
    return this.db.object(`usuarios/${this.uid}/chat/${idVendedor}/mensajes`).valueChanges();
  }

}
