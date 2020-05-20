import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AngularFireDatabase } from '@angular/fire/database';
import { HTTP } from '@ionic-native/http/ngx';

import { UidService } from './uid.service';

import { FormaPago } from '../interfaces/forma-pago.interface';


@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(
    private http: HTTP,
    private platform: Platform,
    private httpAngular: HttpClient,
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  
  async guardarFormaPago(pago: FormaPago) {
    return new Promise(async (resolve, reject) => {      
      try {      
        const uid = this.uidService.getUid();
        await this.db.object(`usuarios/${uid}/forma-pago/ultima`).update(pago);
        if (!pago.id) pago.id = this.db.createPushId()
        if (pago.tipo !== 'efectivo') await this.db.object(`usuarios/${uid}/forma-pago/historial/${pago.id}`).set(pago)
        resolve()
      } catch (error) {
        reject(error)
      }
    });
  }

  newCard(cliente): Promise<any> {
    return new Promise((resolve, reject) => {
      cliente.idCliente = this.uidService.getUid()
      if (this.platform.is ('cordova')) {
        this.http.post('https://us-central1-revistaojo-9a8d3.cloudfunctions.net/request', cliente, {Authorization: 'secret-key-test'})
        .then(res => resolve(res),
         err => reject(err)
        )
      } else {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'secret-key'
          })
         };
         this.httpAngular.post('https://us-central1-revistaojo-9a8d3.cloudfunctions.net/request', cliente, httpOptions)
         .subscribe(res => resolve(res),
          err => reject(err)
         )
      }
    });
  }

}
