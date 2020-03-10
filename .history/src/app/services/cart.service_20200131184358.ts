import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { UidService } from './uid.service';

import { Producto } from '../interfaces/producto';
import { Direccion } from '../interfaces/direcciones';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  updateCart(idNegocio: string, producto: Producto, uid: string) {
    this.db.object(`usuarios/${uid}/cart/${idNegocio}/${producto.id}`).update(producto);
  }

  deleteProd(idNegocio: string, producto: Producto, uid: string) {
    this.db.object(`usuarios/${uid}/cart/${idNegocio}/${producto.id}`).remove();
  }

  getUltimaDireccion(): Promise<Direccion> {
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid();
      const dirSub = this.db.object(`usuarios/${uid}/direcciones/ultima`).valueChanges().subscribe((dir: Direccion) => {
        dirSub.unsubscribe();
        resolve(dir);
      });
    });
  }

}
