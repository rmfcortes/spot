import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Negocio, Oferta } from '../interfaces/negocio';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(
    private db: AngularFireDatabase
  ) { }

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
        console.log(categoria);
        console.log(subCategoria);
        console.log(status);
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
