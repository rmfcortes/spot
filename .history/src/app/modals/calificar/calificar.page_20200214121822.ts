import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Pedido } from 'src/app/interfaces/pedido';

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
    vendedor: '',
    nombre: ''
  };

  calificacionRepartidor = {
    puntos: 5,
    comentarios: '',
  };

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  calificar() {
    console.log(this.calificacionNegocio);
    console.log(this.calificacionRepartidor);
  }


  regresar() {
    this.modalCtrl.dismiss();
  }

}
