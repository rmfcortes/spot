import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Servicio } from 'src/app/interfaces/servicios';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.page.html',
  styleUrls: ['./servicio.page.scss'],
})
export class ServicioPage implements OnInit {

  @Input() servicio: Servicio;

  back: Subscription;

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.back = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.regresar();
    });
  }

  regresar() {
    if (this.back) {this.back.unsubscribe()}
    this.modalCtrl.dismiss();
  }

}
