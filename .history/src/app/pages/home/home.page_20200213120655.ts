import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { LoginPage } from 'src/app/modals/login/login.page';
import { OfertasPage } from 'src/app/modals/ofertas/ofertas.page';

import { OfertasService } from 'src/app/services/ofertas.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { UidService } from 'src/app/services/uid.service';

import { Pedido } from 'src/app/interfaces/pedido';
import { Oferta, InfoGral } from 'src/app/interfaces/negocio';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  ofertas: Oferta[] =  [ ];
  batch = 4;
  hayMas = false;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.2,
    speed: 400,
  };

  pedidos: Pedido[] = [];
  pedSub: Subscription;

  uidSub: Subscription;
  uid: string;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private pedidoService: PedidoService,
    private ofertaService: OfertasService,
    private uidService: UidService,
  ) {}

  ionViewWillEnter() {
    this.getUid();
    this.getOfertas();
  }

  getUid() {
    this.uidSub = this.uidService.usuario.subscribe(uid => {
      console.log(uid);
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
      }
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
  }

}
