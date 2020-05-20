import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { UidService } from './uid.service';

import { Direccion, Ubicacion } from '../interfaces/direcciones';
import { FormaPago } from '../interfaces/forma-pago.interface';
import { DatosNegocioParaPedido } from '../interfaces/pedido';
import { Producto } from '../interfaces/producto';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  getCart(idNegocio) {
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid();
      const cartSub = this.db.list(`usuarios/${uid}/cart/${idNegocio}`).valueChanges().subscribe((cart: Producto[]) => {
        cartSub.unsubscribe();
        resolve(cart);
      });
    });
  }

  updateCart(idNegocio: string, producto: Producto) {
    const uid = this.uidService.getUid();
    this.db.object(`usuarios/${uid}/cart/${idNegocio}/${producto.id}`).update(producto);
  }

  deleteProd(idNegocio: string, producto: Producto) {
    const uid = this.uidService.getUid();
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

  getUltimaFormaPago(): Promise<FormaPago> {
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid();
      const dirSub = this.db.object(`usuarios/${uid}/forma-pago/ultima`).valueChanges().subscribe((pago: FormaPago) => {
        dirSub.unsubscribe();
        resolve(pago);
      });
    });
  }

  async guardarDireccion(direccion: Direccion) {
    const uid = this.uidService.getUid();
    this.db.object(`usuarios/${uid}/direcciones/ultima`).update(direccion);
    const id = this.db.createPushId();
    direccion.id = id;
    this.db.object(`usuarios/${uid}/direcciones/historial/${id}`).set(direccion);
  }

  async guardarFormaPago(pago: FormaPago) {
    return new Promise(async (resolve, reject) => {      
      try {      
        const uid = this.uidService.getUid();
        await this.db.object(`usuarios/${uid}/forma-pago/ultima`).update(pago);
        const id = this.db.createPushId();
        pago.id = id;
        await this.db.object(`usuarios/${uid}/forma-pago/historial/${id}`).set(pago);
        resolve()
      } catch (error) {
        reject(error)
      }
    });
  }

  getDirecciones(): Promise<Direccion[]> {
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid();
      const dirSub = this.db.list(`usuarios/${uid}/direcciones/historial`).valueChanges().subscribe((dir: Direccion[]) => {
        dirSub.unsubscribe();
        resolve(dir);
      });
    });
  }

  getFormasPago(): Promise<FormaPago[]> {
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid();
      const dirSub = this.db.list(`usuarios/${uid}/forma-pago/historial`).valueChanges().subscribe((pagos: FormaPago[]) => {
        dirSub.unsubscribe();
        resolve(pagos);
      });
    });
  }

  getInfoNegocio(categoria, idNegocio): Promise<DatosNegocioParaPedido> {
    return new Promise((resolve, reject) => {
      const negSub = this.db.object(`negocios/datos-pedido/${categoria}/${idNegocio}`)
        .valueChanges().subscribe((neg: DatosNegocioParaPedido) => {
          negSub.unsubscribe();
          resolve(neg);
      });
    });
  }

  getCentro(): Promise<Ubicacion> {
    return new Promise((resolve, reject) => {
      const region = this.uidService.getRegion();
      const cenSub = this.db.object(`ciudades/${region}/ubicacion`).valueChanges().subscribe((ubicacion: Ubicacion) => {
        cenSub.unsubscribe();
        resolve(ubicacion);
      });
    });
  }

}
