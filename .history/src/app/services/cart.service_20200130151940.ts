import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { UidService } from './uid.service';

import { Producto } from '../interfaces/negocio';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  uid: string;

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }


  addProducto(idNegocio: string, idProducto: string, producto: Producto) {
    this.uid = this.uidService.getUid();
    this.db.object(`usuarios/${this.uid}/cart/${idNegocio}/${idProducto}`).update(producto);
  }

}
