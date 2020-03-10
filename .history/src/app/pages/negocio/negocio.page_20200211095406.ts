import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, IonInfiniteScroll } from '@ionic/angular';

import { InfoSucursalPage } from 'src/app/modals/info-sucursal/info-sucursal.page';
import { ProductoPage } from 'src/app/modals/producto/producto.page';
import { CuentaPage } from 'src/app/modals/cuenta/cuenta.page';
import { LoginPage } from 'src/app/modals/login/login.page';

import { DataTempService } from 'src/app/services/data-temp.service';
import { NegocioService } from 'src/app/services/negocio.service';
import { CartService } from 'src/app/services/cart.service';
import { UidService } from 'src/app/services/uid.service';

import { Negocio, Pasillo, DatosParaCuenta, InfoPasillos, ProductoPasillo } from 'src/app/interfaces/negocio';
import { Producto } from 'src/app/interfaces/producto';

import { EnterAnimation } from 'src/app/animations/enter';


@Component({
  selector: 'app-negocio',
  templateUrl: './negocio.page.html',
  styleUrls: ['./negocio.page.scss'],
})
export class NegocioPage implements OnInit {

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  uid: string;
  categoria: string;

  negocio: Negocio;
  portada: string;
  vista: string;
  productos: ProductoPasillo[] = [];
  pasillos: InfoPasillos = {
    vista: '',
    portada: '',
    pasillos: []
  };

  infiniteCall: number;
  productosCargados: number;
  yPasillo = 0;

  batch = 5;
  lastKey = '';
  noMore = false;

  cuenta = 0;

  pasilloFiltro = '';
  cambiandoPasillo = false;

