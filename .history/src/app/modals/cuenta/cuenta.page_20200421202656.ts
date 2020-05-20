import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { DireccionesPage } from '../direcciones/direcciones.page';
import { FormasPagoPage } from '../formas-pago/formas-pago.page';
import { ProductoPage } from '../producto/producto.page';

import { DisparadoresService } from 'src/app/services/disparadores.service';
import { NegocioService } from 'src/app/services/negocio.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { PagosService } from 'src/app/services/pagos.service';
import { CartService } from 'src/app/services/cart.service';
import { UidService } from 'src/app/services/uid.service';

import { Pedido, DatosNegocioParaPedido, Cliente } from 'src/app/interfaces/pedido';
import { DatosParaCuenta, ProductoPasillo } from 'src/app/interfaces/negocio';
import { FormaPago } from 'src/app/interfaces/forma-pago.interface';
import { Direccion } from 'src/app/interfaces/direcciones';
import { Producto } from 'src/app/interfaces/producto';

import { enterAnimationDerecha } from 'src/app/animations/enterDerecha';
import { leaveAnimationDerecha } from 'src/app/animations/leaveDerecha';
import { enterAnimation } from 'src/app/animations/enter';
import { leaveAnimation } from 'src/app/animations/leave';
import { AnimationsService } from 'src/app/services/animations.service';

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
  formaPago: FormaPago;

  direcciones = [];

  back: Subscription;
  infoReady = false;

  loading = false;

  constructor(
    private router: Router,
    private platform: Platform,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private animationService: AnimationsService,
    private alertSerivce: DisparadoresService,
    private negocioService: NegocioService,
    private pedidoService: PedidoService,
    private pagoService: PagosService,
    private cartService: CartService,
    private uidService: UidService,
  ) { }

  ngOnInit() {
    this.getDireccion()
    this.back = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.closeCart()
    });
  }
  
  getDireccion() {
    this.cartService.getUltimaDireccion().then(dir => {
      this.direccion = dir;
      this.getCart()
    });
  }

  getCart() {
    this.cartService.getCart(this.datos.idNegocio).then((cart: Producto[]) => {
      this.cart = cart;
      console.log(this.cart);
      this.getInfo()
    });
  }

  getInfo() {
    this.cartService.getInfoNegocio(this.datos.categoria, this.datos.idNegocio).then(neg => {
      this.datosNegocio = neg;
      this.getFormaPago()
      Object.assign(this.datosNegocio, this.datos);
    });
  }

  getFormaPago() {
    this.cartService.getUltimaFormaPago().then(dir => {
      this.formaPago = dir;
      this.infoReady = true;
    });
  }


  // Acciones

  async muestraProducto(producto: Producto) {
    const modal = await this.modalCtrl.create({
      component: ProductoPage,
      enterAnimation,
      leaveAnimation,
      componentProps: {producto, idNegocio: this.datos.idNegocio}
    });
    modal.onWillDismiss().then(async (resp) => {
      if (resp.data) {
        const uid = this.uidService.getUid()
        producto = await this.cartService.updateCart(this.datos.idNegocio, producto);
        this.cuenta = await this.negocioService.getCart(uid, this.datos.idNegocio);
      }
    });
    return await modal.present();
  }

  async mostrarDirecciones() {
    const modal = await this.modalCtrl.create({
      component: DireccionesPage,
      enterAnimation,
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

  async formasPago() {
    const modal = await this.modalCtrl.create({
      component: FormasPagoPage,
      enterAnimation: enterAnimationDerecha,
      leaveAnimation: leaveAnimationDerecha
    })
    modal.onWillDismiss().then(resp => {
      if (resp.data) this.formaPago = resp.data
    })

    return await modal.present()
  }

  // Salida

  async ordenar() {
    this.loading = true
    if (!this.direccion) {
      this.alertSerivce.presentAlertAction(
        'Agrega dirección',
        'Por favor agrega una dirección de entrega antes de continuar con el pedido.')
        .then(resp => {
          if (resp) this.mostrarDirecciones()
          return
        })
      return
    }
    if (!this.formaPago) {
      this.alertSerivce.presentAlertAction(
        'Forma de pago',
        'Antes de continuar por favor agrega una forma de pago'
      ).then(resp => {
        if (resp) this.formasPago()
        return
      })
      return
    }
    try {      
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
        nombre: this.uidService.getNombre() || 'No registrado',
        telefono,
        uid: this.uidService.getUid()
      };
      const pedido: Pedido = {
        aceptado: false,
        cliente,
        negocio: this.datosNegocio,
        productos: this.cart,
        total: this.cuenta + this.datosNegocio.envio,
        categoria: this.datos.categoria,
        entrega: this.datosNegocio.entrega || 'indefinido',
        avances: [],
        formaPago: this.formaPago
      };
      if (this.formaPago.tipo !== 'efectivo') {
        await this.pagoService.cobrar(pedido)
      }
      await this.pedidoService.createPedido(pedido);
      this.router.navigate(['/avances', pedido.id])
      this.loading = false
      this.closeCart();
    } catch (error) {
      this.loading = false
      this.alertSerivce.presentAlert('Error', 'Lo sentimos algo salió mal, por favor intenta de nuevo ' + error);
    }
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

  ionImgWillLoad(image) {
    this.animationService.enterAnimation(image.target)
  }

}
