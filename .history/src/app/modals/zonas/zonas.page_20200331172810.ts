import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RegionService } from 'src/app/services/region.service';
import { Region } from 'src/app/interfaces/region.interface';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.page.html',
  styleUrls: ['./zonas.page.scss'],
})
export class ZonasPage implements OnInit {

  regiones: Region[] = []

  error: String

  constructor(
    private modalCtrl: ModalController,
    private regionService: RegionService,
  ) { }

  ngOnInit() {
    this.getRegiones()
  }

  getRegiones() {
    this.regionService.getRegiones()
    .then(regiones => this.regiones = regiones)
    .catch(err => this.error = err)
  }

  regresar() {
    this.modalCtrl.dismiss()
  }

}
