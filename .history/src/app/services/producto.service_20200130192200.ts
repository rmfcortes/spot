import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  getVariables(idNegocio, idProducto) {
    return new Promise((resolve, reject) => {
      const varSub = this.db.object(`negocios/complementos/${idNegocio}/${idProducto}`)
        .valueChanges().subscribe(comple => {
          varSub.unsubscribe();
          resolve(comple);
        });

    });
  }
}
