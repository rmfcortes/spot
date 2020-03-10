import { Component, OnInit, ViewChild, NgZone, Input } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { ChatService } from 'src/app/services/chat.service';

import { Mensaje, UnreadMsg } from 'src/app/interfaces/chat.interface';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild(IonContent, {static: true}) content: IonContent;
  @Input() idVendedor;
  @Input() idPedido;
  @Input() nombre;
  @Input() foto;

  messages: Mensaje[] = [ ];

  newMsg = '';
  status = '';

  stateSub: Subscription;
  notiSub: Subscription;

  constructor(
    private ngZone: NgZone,
    private modalController: ModalController,
    private chatService: ChatService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.chatService.setSeen(this.idPedido);
    this.listenMsg();
    this.listenNotification();
    this.listenState();
  }

  sendMessage() {
    const newMsg: Mensaje = {
      isMe: true,
      createdAt: new Date().getTime(),
      idPedido: this.idPedido,
      msg: this.newMsg,
      idRepartidor: this.idVendedor
    };
    this.chatService.publicarMsg(newMsg, this.idPedido);
    this.newMsg = '';
  }

  listenNotification() {
    this.notiSub = this.chatService.listenMsgPedido(this.idPedido).subscribe((mensaje: UnreadMsg) => {
      if (mensaje && mensaje.cantidad > 0) {
        this.chatService.setSeen(this.idPedido);
      }
    });
  }

  listenMsg() {
    this.chatService.listenTodosMsg(this.idPedido).query.ref.on('child_added', snapshot => {
      this.ngZone.run(() => {
        this.messages.push(snapshot.val());
        setTimeout(() => {
          this.content.scrollToBottom(0);
        });
      });
    });
  }

  listenState() {
    this.stateSub = this.chatService.listenStatus(this.idPedido).subscribe((estado: any) => {
      this.status = estado || null;
    });
  }

  regresar() {
    this.chatService.listenTodosMsg(this.idPedido).query.ref.off('child_added');
    if (this.notiSub) { this.notiSub.unsubscribe(); }
    if (this.stateSub) { this.stateSub.unsubscribe(); }
    this.modalController.dismiss();
  }

}
