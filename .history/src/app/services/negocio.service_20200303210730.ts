import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Negocio, DetallesNegocio, NegocioBusqueda } from '../interfaces/negocio';
import { Producto } from '../interfaces/producto';
import { Dia } from '../interfaces/horario.interface';
import { UidService } from './uid.service';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  cart: Producto[] = [];
  count = 0;

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  
  getNegocioPreview(id, categoria, status): Promise<Negocio> {
    const region = this.uidService.getRegion();
    console.log(region);
    return new Promise((resolve, reject) => {
      const negSub = this.db.object(`negocios/preview/${region}/${categoria}/todos/${status}/${id}`).valueChanges()
        .subscribe((negocio: Negocio) => {
          negSub.unsubscribe();
          if (negocio) {
            this.count = 0;
            resolve(negocio);
          } else {
            this.count++;
            if (this.count = 2) {
              resolve(null);
              return;
            }
            if (status === 'abiertos') {
              status = 'cerrados';
            } else {
              status = 'abiertos';
            }
            this.getNegocioPreview(id, categoria, status);
          }
        });
    });
  }

  getOfertas(categoria: string, idNegocio: string): Promise<Producto[]> {
    return new Promise((resolve, reject) => {
      const x = this.db.list(`negocios/productos/${categoria}/${idNegocio}/Ofertas`)
        .valueChanges().subscribe(async (productos: Producto[]) => {
          x.unsubscribe();
          if (this.cart.length > 0) {
            productos = await this.comparaCart(productos);
          }
          resolve(productos);
        });
    });
  }

  getPasillos(categoria, id): Promise<any> {
    return new Promise((resolve, reject) => {
      const detSub = this.db.object(`negocios/pasillos/${categoria}/${id}`).valueChanges()
        .subscribe((pasillos: {}) => {
          detSub.unsubscribe();
          resolve(pasillos);
        });
    });
  }

  getCart(uid, idNegocio): Promise<number> {
    return new Promise((resolve, reject) => {
      const cartSub = this.db.list(`usuarios/${uid}/cart/${idNegocio}`).valueChanges().subscribe((cart: Producto[]) => {
        cartSub.unsubscribe();
        this.cart = cart;
        if (cart.length > 0) {
          let cuenta = 0;
          cart.forEach(c => {
            cuenta += c.total;
          });
          resolve(cuenta);
        } else {
          resolve(0);
        }
      });
    });
  }

  getProductosLista(categoria, id, pasillo, batch, lastKey): Promise<Producto[]> {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(`negocios/productos/${categoria}/${id}/${pasillo}`, data =>
          data.orderByKey().limitToFirst(batch).startAt(lastKey)).valueChanges().subscribe(async (productos: Producto[]) => {
            x.unsubscribe();
            if (this.cart.length > 0) {
              productos = await this.comparaCart(productos);
            }
            resolve(productos);
          });
      } else {
        const x = this.db.list(`negocios/productos/${categoria}/${id}/${pasillo}`, data =>
          data.orderByKey().limitToFirst(batch)).valueChanges().subscribe(async (productos: Producto[]) => {
            x.unsubscribe();
            if (this.cart.length > 0) {
              productos = await this.comparaCart(productos);
            }
            resolve(productos);
          });
      }
    });
  }

  comparaCart(productos: Producto[]): Promise<Producto[]> {
    return new Promise((resolve, reject) => {
      if (this.cart.length > 0) {
        for (let index = 0; index < productos.length; index++) {
          const i = this.cart.findIndex(c => c.id === productos[index].id);
          if (i >= 0) {
            productos[index] = this.cart[i];
          }
        }
        resolve(productos);
      } else {
        resolve(productos);
      }
    });
  }

  // Para info modal

  getSucursalNegocio(categoria, id): Promise<DetallesNegocio> {
    return new Promise((resolve, reject) => {
      const detSub = this.db.object(`negocios/detalles/${categoria}/${id}`).valueChanges()
        .subscribe((detalles: DetallesNegocio) => {
          detSub.unsubscribe();
          resolve(detalles);
        });
    });
  }

  getHorario(idNegocio: string): Promise<Dia[]> {
    return new Promise((resolve, reject) => {
      const horSub = this.db.object(`horario/fechas/${idNegocio}`).valueChanges()
        .subscribe((horario: Dia[]) => {
          horSub.unsubscribe();
          resolve(horario);
        });
    });
  }

  // Para barra búsqueda en Home

  getPalabrasClave(): Promise<NegocioBusqueda[]> {
    const region = this.uidService.getRegion();
    return new Promise((resolve, reject) => {
      const negSub = this.db.list(`busqueda/${region}`).valueChanges().subscribe((neg: NegocioBusqueda[]) => {
        negSub.unsubscribe();
        neg = neg.filter(n => n.idNegocio);
        resolve(neg)
      });
    });
  }

}
