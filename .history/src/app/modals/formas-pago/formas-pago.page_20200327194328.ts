import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { TarjetaPage } from 'src/app/modals/tarjeta/tarjeta.page';

import { enterAnimationDerecha } from 'src/app/animations/enterDerecha';
import { leaveAnimationDerecha } from 'src/app/animations/leaveDerecha';
import { FormaPago } from 'src/app/interfaces/forma-pago.interface';
import { CartService } from 'src/app/services/cart.service';
import { DisparadoresService } from 'src/app/services/disparadores.service';


@Component({
  selector: 'app-formas-pago',
  templateUrl: './formas-pago.page.html',
  styleUrls: ['./formas-pago.page.scss'],
})
export class FormasPagoPage implements OnInit {

  tarjetas: Tarjeta[] = [];

  constructor(
    private modalCtrl: ModalController,
    private alertService: DisparadoresService,
    private cartService: CartService,
  ) { }

  ngOnInit() {
  }

  async nuevaTarjeta() {
    const modal = await this.modalCtrl.create({
      component: TarjetaPage,
      enterAnimation: enterAnimationDerecha,
      leaveAnimation: leaveAnimationDerecha,
    });

    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        
      }
    });

    return await modal.present();
  }

  async selFormaPago(forma, tipo) {
    const pago: FormaPago = {
      forma,
      tipo
    }
    try {
      await this.cartService.guardarFormaPago(pago);
      this.modalCtrl.dismiss(pago)
    } catch (error) {
      this.alertService.presentAlert(
        'Algo salió mal',
        'Tuvimos problemas para asignar tu forma de pago, por favor intenta de nuevo')
    }
  }

  regresar() {
    this.modalCtrl.dismiss()
  }

}
