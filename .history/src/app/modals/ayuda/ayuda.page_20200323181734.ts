import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
})
export class AyudaPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  regresar() {
    this.modalCtrl.dismiss()
  }

}
