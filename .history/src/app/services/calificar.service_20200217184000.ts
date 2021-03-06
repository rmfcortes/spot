import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { UidService } from './uid.service';


@Injectable({
  providedIn: 'root'
})
export class CalificarService {

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  calificar(calificacionNegocio, calificacionRepartidor) {
    const uid = this.uidService.getUid();
    this.db.object(`usuarios/${uid}/pedidos/historial/calificacionNeg`).update(calificacionNegocio);
    this.db.object(`usuarios/${uid}/pedidos/historial/calificacionRep`).update(calificacionRepartidor);
  }

}
