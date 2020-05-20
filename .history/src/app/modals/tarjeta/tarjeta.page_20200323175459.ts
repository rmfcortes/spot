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

  numeroCambio() {
    if (this.tarjeta.numero.length === 4) this.tarjeta.numero = this.tarjeta.numero + ' '
  }

  moveFocus(nextElement) {
    nextElement.setFocus();
  }

  spaceKey(text: string) {
    this.tarjeta[text] = this.tarjeta[text].trim()
    console.log(this.tarjeta);
    return
  }

  agregarTarjeta() {
    console.log(this.tarjeta);
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
