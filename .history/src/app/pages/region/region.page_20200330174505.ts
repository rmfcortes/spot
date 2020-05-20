import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { DireccionesPage } from 'src/app/modals/direcciones/direcciones.page';

import { enterAnimation } from 'src/app/animations/enter';
import { RegionService } from 'src/app/services/region.service';


@Component({
  selector: 'app-region',
  templateUrl: './region.page.html',
  styleUrls: ['./region.page.scss'],
})
export class RegionPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private regionService: RegionService,
  ) { }

  ngOnInit() {
  }

  async mostrarDirecciones() {
    const modal = await this.modalCtrl.create({
      component: DireccionesPage,
      enterAnimation,
    });
    modal.onWillDismiss().then(resp => {
      if (resp.data) this.regionService.setRegion(resp.data)
    });
    return await modal.present();
  }

  getUbicacion() {
    
  }

}
