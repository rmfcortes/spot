import { Injectable } from '@angular/core';

import { AppVersion } from '@ionic-native/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';

import { AngularFireDatabase } from '@angular/fire/database';
import { UidService } from './uid.service';
import { DisparadoresService } from './disparadores.service';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  constructor(
    private market: Market,
    private appVersion: AppVersion,
    private db: AngularFireDatabase,
    private alertService: DisparadoresService,
  ) { }

  async getVersion() {
    const version = await this.appVersion.getVersionCode();
    const number = await this.appVersion.getVersionNumber();
    this.db.object(`1version`).valueChanges().subscribe(async (current) => {
      console.log(current);
      console.log(number);
      console.log(version);
      if (number !== current) {
        this.alertService.presentAlertAction('Nueva versión de Spot', 'Hay una versión de Spot, '+
        'Obtén las últimas funcionalidades tu app. Trabajamos constantemente para darte el mejor servicio')
        .then(async (resp) => {
          if (resp) {
            const pack = await this.appVersion.getPackageName();
            this.market.open(pack);
          }
        });
      }
    });
  }

}
