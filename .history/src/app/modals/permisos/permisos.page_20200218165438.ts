import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FcmService } from 'src/app/services/fcm.service';

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.page.html',
  styleUrls: ['./permisos.page.scss'],
})
export class PermisosPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private fcmService: FcmService,
  ) { }

  ngOnInit() {
  }

  async activaPermisos()  {
    await this.fcmService.requestToken();
    this.modalCtrl.dismiss(true);
  }

  salir() {
    this.modalCtrl.dismiss();
  }

}
