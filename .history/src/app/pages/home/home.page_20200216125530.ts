import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, IonSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { OfertasPage } from 'src/app/modals/ofertas/ofertas.page';
import { LoginPage } from 'src/app/modals/login/login.page';

import { OfertasService } from 'src/app/services/ofertas.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ChatService } from 'src/app/services/chat.service';
import { UidService } from 'src/app/services/uid.service';


import { Oferta, InfoGral } from 'src/app/interfaces/negocio';
import { UnreadMsg } from 'src/app/interfaces/chat.interface';
import { Pedido } from 'src/app/interfaces/pedido';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(IonSlides, {static: false}) slide: IonSlides;


  ofertas: Oferta[] =  [ ];
  batch = 4;
  hayMas = false;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.2,
    speed: 400,
  };

  slideCategoriaOpts = {
    initialSlide: 0,
    slidesPerView: 1.2,
    speed: 400,
    autoHeight: true,
    spaceBetween: 20,
  };

  pedidos: Pedido[] = [];
  pedSub: Subscription;
  msgSub: Subscription;

  uidSub: Subscription;
  uid: string;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private pedidoService: PedidoService,
    private ofertaService: OfertasService,
    private chatService: ChatService,
    private uidService: UidService,
  ) {}

  ionViewWillEnter() {
    this.getUid();
    this.getOfertas();
  }

  getUid() {
    this.uidSub = this.uidService.usuario.subscribe(uid => {
      if (uid) {
        this.uid = uid;
        this.getPedidosActivos();
      } else {
        this.uid = null;
        this.pedidos = [];
        if (this.pedSub) { this.pedSub.unsubscribe(); }
      }
    });
  }

  getPedidosActivos() {
    this.pedSub = this.pedidoService.getPedidosActivos().subscribe((pedidos: Pedido[]) => {
      this.pedidos = pedidos;
      if (this.pedidos.length === 0) {
        this.pedSub.unsubscribe();
      } else {
        this.listenNewMsg();
      }
    });
  }

  async ionSlideDidChange(i) {
    console.log(i);
  }

  listenNewMsg() {
    this.msgSub = this.chatService.listenMsg().subscribe((unReadmsg: UnreadMsg[]) => {
      this.pedidos.forEach(p => {
        const i = unReadmsg.findIndex(u => u.idPedido === p.id);
        if (i >= 0) {
          p.unRead = unReadmsg[i].cantidad;
        } else {
          p.unRead = 0;
        }
      });
    });
  }

  async login() {
    const modal = await this.modalController.create({
      cssClass: 'my-custom-modal-css',
      component: LoginPage,
    });

    return await modal.present();
  }

  getOfertas() {
    this.ofertaService.getOfertas(this.batch + 1, 'todas').then((ofertas: Oferta[]) => {
      if (ofertas.length === this.batch + 1) {
        this.hayMas = true;
        ofertas.shift();
      }
      this.ofertas = ofertas.reverse();
    });
  }

  async irAOferta(oferta: Oferta) {
    const infoNeg: InfoGral = await this.ofertaService.getStatus(oferta.idNegocio);
    this.router.navigate(['/negocio', infoNeg.categoria, oferta.idNegocio, infoNeg.abierto]);
  }

  async verOfertas() {
    const modal = await this.modalController.create({
      component: OfertasPage,
      componentProps: {categoria: 'todas', batch: this.batch}
    });

    return modal.present();
  }

  ionViewWillLeave() {
    if (this.pedSub) { this.pedSub.unsubscribe(); }
    if (this.uidSub) { this.uidSub.unsubscribe(); }
    if (this.msgSub) { this.msgSub.unsubscribe(); }
  }

}
