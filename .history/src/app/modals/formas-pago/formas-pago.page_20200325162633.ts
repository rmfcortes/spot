import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { TarjetaPage } from 'src/app/modals/tarjeta/tarjeta.page';

import { enterAnimationDerecha } from 'src/app/animations/enterDerecha';
import { leaveAnimationDerecha } from 'src/app/animations/leaveDerecha';


@Component({
  selector: 'app-formas-pago',
  templateUrl: './formas-pago.page.html',
  styleUrls: ['./formas-pago.page.scss'],
})
export class FormasPagoPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
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

  regresar() {
    this.modalCtrl.dismiss()
  }

}
