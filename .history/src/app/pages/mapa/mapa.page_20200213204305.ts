import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { ChatPage } from 'src/app/modals/chat/chat.page';

import { DisparadoresService } from 'src/app/services/disparadores.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ChatService } from 'src/app/services/chat.service';

import { Pedido, Repartidor } from 'src/app/interfaces/pedido';
import { UnreadMsg } from 'src/app/interfaces/chat.interface';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  icon = '../../../assets/img/iconos/pin.png';
  tienda = '../../../assets/img/iconos/tienda.png';
  repartidor = '../../../assets/img/iconos/repartidor.png';

  calPend = false;
  calificacion = {
    puntos: 5,
    comentarios: '',
    vendedor: '',
    nombre: ''
  };

  pedido: Pedido;
  msgSub: Subscription;
  pedidoSub: Subscription;
  repartidorSub: Subscription;

  telReady = true;
  tel: string;

  newMsg = false;
  hasPermission = false;

  entregaAprox = null;

  constructor(
    private router: Router,
    private callNumber: CallNumber,
    private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute,
    private alertService: DisparadoresService,
    private pedidoService: PedidoService,
    private chatService: ChatService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getPedido(id);
  }

  ionViewDidEnter() {
    this.getTelefono();
  }

  getPedido(id) {
    this.pedidoService.getPedido(id).then((pedido: Pedido) => {
      this.pedido = pedido;
      if (!this.pedido.aceptado) {
        this.pedidoSub = this.pedidoService.trackAcept(id).subscribe((resp: number) => {
          if (resp) {
            this.pedidoSub.unsubscribe();
            this.pedido.aceptado = resp;
          }
        });
      }
      if (!this.pedido.repartidor) {
        this.repartidorSub = this.pedidoService.trackRepartidor(id).subscribe((resp: Repartidor) => {
          if (resp) {
            this.repartidorSub.unsubscribe();
            this.pedido.repartidor = resp;
            this.trackRepartidor();
            this.listenNewMsg();
          }
        });
      } else {
        this.listenNewMsg();
        this.trackRepartidor();
      }
    });
  }

  trackRepartidor() {
    // obtener su ubicación
  }

  listenNewMsg() {
    this.msgSub = this.chatService.listenMsgPedido(this.pedido.id).subscribe((unRead: UnreadMsg) => {
      if (unRead && unRead.cantidad > 0) {
        this.newMsg = true;
        this.alertService.presentToast('Nuevo mensaje de ' + this.pedido.repartidor.nombre);
      } else {
        this.newMsg = false;
      }
    });
  }

  async getTelefono() {
    this.tel = await this.pedidoService.getTelefono();
    if (!this.tel) {
      setTimeout(() => {
        this.telReady = false;
      }, 2000);
    } else {
      this.telReady = true;
    }
  }

  guardaTel(event?) {
    if (event) {
      event.target.blur();
    }
    if (!this.tel) {
      return;
    }
    this.pedidoService.guardarTelefono(this.tel);
    this.alertService.presentToast('Teléfono guardado. ¡Muchas gracias!');
    this.telReady = true;
  }

  llamar(numero) {
    this.callNumber.callNumber(numero, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  async muestraChat() {
    if (this.msgSub) { this.msgSub.unsubscribe(); }
    const modal = await this.modalCtrl.create({
      component: ChatPage,
      componentProps: {
        idVendedor: this.pedido.repartidor.id,
        idPedido: this.pedido.id,
        nombre: this.pedido.repartidor.nombre,
        foto: this.pedido.repartidor.foto
      }
    });

    modal.onDidDismiss().then(() => {
      this.listenNewMsg();
    });

    return await modal.present();
  }

  muestraPermisos() {
    return;
  }

  guardarCalificacion() {
    return;
  }

  regresar() {
    if (this.pedidoSub) { this.pedidoSub.unsubscribe(); }
    if (this.repartidorSub) { this.repartidorSub.unsubscribe(); }
    if (this.msgSub) { this.msgSub.unsubscribe(); }
    this.router.navigate(['/home']);
  }

}
