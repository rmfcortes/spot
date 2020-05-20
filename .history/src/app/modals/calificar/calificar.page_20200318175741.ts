import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { CalificarService } from 'src/app/services/calificar.service';

import { Pedido } from 'src/app/interfaces/pedido';

@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.page.html',
  styleUrls: ['./calificar.page.scss'],
})
export class CalificarPage implements OnInit {

  @Input() pedido: Pedido;

  negocio = {
    puntos: 5,
    comentarios: '',
    idNegocio: ''
  };

  repartidor = {
    puntos: 5,
    comentarios: '',
    idRepartidor: ''
  };

  back: Subscription;

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private calificarService: CalificarService,
  ) { }

  ngOnInit() {
    this.back = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.regresar();
    });
  }

  calificar() {
    this.repartidor.idRepartidor = this.pedido.repartidor.id;
    this.negocio.idNegocio = this.pedido.negocio.idNegocio;
    this.calificarService.calificar(this.pedido.id, this.negocio, this.repartidor);
    const calificacion = {
      negocio: this.negocio,
      repartidor: this.repartidor
    }
    this.pedido.calificacion = calificacion;
    this.modalCtrl.dismiss();
  }


  regresar() {
    this.back.unsubscribe();
    this.modalCtrl.dismiss();
  }

}
