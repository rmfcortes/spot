import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Producto } from '../interfaces/negocio';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  uid: string;

  constructor(
    private db: AngularFireDatabase,
  ) { }


  updateCart(idNegocio: string, producto: Producto, uid: string) {
    this.db.object(`usuarios/${this.uid}/cart/${idNegocio}/${producto.id}`).update(producto);
  }

}