  hasOfertas = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private alertController: AlertController,
    private dataTempService: DataTempService,
    private negocioService: NegocioService,
    private cartService: CartService,
    private uidService: UidService,
  ) { }

  // Get info inicial

  ngOnInit() {
    this.uid = this.uidService.getUid();
    this.categoria = this.activatedRoute.snapshot.paramMap.get('cat');
    this.getNegocio();
  }

  async getNegocio() {
    this.negocio = this.dataTempService.getNegocio();
    if (!this.negocio) {
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      const abierto = this.activatedRoute.snapshot.paramMap.get('status');
      let status;
      if (abierto === 'true') {
        status = 'abiertos';
      } else {
        status = 'cerrados';
      }
      this.negocio = await this.negocioService.getNegocioPreview(id, this.categoria, status);
    }
    this.cuenta = await this.negocioService.getCart(this.uid, this.negocio.id);
    this.getPasillos();
  }

  async getPasillos() {
    const detalles: InfoPasillos = await this.negocioService.getPasillos(this.categoria, this.negocio.id);
    this.portada = detalles.portada;
    this.vista = detalles.vista;
    this.pasillos.pasillos = detalles.pasillos;
    this.pasillos.pasillos = this.pasillos.pasillos.sort((a, b) => a.prioridad - b.prioridad);
    this.getOfertas();
  }

  // Get Productos

  getOfertas() {
    this.negocioService.getOfertas(this.categoria, this.negocio.id).then(async (ofertas: Producto[]) => {
      if (ofertas && ofertas.length > 0) {
        this.hasOfertas = true;
        this.agregaProductos(ofertas, 'Ofertas');
      } else {
        this.hasOfertas = false;
      }
      if (!this.pasilloFiltro) {
        this.getInfoProdsLista();
      }
    });
  }

  async getInfoProdsLista() {
    this.infiniteCall = 1;
    this.productosCargados = 0;
    this.getProds();
  }

  async getProds(event?) {
    return new Promise(async (resolve, reject) => {
      const productos = await this.negocioService
      .getProductosLista(this.categoria, this.negocio.id, this.pasillos[this.yPasillo], this.batch + 1, this.lastKey);
      this.cambiandoPasillo = false;
      if (productos && productos.length > 0) {
        this.lastKey = productos[productos.length - 1].id;
        this.evaluaProdsLista(productos, event);
      } else if ( this.yPasillo + 1 < this.pasillos.pasillos.length ) {
        this.yPasillo++;
        this.lastKey = null;
        if (this.productosCargados < this.batch * this.infiniteCall) {
          this.getProds();
        }
      } else {
        this.noMore = true;
        if (event) { event.target.complete(); }
        resolve();
      }
    });
  }

  async evaluaProdsLista(productos, event?) {
    if (productos.length === this.batch + 1) {
      productos.pop();
      return await this.agregaProductos(productos, this.pasillos[this.yPasillo], event);
    } else if (productos.length === this.batch && this.yPasillo + 1 < this.pasillos.pasillos.length) {
      return await this.nextPasillo(productos, event);
    } else if (this.yPasillo + 1 >= this.pasillos.pasillos.length) {
      this.noMore = true;
      if (event) { event.target.complete(); }
      return await this.agregaProductos(productos, this.pasillos[this.yPasillo], event);
    }
    if (productos.length < this.batch && this.yPasillo + 1 < this.pasillos.pasillos.length) {
      await this.nextPasillo(productos, event);
      if (this.productosCargados < this.batch * this.infiniteCall) {
        return this.getProds();
      }
    } else {
      this.agregaProductos(productos, this.pasillos[this.yPasillo], event);
      this.noMore = true;
    }
  }

  async nextPasillo(productos, event?) {
    return new Promise(async (resolve, reject) => {
      await this.agregaProductos(productos, this.pasillos[this.yPasillo], event);
      this.yPasillo++;
      this.lastKey = null;
      resolve();
    });
  }

  async agregaProductos(prod: Producto[], pasillo, event?) {
    return new Promise(async (resolve, reject) => {
      this.productosCargados += prod.length;
      if ( this.productos.length > 0 && this.productos[this.productos.length - 1].nombre === pasillo) {
        this.productos[this.productos.length - 1].productos = this.productos[this.productos.length - 1].productos.concat(prod);
      } else {
        const prodArray: ProductoPasillo = {
          nombre: pasillo,
          productos: prod
        };
        this.productos.push(prodArray);
      }
      if (event) { event.target.complete(); }
      resolve();
    });
  }

  loadDataLista(event) {
    if (this.cambiandoPasillo) {
      event.target.complete();
      return;
    }
    this.infiniteCall++;
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    this.getProds(event);

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  // Acciones
  async muestraProducto(producto: Producto) {
    const modal = await this.modalController.create({
      component: ProductoPage,
      componentProps: {producto, idNegocio: this.negocio.id}
    });
    modal.onWillDismiss().then(resp => {
      if (resp.data) {
        this.cuenta += producto.total;
        this.cartService.updateCart(this.negocio.id, producto);
      }
    });
    return await modal.present();
  }

  addProduct(producto: Producto) {
    if (!this.uid) {
      this.uid = this.uidService.getUid();
      if (!this.uid) {
        this.presentAlertNotLogin();
      }
    }
    if (this.vista === 'lista') {
      this.muestraProducto(producto);
    } else {
      producto.cantidad = 0;
      producto.total = producto.precio;
      this.plusProduct(producto);
    }
    return;
  }

  minusProduct(producto: Producto) {
    producto.cantidad--;
    this.cuenta -= producto.precio;
    producto.total -= producto.precio;
    if (producto.complementos && producto.complementos.length > 0) {
      producto.complementos.forEach(c => {
        this.cuenta -= c.precio;
        producto.total -= c.precio;
      });
    }
    if (producto.cantidad === 0) {
      this.cartService.deleteProd(this.negocio.id, producto);
    } else {
      this.cartService.updateCart(this.negocio.id, producto);
    }
    return;
  }

  plusProduct(producto: Producto) {
    producto.cantidad++;
    this.cuenta += producto.precio;
    producto.total += producto.precio;
    if (producto.complementos && producto.complementos.length > 0) {
      producto.complementos.forEach(c => {
        this.cuenta += c.precio;
        producto.total += c.precio;
      });
    }
    this.cartService.updateCart(this.negocio.id, producto);
    return;
  }

  async verCuenta() {
    const datos: DatosParaCuenta = {
      logo: this.negocio.foto,
      nombreNegocio: this.negocio.nombre,
      idNegocio: this.negocio.id,
      categoria: this.categoria
    };
    const modal = await this.modalController.create({
      component: CuentaPage,
      enterAnimation: EnterAnimation,
      componentProps: {cuenta: this.cuenta, datos}
    });
    modal.onWillDismiss().then(async (resp) => {
      this.cuenta = await this.negocioService.getCart(this.uid, this.negocio.id);
    });
    return await modal.present();
  }

  async getProdsFiltrados(event?) {
    const productos = await this.negocioService
      .getProductosLista(this.categoria, this.negocio.id, this.pasilloFiltro, this.batch + 1, this.lastKey);
    this.cambiandoPasillo = false;
    this.lastKey = productos[productos.length - 1].id;
    this.cargaFiltrados(productos, event);
  }

  cargaFiltrados(productos, event) {
    if (productos.length === this.batch + 1) {
      this.lastKey = productos[productos.length - 1].id;
      productos.pop();
    } else {
      this.noMore = true;
    }
    if (this.productos.length === 0) {
      this.productos =  [{
        nombre: this.pasilloFiltro,
        productos: [...productos]
      }];
    } else {
      this.productos =  [{
        nombre: this.pasilloFiltro,
        productos: this.productos[0].productos.concat(productos)
      }];
    }
    if (event) {
      event.target.complete();
    }
  }

  resetProds(pasillo?) {
    this.cambiandoPasillo = true;
    this.lastKey = '';
    this.yPasillo = 0;
    this.productos = [];
    this.productosCargados = 0;
    this.infiniteCall = 1;
    this.noMore = false;
    this.infiniteScroll.disabled = false;
    this.pasilloFiltro = pasillo;
    if (!pasillo || pasillo === 'Ofertas') {
      this.getOfertas();
    } else {
      this.getProdsFiltrados();
    }
  }

  loadDataListaFiltrada(event) {
    if (this.cambiandoPasillo) {
      event.target.complete();
      return;
    }
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    this.getProdsFiltrados(event);

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  async verInfo() {
    const datos: DatosParaCuenta = {
      logo: this.negocio.foto,
      nombreNegocio: this.negocio.nombre,
      idNegocio: this.negocio.id,
      categoria: this.categoria
    };
    const modal = await this.modalController.create({
      component: InfoSucursalPage,
      componentProps : {datos}
    });

    return await modal.present();
  }

  // Login
  async presentLogin() {
    const modal = await this.modalController.create({
      component: LoginPage,
      cssClass: 'my-custom-modal-css',
    });
    return await modal.present();
  }

  // Salida

  regresar() {
    this.router.navigate([`categoria/${this.categoria}`]);
  }

  // Mensajes

  async presentAlertNotLogin() {
    const alert = await this.alertController.create({
      header: 'Inicia sesión',
      message: `Para darte la mejor experiencia, por favor inicia sesión antes de continuar con tu pedido. <br> ¡Es muy sencillo!`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'tertiary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Iniciar sesión',
          cssClass: 'primary',
          handler: (blah) => {
            this.presentLogin();
          }
        }
      ]
    });

    await alert.present();
  }

}
