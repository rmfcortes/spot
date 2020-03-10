import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DireccionesPage } from '../direcciones/direcciones.page';

import { DisparadoresService } from 'src/app/services/disparadores.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { CartService } from 'src/app/services/cart.service';
import { UidService } from 'src/app/services/uid.service';

import { Pedido, DatosNegocioParaPedido, Cliente } from 'src/app/interfaces/pedido';
import { DatosParaCuenta, ProductoPasillo } from 'src/app/interfaces/negocio';
import { Direccion } from 'src/app/interfaces/direcciones';
import { Producto } from 'src/app/interfaces/producto';

import { EnterAnimation } from 'src/app/animations/enter';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.page.html',
  styleUrls: ['./cuenta.page.scss'],
})
export class CuentaPage implements OnInit {

  @Input() cuenta: number;
  @Input() datos: DatosParaCuenta;
  @Input() productos: ProductoPasillo[];

  datosNegocio: DatosNegocioParaPedido;
  cart: Producto[];

  direccion: Direccion;

  direcciones = [];

  back: Subscription;

  constructor(
    private router: Router,
    private platform: Platform,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private alertSerivce: DisparadoresService,
    private pedidoService: PedidoService,
    private cartService: CartService,
    private uidService: UidService,
  ) { }

  ngOnInit() {
    this.getDireccion();
    this.getCart();
    this.getInfo();
    this.back = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.closeCart();
    });
  }

  getCart() {
    this.cartService.getCart(this.datos.idNegocio).then((cart: Producto[]) => {
      this.cart = cart;
    });
  }

  getDireccion() {
    this.cartService.getUltimaDireccion().then(dir => {
      this.direccion = dir;
    });
  }

  getInfo() {
    this.cartService.getInfoNegocio(this.datos.categoria, this.datos.idNegocio).then(neg => {
      this.datosNegocio = neg;
      Object.assign(this.datosNegocio, this.datos);
    });
  }

  // Acciones

  async changeDireccion() {
    this.direcciones = [];
    const direcciones: Direccion[] = await this.cartService.getDirecciones();
    direcciones.forEach(d => {
      this.direcciones.push({
        text: d.direccion,
        handler: async () => {
          this.direccion = d;
        }
      });
    });
    this.direcciones.push({
      text: '+ Nueva dirección',
      handler: async () => {
        this.mostrarDirecciones();
      }
    });
    this.presentActionSheet();
  }

  async mostrarDirecciones() {
    const modal = await this.modalCtrl.create({
      component: DireccionesPage,
      enterAnimation: EnterAnimation,
    });
    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        this.direccion = resp.data;
      }
    });
    return await modal.present();
  }

  plusProduct(i) {
    const unidad = this.cart[i].total / this.cart[i].cantidad;
    this.cart[i].cantidad++;
    this.cart[i].total += unidad;
    this.cuenta += unidad;
    this.cartService.updateCart(this.datosNegocio.idNegocio, this.cart[i]);
    this.productos.forEach(p => {
      const index = p.productos.findIndex(x => x.id === this.cart[i].id);
      console.log(index);
      if (index >= 0) {
        p.productos[index] = this.cart[i];
      }
    });
  }

  minusProduct(i) {
    if (this.cart[i].cantidad === 1) {
      this.alertSerivce.presentAlertAction('Quitar artículo', '¿Estás seguro que deseas eliminar este artículo?')
        .then(resp => {
          if (resp) {
            this.cartService.deleteProd(this.datosNegocio.idNegocio, this.cart[i]);
            this.cuenta -= this.cart[i].total;
            this.cart[i].cantidad = 0;
            this.cart[i].total = 0;
            this.productos.forEach(p => {
              const index = p.productos.findIndex(x => x.id === this.cart[i].id);
              console.log(index);
              if (index >= 0) {
                p.productos[index] = this.cart[i];
              }
            });
            this.cart.splice(i, 1);
            if (this.cuenta === 0) {
              this.closeCart();
            }
          }
        });
    } else {
      const unidad = this.cart[i].total / this.cart[i].cantidad;
      this.cart[i].cantidad--;
      this.cart[i].total -= unidad;
      this.cuenta -= unidad;
      this.productos.forEach(p => {
        const index = p.productos.findIndex(x => x.id === this.cart[i].id);
        console.log(index);
        if (index >= 0) {
          p.productos[index] = this.cart[i];
        }
      });
      this.cartService.updateCart(this.datosNegocio.idNegocio, this.cart[i]);
    }

  }

  // Salida

  async ordenar() {
    if (!this.direccion) {
      this.alertSerivce.presentAlertAction(
        'Agrega dirección',
        'Por favor agrega una dirección de entrega antes de continuar con el pedido.')
        .then(resp => {
          if (resp) {
           this.mostrarDirecciones();
          }
          return;
        });
      return;
    }
    const telefono: string = await this.pedidoService.getTelefono();
    if (!telefono) {
      const resp: any = await this.alertSerivce.presentPromptTelefono();
      let tel;
      if (resp) {
        tel = resp.telefono.replace(/ /g, "");
        if (tel.length === 10) {
          this.pedidoService.guardarTelefono(resp.telefono);
        } else {
          this.alertSerivce.presentAlert('Número incorrecto', 'El teléfono agregado es incorrecto, por favor intenta de nuevo');
          return;
        }
      }
    }
    const cliente: Cliente = {
      direccion: this.direccion,
      nombre: this.uidService.getNombre(),
      telefono,
      uid: this.uidService.getUid()
    };
    const pedido: Pedido = {
      aceptado: false,
      cliente,
      negocio: this.datosNegocio,
      productos: this.cart,
      total: this.cuenta + this.datosNegocio.envio,
      categoria: this.datos.categoria
    };
    this.pedidoService.createPedido(pedido);
    this.router.navigate(['/mapa', pedido.id]);
    this.closeCart();
  }

  closeCart() {
    if (this.back) {this.back.unsubscribe()}
    this.modalCtrl.dismiss(this.cuenta);
  }

  // Historial direcciones Action Sheet

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Direcciones',
      buttons: this.direcciones
    });
    await actionSheet.present();
  }

}
