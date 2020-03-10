import { Component, OnInit } from '@angular/core';

import { HistorialService } from 'src/app/services/historial.service';
import { Pedido } from 'src/app/interfaces/pedido';
import { ModalController } from '@ionic/angular';
import { PedidoActivoPage } from 'src/app/modals/pedido-activo/pedido-activo.page';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  batch = 5;
  lastKey = '';
  noMore = false;

  historial: Pedido[] = [];

  historialReady = false;

  constructor(
    private modalCtrl: ModalController,
    private historialService: HistorialService,
  ) { }

  ngOnInit() {
    this.getPedidos();
  }

  getPedidos(event?) {
    this.historialService.getHistorial(this.batch + 1, this.lastKey).then(historial => {
      this.cargaHistorial(historial, event);
    });
  }

  cargaHistorial(historial, event) {
    if (historial.length === this.batch + 1) {
      this.lastKey = historial[0].id;
      historial.shift();
    } else {
      this.noMore = true;
    }
    this.historial = this.historial.concat(historial.reverse());
    if (event) {
      event.target.complete();
    }
    this.historialReady = true;
  }

  async loadData(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    this.getPedidos(event);
    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  async verPedido(pedido: Pedido) {
    const modal = await this.modalCtrl.create({
      component: PedidoActivoPage,
      componentProps: {pedido}
    });

    return await modal.present();
  }

}
