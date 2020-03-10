import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { PedidoService } from 'src/app/services/pedido.service';

import { Pedido, Repartidor } from 'src/app/interfaces/pedido';
import { DisparadoresService } from 'src/app/services/disparadores.service';
import { ChatPage } from 'src/app/modals/chat/chat.page';

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
          }
        });
      } else {
        this.trackRepartidor();
      }
      console.log(this.pedido);
    });
  }

  trackRepartidor() {
    // obtener su ubicación
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
    const modal = await this.modalCtrl.create({
      component: ChatPage,
      componentProps: {
        idVendedor: this.pedido.repartidor.id,
        idPedido: this.pedido.id,
        nombre: this.pedido.repartidor.nombre,
        foto: this.pedido.repartidor.foto
      }
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
    this.router.navigate(['/home']);
  }

}
