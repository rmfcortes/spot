import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { DisparadoresService } from 'src/app/services/disparadores.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ChatService } from 'src/app/services/chat.service';

import { PedidoActivoPage } from 'src/app/modals/pedido-activo/pedido-activo.page';
import { CalificarPage } from 'src/app/modals/calificar/calificar.page';
import { PermisosPage } from 'src/app/modals/permisos/permisos.page';
import { ChatPage } from 'src/app/modals/chat/chat.page';

import { Ubicacion } from 'src/app/interfaces/region.interface';
import { Pedido, Repartidor } from 'src/app/interfaces/pedido';
import { UnreadMsg } from 'src/app/interfaces/chat.interface';

import { enterAnimation } from 'src/app/animations/enter';
import { leaveAnimation } from 'src/app/animations/leave';

@Component({
  selector: 'app-avances',
  templateUrl: './avances.page.html',
  styleUrls: ['./avances.page.scss'],
})
export class AvancesPage implements OnInit {

  icon = '../../../assets/img/iconos/pin.png';
  tienda = '../../../assets/img/iconos/tienda.png';
  repartidor = '../../../assets/img/iconos/repartidor.png';

  pedido: Pedido;
  msgSub: Subscription;
  pedidoSub: Subscription;
  entregadoSub: Subscription;
  ubicacionSub: Subscription;
  repartidorSub: Subscription;
  tipoEntregaSub: Subscription;

  telReady = true;
  tel: string;

  newMsg = false;
  hasPermission = true;

  entregaAprox = null;

  infoReady = false;

  back: Subscription;


  constructor(
    private router: Router,
    private ngZone: NgZone,
    private platform: Platform,
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
    this.back = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.regresar();
    });
  }

  ionViewDidEnter() {
    this.getTelefono();
    this.getToken();
  }

  getPedido(id) {
    this.pedidoService.getPedido(id).then((pedido: Pedido) => {
      this.pedido = pedido;
      console.log(this.pedido);
      if (!this.pedido.aceptado) {
        this.pedidoSub = this.pedidoService.trackAcept(id).subscribe((resp: number) => {
          if (resp) {
            this.pedidoSub.unsubscribe();
            this.pedido.aceptado = resp;
            this.isInmediato(id)
            this.trackAvances()
          } else  this.infoReady = true
        });
      } else {
        this.trackAvances()
        this.isInmediato(id)
      }
    });
  }

  isInmediato(id) {
    if (!this.pedido.repartidor && this.pedido.entrega && this.pedido.entrega === 'inmediato') {
      this.repartidorSub = this.pedidoService.trackRepartidor(id).subscribe((resp: Repartidor) => {
        console.log(resp);
        if (resp) {
          this.repartidorSub.unsubscribe();
          this.pedido.repartidor = resp;
          this.infoReady = true
          this.trackRepartidor();
        } else {
          this.infoReady = true
        }
      });
    }
    if (this.pedido.repartidor && this.pedido.entrega && this.pedido.entrega === 'inmediato') {
      this.infoReady = true
      this.trackRepartidor();
    }
    if (this.pedido.entrega === 'indefinido') {
      this.trackTipoEntrega()
    }
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
      } else {
        this.hasPermission = false;
      }
    });
  }

  // Listener

  trackTipoEntrega() {
    this.tipoEntregaSub = this.pedidoService.trackTipoEntrega(this.pedido.id).subscribe((tipo: string) => {
      if (tipo === 'inmediato' || tipo === 'planeado') {
        this.pedido.entrega = tipo;
        this.isInmediato(this.pedido.id)
      }
    });
  }

  trackAvances() {
    this.pedido.avances = []
    this.pedidoService.trackAvances(this.pedido.id).query.ref.on('child_added', snapshot => {
      this.ngZone.run(() => {
        this.pedido.avances.push(snapshot.val())
      });
    });
  }

  trackRepartidor() {
    this.trackEntregado();
    this.listenNewMsg();
    this.repartidorSub = this.pedidoService.trackUbicacion(this.pedido.repartidor.id).subscribe((ubicacion: Ubicacion) => {
      if (ubicacion) {
        this.pedido.repartidor.lat = ubicacion.lat;
        this.pedido.repartidor.lng = ubicacion.lng;
      }
    });
  }

  trackEntregado() {
    this.entregadoSub = this.pedidoService.trackEntregado(this.pedido.id).subscribe(resp => {
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
      enterAnimation,
      leaveAnimation,
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
    this.tel = this.tel.replace(/ /g, "");
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
      enterAnimation,
      leaveAnimation,
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
    if (this.back) { this.back.unsubscribe(); }
    if (this.msgSub) { this.msgSub.unsubscribe(); }
    if (this.pedidoSub) { this.pedidoSub.unsubscribe(); }
    if (this.ubicacionSub) { this.ubicacionSub.unsubscribe(); }
    if (this.entregadoSub) { this.entregadoSub.unsubscribe(); }
    if (this.repartidorSub) { this.repartidorSub.unsubscribe(); }
    this.pedidoService.trackAvances(this.pedido.id).query.ref.off('child_added');
    this.router.navigate(['/home']);
  }


}
