import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { UidService } from './uid.service';
import { Pedido } from '../interfaces/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) { }

  getPedidosActivos(): Promise<Pedido[]> {
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid();
      const pedSub = this.db.list(`usuarios/${uid}/pedidos/activos`).valueChanges()
        .subscribe((ped: Pedido[]) => {
          pedSub.unsubscribe();
          resolve(ped);
        });
    });
  }

  async createPedido(pedido: Pedido) {
    const uid = this.uidService.getUid();
    const idPedido = this.db.createPushId();
    pedido.id = idPedido;
    await this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}`).update(pedido);
    await this.db.object(`usuarios/${uid}/cart/${pedido.negocio.idNegocio}`).remove();
  }

  getPedido(idPedido): Promise<Pedido> {
    return new Promise((resolve, reject) => {
      const uid = this.uidService.getUid();
      const pedSub = this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}`).valueChanges()
        .subscribe((ped: Pedido) => {
          pedSub.unsubscribe();
          resolve(ped);
        });
    });
  }

  trackAcept(idPedido) {
    const uid = this.uidService.getUid();
    return this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}`).valueChanges();
  }

}
