import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Negocio } from '../interfaces/negocio';
import { Servicio } from '../interfaces/servicios';

@Injectable({
  providedIn: 'root'
})
export class NegocioServiciosService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

  setVisita(idNegocio: string) {
    this.db.object(`visitas/${idNegocio}`).query.ref.transaction(visitas => visitas ? visitas + 1 : 1);
  }

  getNegocioPreview(id, categoria, status): Promise<Negocio> {
    return new Promise((resolve, reject) => {
      const negSub = this.db.object(`negocios/preview/${categoria}/todos/${status}/${id}`).valueChanges()
        .subscribe((negocio: Negocio) => {
          negSub.unsubscribe();
          resolve(negocio);
        });
    });
  }

  getOfertas(categoria: string, idNegocio: string): Promise<Servicio[]> {
    return new Promise((resolve, reject) => {
      const x = this.db.list(`negocios/servicios/${categoria}/${idNegocio}/Ofertas`)
        .valueChanges().subscribe(async (servicios: Servicio[]) => {
          x.unsubscribe();
          resolve(servicios);
        });
    });
  }

  getPasillos(categoria, id): Promise<any> {
    return new Promise((resolve, reject) => {
      const detSub = this.db.object(`negocios/pasillos/${categoria}/${id}`).valueChanges()
        .subscribe((pasillos: {}) => {
          detSub.unsubscribe();
          resolve(pasillos);
        });
    });
  }

  getServicios(categoria, id, pasillo, batch, lastKey): Promise<Servicio[]> {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(`negocios/servicios/${categoria}/${id}/${pasillo}`, data =>
          data.orderByKey().limitToFirst(batch).startAt(lastKey)).valueChanges().subscribe(async (servicios: Servicio[]) => {
            x.unsubscribe();
            resolve(servicios);
          });
      } else {
        const x = this.db.list(`negocios/servicios/${categoria}/${id}/${pasillo}`, data =>
          data.orderByKey().limitToFirst(batch)).valueChanges().subscribe(async (servicios: Servicio[]) => {
            x.unsubscribe();
            resolve(servicios);
          });
      }
    });
  }


}
