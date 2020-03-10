import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { PedidoActivoPage } from 'src/app/modals/pedido-activo/pedido-activo.page';
import { CalificarPage } from 'src/app/modals/calificar/calificar.page';
import { ChatPage } from 'src/app/modals/chat/chat.page';

import { DisparadoresService } from 'src/app/services/disparadores.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ChatService } from 'src/app/services/chat.service';

import { Pedido, Repartidor } from 'src/app/interfaces/pedido';
import { UnreadMsg } from 'src/app/interfaces/chat.interface';
import { Ubicacion } from 'src/app/interfaces/direcciones';
import { PermisosPage } from 'src/app/modals/permisos/permisos.page';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  icon = '../../../assets/img/iconos/pin.png';
  tienda = '../../../assets/img/iconos/tienda.png';
  repartidor = '../../../assets/img/iconos/repartidor.png';

  pedido: Pedido;
  msgSub: Subscription;
  pedidoSub: Subscription;
  entregadoSub: Subscription;
  ubicacionSub: Subscription;
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

    // Info inicial

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
            this.trackEntregado();
            this.listenNewMsg();
          }
        });
      } else {
        this.listenNewMsg();
        this.trackRepartidor();
        this.trackEntregado();
      }
      console.log(this.pedido);
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

  getToken() {
    this.pedidoService.getToken().then(resp => {
      if (resp) {
        this.hasPermission = true;
      }
    });
  }

    // Listener

  trackRepartidor() {
    this.repartidorSub = this.pedidoService.trackUbicacion(this.pedido.repartidor.id).subscribe((ubicacion: Ubicacion) => {
      if (ubicacion) {
        this.pedido.repartidor.lat = ubicacion.lat;
        this.pedido.repartidor.lng = ubicacion.lng;
      }
    });
  }

  trackEntregado() {
    this.entregadoSub = this.pedidoService.trackEntregado(this.pedido.id).subscribe(resp => {
      console.log('entregado');
      console.log(resp);
      if (resp) {
        if (this.msgSub) { this.msgSub.unsubscribe(); }
        if (this.pedidoSub) { this.pedidoSub.unsubscribe(); }
        if (this.ubicacionSub) { this.ubicacionSub.unsubscribe(); }
        if (this.entregadoSub) { this.entregadoSub.unsubscribe(); }
        if (this.repartidorSub) { this.repartidorSub.unsubscribe(); }
        this.pedido.entregado = true;
        this.verCalificar();
      }
    });
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

    // Acciones

  async verPedido() {
    const modal = await this.modalCtrl.create({
      component: PedidoActivoPage,
      componentProps: {pedido: this.pedido}
    });

    return await modal.present();
  }

  async verCalificar() {
    const modal = await this.modalCtrl.create({
     cssClass: 'my-custom-modal-css',
     component: CalificarPage,
     componentProps: { pedido: this.pedido }
    });

    modal.onWillDismiss().then(() => {
      this.regresar();
    });
    return await modal.present();
  }

  guardaTel(event?) {
    if (event) {
      event.target.blur();
    }
    if (!this.tel) {
      return;
    }
    if (this.tel.length === 10) {
      this.pedidoService.guardarTelefono(this.tel);
      this.alertService.presentToast('Teléfono guardado. ¡Muchas gracias!');
      this.telReady = true;
    } else {
      this.alertService.presentAlert('Número incorrecto', 'El teléfono debe ser de 10 dígitos, por favor intenta de nuevo');
      return;
    }
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

  async muestraPermisos() {
    const modal = await this.modalCtrl.create({
      component: PermisosPage,
    });

    return await modal.present();
  }

  guardarCalificacion() {
    return;
  }

    // Salida

  regresar() {
    if (this.msgSub) { this.msgSub.unsubscribe(); }
    if (this.pedidoSub) { this.pedidoSub.unsubscribe(); }
    if (this.ubicacionSub) { this.ubicacionSub.unsubscribe(); }
    if (this.entregadoSub) { this.entregadoSub.unsubscribe(); }
    if (this.repartidorSub) { this.repartidorSub.unsubscribe(); }
    this.router.navigate(['/home']);
  }

}
