import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Negocio, Oferta, visistasNegocio, InfoGral } from '../interfaces/negocio';
import { MasVendido } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  // Para home Page

  getPopulares(): Promise<InfoGral[]> {
    return new Promise((resolve, reject) => {
      const popSub = this.db.list(`functions/`, data => data.orderByChild('visitas').limitToLast(7)).valueChanges()
        .subscribe((visitas: InfoGral[]) => {
          popSub.unsubscribe();
          resolve(visitas);
        });
    });
  }

  getMasVendidos(): Promise<MasVendido[]> {
    return new Promise((resolve, reject) => {
      const popSub = this.db.list(`vendidos/`, data => data.orderByChild('ventas').limitToLast(10)).valueChanges()
        .subscribe((visitas: MasVendido[]) => {
          popSub.unsubscribe();
          resolve(visitas);
        });
    });
  }

  getVisitas(uid: string) {
    return new Promise((resolve, reject) => {
      const visSub = this.db.object(`usuarios/${uid}/visitas`).valueChanges()
        .subscribe((visitas: string[]) => {
          visSub.unsubscribe();
          resolve(visitas);
        });
    });
  }

  getVisitasNegocios(uid: string): Promise<visistasNegocio[]> {
    return new Promise((resolve, reject) => {
      const visSub = this.db.list(`usuarios/${uid}/visitasNegocio`, data => data.orderByChild('visitas').limitToLast(5)).valueChanges()
        .subscribe((visitas: visistasNegocio[]) => {
          visSub.unsubscribe();
          resolve(visitas);
        });
    });
  }

  setVisitaCategoria(uid: string, categoria: string) {
    this.db.object(`usuarios/${uid}/visitas/${categoria}`).query.ref.transaction(cantidad => cantidad ? cantidad + 1 : 1);
  }

  setVisitaNegocio(uid: string, idNegocio: string) {
    this.db.object(`usuarios/${uid}/visitasNegocio/${idNegocio}/idNegocio`).set(idNegocio);
    this.db.object(`usuarios/${uid}/visitasNegocio/${idNegocio}/visitas`).query.ref.transaction(cantidad => cantidad ? cantidad + 1 : 1);
  }

  getSubCategorias(categoria): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const subCat = this.db.object(`categoria/${categoria}`).valueChanges()
        .subscribe((subcategorias: string[]) => {
          subCat.unsubscribe();
          resolve(Object.keys(subcategorias));
        });
    });
  }

  getOfertas(categoria): Promise<Oferta[]> {
    return new Promise((resolve, reject) => {
      const oferSub = this.db.list(`ofertas/${categoria}`).valueChanges()
        .subscribe((ofertas: Oferta[]) => {
          oferSub.unsubscribe();
          resolve(ofertas);
        });
    });
  }

  getNegocios(status, categoria, subCategoria, batch, lastKey?, lastValue?): Promise<Negocio[]> {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const negocioSub = this.db.list(`negocios/preview/${categoria}/${subCategoria}/${status}`, data =>
        data.orderByChild('rate').limitToLast(batch).endAt(lastValue, lastKey)).valueChanges()
          .subscribe((negocios: Negocio[]) => {
            negocioSub.unsubscribe();
            resolve(negocios);
          });
      } else {
        const negocioSub = this.db.list(`negocios/preview/${categoria}/${subCategoria}/${status}`, data =>
          data.orderByChild('rate').limitToLast(batch)).valueChanges()
            .subscribe((negocios: Negocio[]) => {
              console.log(negocios);
              negocioSub.unsubscribe();
              resolve(negocios);
            });
      }
    });
  }

}
