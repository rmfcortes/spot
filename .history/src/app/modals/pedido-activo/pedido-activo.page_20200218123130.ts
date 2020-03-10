import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CalificarPage } from '../calificar/calificar.page';

import { Pedido } from 'src/app/interfaces/pedido';


@Component({
  selector: 'app-pedido-activo',
  templateUrl: './pedido-activo.page.html',
  styleUrls: ['./pedido-activo.page.scss'],
})
export class PedidoActivoPage implements OnInit {

  @Input() pedido: Pedido;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  async verCalificar() {
    const modal = await this.modalCtrl.create({
     cssClass: 'my-custom-modal-css',
     component: CalificarPage,
     componentProps: { pedido: this.pedido }
    });
    return await modal.present();
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
