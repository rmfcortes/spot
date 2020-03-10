import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Pedido } from 'src/app/interfaces/pedido';
import { CalificarService } from 'src/app/services/calificar.service';

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

  constructor(
    private modalCtrl: ModalController,
    private calificarService: CalificarService,
  ) { }

  ngOnInit() {
  }

  calificar() {
    this.repartidor.idRepartidor = this.pedido.repartidor.id;
    this.negocio.idNegocio = this.pedido.negocio.idNegocio;
    this.calificarService.calificar(this.pedido.id, this.negocio, this.repartidor);
    this.pedido.calificacion.negocio = this.negocio;
    this.pedido.calificacion.repartidor = this.repartidor;
    this.modalCtrl.dismiss();
  }


  regresar() {
    this.modalCtrl.dismiss();
  }

}
