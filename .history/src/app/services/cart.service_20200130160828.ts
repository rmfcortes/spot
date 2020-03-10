import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Producto } from '../interfaces/negocio';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private db: AngularFireDatabase,
  ) { }


  updateCart(idNegocio: string, producto: Producto, uid: string) {
    this.db.object(`usuarios/${uid}/cart/${idNegocio}/${producto.id}`).update(producto);
  }

  deleteProd(idNegocio: string, producto: Producto, uid: string) {
    this.db.object(`usuarios/${uid}/cart/${idNegocio}/${producto.id}`).remove();
  }

}
