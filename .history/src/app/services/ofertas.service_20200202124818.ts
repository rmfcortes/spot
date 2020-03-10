import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Oferta } from '../interfaces/negocio';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  constructor(
    private db: AngularFireDatabase,
  ) { }

    // Para home page

    getOfertas(batch): Promise<Oferta[]> {
      return new Promise((resolve, reject) => {
        const oferSub = this.db.list(`ofertas/todas`, data => data.orderByKey().limitToLast(batch)).valueChanges()
          .subscribe((ofertas: Oferta[]) => {
            oferSub.unsubscribe();
            resolve(ofertas);
          });
      });
    }

    // Para ofertas Modal
    getOfertasModal(categoria, batch, lastKey): Promise<Oferta[]> {
      return new Promise((resolve, reject) => {
        if (lastKey) {
          const x = this.db.list(`ofertas/${categoria}`, data =>
            data.orderByKey().limitToLast(batch).endAt(lastKey, lastKey)).valueChanges().subscribe(async (ofertas: Oferta[]) => {
              x.unsubscribe();
              resolve(ofertas);
            });
        } else {
          console.log('No key');
          const x = this.db.list(`ofertas/${categoria}`, data =>
            data.orderByKey().limitToLast(batch)).valueChanges().subscribe(async (ofertas: Oferta[]) => {
              x.unsubscribe();
              resolve(ofertas);
            });
        }
      });
    }

}
