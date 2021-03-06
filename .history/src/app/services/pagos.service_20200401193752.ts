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

  getTarjetas(): Promise<FormaPago[]> {
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid()
      const pagoSub = this.db.list(`usuarios/${uid}/forma-pago/historial`).valueChanges().subscribe((tarjetas: FormaPago[]) => {
        pagoSub.unsubscribe()
        resolve(tarjetas)
      }, err => reject('No pudimos obtener tus tarjetas guardadas' + err))
    });
  }
  
  async guardarFormaPago(pago: FormaPago) {
    return new Promise(async (resolve, reject) => {      
      try {      
        const uid = this.uidService.getUid();
        await this.db.object(`usuarios/${uid}/forma-pago/ultima`).update(pago);
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
         err => reject(err.error.text)
        )
        .catch(err => reject(err.error.text))
      } else {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'Authorization': 'secret-key'
          })
         };
         this.httpAngular.post('https://us-central1-revistaojo-9a8d3.cloudfunctions.net/request', cliente, httpOptions)
         .subscribe(
          res => {
            resolve(res)
          },
          err => {
            if (err.status === 200) {
              resolve()
            } else {
              reject(err.error.text)
            }
          })
      }
    });
  }

  saveCard(card: FormaPago): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const uid = this.uidService.getUid()
        card.id = this.db.createPushId()
        await this.db.object(`usuarios/${uid}/forma-pago/historial/${card.id}`).set(card)
        resolve()
      } catch (error) {
        reject('No pudimos guardar la tarjeta' + error)
      }
    });
  }

}
