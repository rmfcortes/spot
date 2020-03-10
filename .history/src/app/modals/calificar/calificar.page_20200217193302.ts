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

  calificacionNegocio = {
    puntos: 5,
    comentarios: '',
    idNegocio: ''
  };

  calificacionRepartidor = {
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
    console.log(this.calificacionNegocio);
    console.log(this.calificacionRepartidor);
    this.calificacionRepartidor.idRepartidor = this.pedido.repartidor.id;
    this.calificacionNegocio.idNegocio = this.pedido.negocio.idNegocio;
    this.calificarService.calificar(this.pedido.id, this.calificacionNegocio, this.calificacionRepartidor);
    this.modalCtrl.dismiss();
  }


  regresar() {
    this.modalCtrl.dismiss();
  }

}
