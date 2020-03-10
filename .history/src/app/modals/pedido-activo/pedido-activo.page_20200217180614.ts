import { Component, OnInit, Input } from '@angular/core';

import { Pedido } from 'src/app/interfaces/pedido';
import { ModalController } from '@ionic/angular';

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

  regresar() {
    this.modalCtrl.dismiss();
  }

}
