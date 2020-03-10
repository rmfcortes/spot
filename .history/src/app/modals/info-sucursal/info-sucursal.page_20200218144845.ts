import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { NegocioService } from 'src/app/services/negocio.service';

import { DatosParaCuenta, NegocioInfo, DetallesNegocio } from 'src/app/interfaces/negocio';
import { Dia } from 'src/app/interfaces/horario.interface';


@Component({
  selector: 'app-info-sucursal',
  templateUrl: './info-sucursal.page.html',
  styleUrls: ['./info-sucursal.page.scss'],
})
export class InfoSucursalPage implements OnInit {

  @Input() datos: DatosParaCuenta;
  @Input() abierto: boolean;

  negocio: NegocioInfo;
  despliegueHorario = false;
  infoReady = false;

  horario: Dia[] = [];

  constructor(
    private modalController: ModalController,
    private negocioService: NegocioService,
  ) { }

  ngOnInit() {
    this.getInfo();
  }

  async getInfo() {
    this.horario = await this.negocioService.getHorario(this.datos.idNegocio);
    const result: DetallesNegocio = await this.negocioService.getSucursalNegocio(this.datos.categoria, this.datos.idNegocio);
    let status;
    if (this.abierto) {
      status = 'Abierto';
    } else {
      status = 'Cerrado';
    }
    this.negocio = {
      datos: this.datos,
      detalles: result,
      status
    };
    this.infoReady = true;
  }

  async regresar() {
    await this.modalController.dismiss();
  }

}
