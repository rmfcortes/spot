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
    return this.db.object(`usuarios/${uid}/pedidos/activos/${idPedido}/entregado`).valueChanges();
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

}
