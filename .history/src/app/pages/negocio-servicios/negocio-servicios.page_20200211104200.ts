import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ModalController, IonInfiniteScroll } from '@ionic/angular';

import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { InfoSucursalPage } from 'src/app/modals/info-sucursal/info-sucursal.page';

import { DataTempService } from 'src/app/services/data-temp.service';
import { Servicio, PasilloServicio } from 'src/app/interfaces/servicios';
import { NegocioServiciosService } from 'src/app/services/negocio-servicios.service';

import { Negocio, DatosParaCuenta, InfoPasillos } from 'src/app/interfaces/negocio';
import { DisparadoresService } from 'src/app/services/disparadores.service';
import { ServicioPage } from 'src/app/modals/servicio/servicio.page';

@Component({
  selector: 'app-negocio-servicios',
  templateUrl: './negocio-servicios.page.html',
  styleUrls: ['./negocio-servicios.page.scss'],
})
export class NegocioServiciosPage implements OnInit {

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  portada: string;
  telefono: string;
  whats: string;
  categoria: string;

  negocio: Negocio;
  servicios: PasilloServicio[] = [];

  pasillos: InfoPasillos = {
    vista: '',
    portada: '',
    pasillos: []
  };
  yPasillo = 0;

  batch = 20;
  lastKey = '';
  noMore = false;

  infiniteCall = 1;
  serviciosCargados = 0;

  pasilloFiltro = '';
  cambiandoPasillo = false;

  hasOfertas = false;

  constructor(
    private router: Router,
    private callNumber: CallNumber,
    private socialSharing: SocialSharing,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private negServicios: NegocioServiciosService,
    private alertService: DisparadoresService,
    private dataTempService: DataTempService,
  ) { }

  ngOnInit() {
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
      this.negocio = await this.negServicios.getNegocioPreview(id, this.categoria, status);
    }
    this.getPasillos();
  }

  async getPasillos() {
    const detalles: InfoPasillos = await this.negServicios.getPasillos(this.categoria, this.negocio.id);
    this.portada = detalles.portada;
    this.telefono = detalles.telefono;
    this.pasillos.pasillos = detalles.pasillos;
    this.whats = detalles.whats;
    this.pasillos.pasillos = this.pasillos.pasillos.sort((a, b) => a.prioridad - b.prioridad);
    this.getInfoServicios();
  }

  // Get Servicios

  getOfertas() {
    this.negServicios.getOfertas(this.categoria, this.negocio.id).then(async (ofertas: Servicio[]) => {
      if (ofertas && ofertas.length > 0) {
        this.hasOfertas = true;
        this.agregaServicios(ofertas, 'Ofertas');
      } else {
        this.hasOfertas = false;
      }
      if (!this.pasilloFiltro) {
        this.getInfoServicios();
      }
    });
  }

  async getInfoServicios() {
    this.infiniteCall = 1;
    this.serviciosCargados = 0;
    this.getServices();
  }

  async getServices(event?) {
    return new Promise(async (resolve, reject) => {
      const servicios = await this.negServicios
        .getServicios(this.categoria, this.negocio.id, this.pasillos.pasillos[this.yPasillo].nombre, this.batch + 1, this.lastKey);
      this.cambiandoPasillo = false;
      if (servicios && servicios.length > 0) {
        this.lastKey = servicios[servicios.length - 1].id;
        this.evaluaServicios(servicios, event);
      } else if ( this.yPasillo + 1 < this.pasillos.pasillos.length ) {
        this.yPasillo++;
        this.lastKey = null;
        if (this.serviciosCargados < this.batch * this.infiniteCall) {
          this.getServices();
        }
      } else {
        this.noMore = true;
        if (event) { event.target.complete(); }
        resolve();
      }
    });
  }

  async evaluaServicios(servicios, event?) {
    if (servicios.length === this.batch + 1) {
      servicios.pop();
      return await this.agregaServicios(servicios, this.pasillos.pasillos[this.yPasillo].nombre, event);
    } else if (servicios.length === this.batch && this.yPasillo + 1 < this.pasillos.pasillos.length) {
      return await this.nextPasillo(servicios, event);
    } else if (this.yPasillo + 1 >= this.pasillos.pasillos.length) {
      this.noMore = true;
      if (event) { event.target.complete(); }
      return await this.agregaServicios(servicios, this.pasillos.pasillos[this.yPasillo].nombre, event);
    }
    if (servicios.length < this.batch && this.yPasillo + 1 < this.pasillos.pasillos.length) {
      await this.nextPasillo(servicios, event);
      if (this.serviciosCargados < this.batch * this.infiniteCall) {
        return this.getServices();
      }
    } else {
      this.agregaServicios(servicios, this.pasillos.pasillos[this.yPasillo].nombre, event);
      this.noMore = true;
    }
  }

  async nextPasillo(servicios, event?) {
    return new Promise(async (resolve, reject) => {
      await this.agregaServicios(servicios, this.pasillos.pasillos[this.yPasillo].nombre, event);
      this.yPasillo++;
      this.lastKey = null;
      resolve();
    });
  }

  async agregaServicios(servicios: Servicio[], pasillo, event?) {
    return new Promise(async (resolve, reject) => {
      this.serviciosCargados += servicios.length;
      if ( this.servicios.length > 0 && this.servicios[this.servicios.length - 1].nombre === pasillo) {
        this.servicios[this.servicios.length - 1].servicios = this.servicios[this.servicios.length - 1].servicios.concat(servicios);
      } else {
        const prodArray: PasilloServicio = {
          nombre: pasillo,
          servicios
        };
        this.servicios.push(prodArray);
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
    this.getServices(event);

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  // Al filtrar

  async getServFiltrados(event?) {
    const servicios = await this.negServicios
      .getServicios(this.categoria, this.negocio.id, this.pasilloFiltro, this.batch + 1, this.lastKey);
    this.cambiandoPasillo = false;
    this.lastKey = servicios[servicios.length - 1].id;
    this.cargaFiltrados(servicios, event);
  }

  cargaFiltrados(servicios, event) {
    if (servicios.length === this.batch + 1) {
      this.lastKey = servicios[servicios.length - 1].id;
      servicios.pop();
    } else {
      this.noMore = true;
    }
    if (this.servicios.length === 0) {
      this.servicios =  [{
        nombre: this.pasilloFiltro,
        servicios: [...servicios]
      }];
    } else {
      this.servicios =  [{
        nombre: this.pasilloFiltro,
        servicios: this.servicios[0].servicios.concat(servicios)
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
    this.servicios = [];
    this.serviciosCargados = 0;
    this.infiniteCall = 1;
    this.noMore = false;
    this.infiniteScroll.disabled = false;
    this.pasilloFiltro = pasillo;
    if (!pasillo || pasillo === 'Ofertas') {
      this.getOfertas();
    } else {
      this.getServFiltrados();
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
    this.getServFiltrados(event);

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  // Acciones

  async verServicio(servicio) {
    const modal = await this.modalController.create({
      component: ServicioPage,
      componentProps: {servicio}
    });

    return await modal.present();
  }

  llamar() {
    this.callNumber.callNumber(this.telefono.toString(), true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  async contactViaWhatsApp() {
    const tel = '+521' + this.whats;
    this.socialSharing.shareViaWhatsAppToReceiver(
      tel,
      'Hola, vi tu negocio en Mercapp, me interesa más información'
    ).then(resp => {
      console.log('Success');
    }).catch(err => {
      this.alertService.presentAlert('Error', err);
    });
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

  // Salida

  regresar() {
    this.router.navigate([`categoria/${this.categoria}`]);
  }

}
