import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Tarjeta } from 'src/app/interfaces/tarjeta.interface';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.page.html',
  styleUrls: ['./tarjeta.page.scss'],
})
export class TarjetaPage implements OnInit {

  tarjeta: Tarjeta = {
    numero: null,
    expiracion: '',
    cvv: '',
    nombre: '',
  }

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  moveFocus(nextElement) {
    nextElement.setFocus();
  }

  spaceKey(text: number) {
    text = parseInt(text.toString().trim(), 10);
    return;
  }

  agregarTarjeta() {
    console.log(this.tarjeta);
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
