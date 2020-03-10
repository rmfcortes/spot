import { Injectable, NgZone } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { UidService } from './uid.service';

import { Pedido } from '../interfaces/pedido';
import { MasVendido } from '../interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(
    private ngZone: NgZone,
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  getPedidosActivos() {
    const uid = this.uidService.getUid();
    return this.db.list(`usuarios/${uid}/pedidos/activos`).valueChanges();
  }

  async createPedido(pedido: Pedido) {
    const uid = this.uidService.getUid();
    const idPedido = this.db.createPushId();
    pedido.id = idPedido;
    await this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}`).update(pedido);
    await this.db.object(`usuarios/${uid}/cart/${pedido.negocio.idNegocio}`).remove();
  }

  updateMasVendidos(pedido: Pedido, categoria: string) {
    pedido.productos.forEach(p => {
      const vendidos: MasVendido =  {
        categoria,
        descripcion: p.descripcion,
        id: p.id,
        idNegocio: pedido.negocio.idNegocio,
        nombre: p.nombre,
        nombreNegocio: pedido.negocio.nombreNegocio,
        precio: p.precio,
        url: p.url,
      }
      this.db.object(`vendidos/${p.id}/ventas`).query.ref.transaction(ventas => ventas ? ventas + p.cantidad : p.cantidad);
      this.db.object(`vendidos/${p.id}`).update(vendidos);
    });
  }

  getPedido(idPedido: string): Promise<Pedido> {
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid();
      const pedSub = this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}`).valueChanges()
        .subscribe((ped: Pedido) => {
          pedSub.unsubscribe();
          resolve(ped);
        });
    });
  }

  trackAcept(idPedido: string) {
    const uid = this.uidService.getUid();
    return this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}/aceptado`).valueChanges();
  }

  trackRepartidor(idPedido: string) {
    const uid = this.uidService.getUid();
    return this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}/repartidor`).valueChanges();
  }

  trackEntregado(idPedido: string) {
    const uid = this.uidService.getUid();
    return this.db.object(`usuarios/${uid}/pedidos/entregados/${idPedido}`).valueChanges();
  }

  trackUbicacion(idRepartidor: string) {
    return this.db.object(`ubicaciones/${idRepartidor}`).valueChanges();
  }

  getTelefono(): Promise<string>  {
    return new Promise((resolve, reject) => {
     const uid = this.uidService.getUid();
     const telSub = this.db.object(`usuarios/${uid}/datos/telefono`).valueChanges().subscribe((telefono: string) => {
       telSub.unsubscribe();
       resolve(telefono);
     });
    });
  }

  async guardarTelefono(tel: string) {
    const uid = this.uidService.getUid();
    await this.db.object(`usuarios/${uid}/datos/telefono`).set(tel);
 }

  listenCalificar() {
    const uid = this.uidService.getUid();
    const calRef = this.db.object(`entregados/${uid}`);
    calRef.query.ref.on('child_added', snapshot => {
      this.ngZone.run(() => {
        const idPedido = snapshot.val();
        });
      });
  }

}
