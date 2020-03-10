import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Servicio } from 'src/app/interfaces/servicios';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.page.html',
  styleUrls: ['./servicio.page.scss'],
})
export class ServicioPage implements OnInit {

  @Input() servicio: Servicio;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    console.log(this.servicio);
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
