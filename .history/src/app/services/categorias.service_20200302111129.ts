import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { UidService } from './uid.service';

import { Negocio, Oferta, visistasNegocio, InfoGral } from '../interfaces/negocio';
import { Categoria } from '../interfaces/categoria.interface';
import { MasVendido } from '../interfaces/producto';


@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  // Para home Page

  getCategorias(): Promise<Categoria[]> {
    const region = this.uidService.getRegion();
    return new Promise((resolve, reject) => {
      const catSub = this.db.list(`categoria/${region}`).valueChanges().subscribe((categorias: Categoria[]) => {
        catSub.unsubscribe();
        resolve(categorias);
      });
    });
  }

  listenCambios() {
    const region = this.uidService.getRegion();
    return this.db.list(`functions/${region}`);
  }


  getPopulares(): Promise<InfoGral[]> {
    return new Promise((resolve, reject) => {
      const region = this.uidService.getRegion();
      const popSub = this.db.list(`functions/${region}`, data => data.orderByChild('visitas').limitToLast(7)).valueChanges()
        .subscribe((visitas: InfoGral[]) => {
          popSub.unsubscribe();
          visitas = visitas.filter(v => v.cuenta && v.cuenta !== 'basica');
          resolve(visitas);
        });
    });
  }

  getMasVendidos(): Promise<MasVendido[]> {
    return new Promise((resolve, reject) => {
      const region = this.uidService.getRegion();
      const popSub = this.db.list(`vendidos/${region}`, data => data.orderByChild('ventas').limitToLast(10)).valueChanges()
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

  setVisita(info: InfoGral) {
    if (info.cuenta && info.cuenta !== 'basica') {
      const region = this.uidService.getRegion();
      this.db.object(`functions/${region}/${info.idNegocio}/visitas`).query.ref.transaction(cantidad => cantidad ? cantidad + 1 : 1);
    }
  }

  getSubCategorias(categoria): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const region = this.uidService.getRegion();
      const subCat = this.db.list(`categoriaSub/${region}/${categoria}`).valueChanges()
        .subscribe((subcategorias: string[]) => {
          subCat.unsubscribe();
          resolve(subcategorias);
        });
    });
  }

  getOfertas(categoria): Promise<Oferta[]> {
    const region = this.uidService.getRegion();
    return new Promise((resolve, reject) => {
      const oferSub = this.db.list(`ofertas/${region}/${categoria}`).valueChanges()
        .subscribe((ofertas: Oferta[]) => {
          oferSub.unsubscribe();
          resolve(ofertas);
        });
    });
  }

  getNegocios(status, categoria, subCategoria, batch, lastKey?, lastValue?): Promise<Negocio[]> {
    return new Promise((resolve, reject) => {
      const region = this.uidService.getRegion();
      if (lastKey) {
        const negocioSub = this.db.list(`negocios/preview/${region}/${categoria}/${subCategoria}/${status}`, data =>
        data.orderByChild('rate').limitToLast(batch).endAt(lastValue, lastKey)).valueChanges()
          .subscribe((negocios: Negocio[]) => {
            negocioSub.unsubscribe();
            resolve(negocios);
          });
      } else {
        const negocioSub = this.db.list(`negocios/preview/${region}/${categoria}/${subCategoria}/${status}`, data =>
          data.orderByChild('rate').limitToLast(batch)).valueChanges()
            .subscribe((negocios: Negocio[]) => {
              negocioSub.unsubscribe();
              resolve(negocios);
            });
      }
    });
  }

}
