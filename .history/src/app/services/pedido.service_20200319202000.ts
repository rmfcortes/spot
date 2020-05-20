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

  listenEntregados() {
    const uid = this.uidService.getUid();
    return this.db.object(`usuarios/${uid}/pedidos/activos`);
  }

  async createPedido(pedido: Pedido) {
    const uid = this.uidService.getUid();
    const idPedido = this.db.createPushId();
    pedido.id = idPedido;
    await this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}`).update(pedido);
    await this.db.object(`usuarios/${uid}/cart/${pedido.negocio.idNegocio}`).remove();
  }

  getPedido(idPedido: string): Promise<Pedido> {
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid();
      const pedSub = this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}`).valueChanges()
        .subscribe((ped: Pedido) => {
          delete ped.avances
          pedSub.unsubscribe();
          resolve(ped);
        });
    });
  }

  trackAcept(idPedido: string) {
    const uid = this.uidService.getUid();
    return this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}/aceptado`).valueChanges();
  }

  trackAvances(idPedido: string) {
    const uid = this.uidService.getUid();
    return this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}/avances`);
  }

  trackRepartidor(idPedido: string) {
    const uid = this.uidService.getUid();
    return this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}/repartidor`).valueChanges();
  }

  trackEntregado(idPedido: string) {
    const uid = this.uidService.getUid();
    return this.db.object(`usuarios/${uid}/pedidos/historial/${idPedido}/entregado`).valueChanges();
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

  getToken(): Promise<string>  {
    return new Promise((resolve, reject) => {
     const uid = this.uidService.getUid();
     const tokSub = this.db.object(`usuarios/${uid}/token`).valueChanges().subscribe((token: string) => {
       tokSub.unsubscribe();
       resolve(token);
     });
    });
  }

}
