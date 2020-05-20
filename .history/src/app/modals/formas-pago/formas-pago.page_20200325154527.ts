import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

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

  regresar() {
    this.modalCtrl.dismiss()
  }

}
