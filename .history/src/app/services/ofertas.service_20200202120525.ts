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
}
