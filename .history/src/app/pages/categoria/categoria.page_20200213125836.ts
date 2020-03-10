import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';

import { OfertasPage } from 'src/app/modals/ofertas/ofertas.page';

import { CategoriasService } from 'src/app/services/categorias.service';
import { DataTempService } from 'src/app/services/data-temp.service';
import { OfertasService } from 'src/app/services/ofertas.service';

import { Negocio, Oferta, InfoGral } from 'src/app/interfaces/negocio';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;

  categoria: string;
  subCategorias: string[];
  ofertas: Oferta[] = [];
  negocios: Negocio[] = [];
  status = 'abiertos';

  lastKey = '';
  lastValue = null;
  batch = 7;
  noMore = false;

  batchOfertas = 3;
  hayMas = false;

  subCategoria = 'todos';

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.2,
    speed: 400,
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController,
    private categoriaService: CategoriasService,
    private ofertaService: OfertasService,
    private dataTemp: DataTempService,
  ) { }

  // Carga datos iniciales

  ngOnInit() {
    this.categoria = this.activatedRoute.snapshot.paramMap.get('cat');
    this.getSubCategorias();
    this.getOfertas();
    this.getNegocios();
  }

  async getSubCategorias() {
    this.subCategorias = await this.categoriaService.getSubCategorias(this.categoria);
    this.subCategorias.unshift('todos');
  }

  async getOfertas() {
    this.ofertaService.getOfertas(this.batchOfertas + 1, this.categoria).then((ofertas: Oferta[]) => {
      if (ofertas.length === this.batchOfertas + 1) {
        this.hayMas = true;
        ofertas.shift();
      }
      this.ofertas = ofertas.reverse();
    });
  }

  async getNegocios(event?) {
    const negocios = await this.categoriaService
      .getNegocios(this.status, this.categoria, this.subCategoria, this.batch + 1, this.lastKey, this.lastValue);
    if (negocios.length === this.batch + 1) {
      this.lastKey = negocios[0].id;
      this.lastValue = negocios[0].rate;
      negocios.shift();
    } else if (this.status === 'abiertos') {
      this.status = 'cerrados';
      this.lastKey = '';
      this.lastValue = '';
      this.negocios = this.negocios.concat(negocios.reverse());
      if (event) { event.target.complete(); }
      this.getNegocios(event);
      return;
    } else {
      this.noMore = true;
    }
    this.negocios = this.negocios.concat(negocios.reverse());
    if (event) { event.target.complete(); }
  }

  // Ver negocio

  async verNegocio(negocio: Negocio) {
    this.dataTemp.setNegocio(negocio);
    const infoNeg: InfoGral = await this.ofertaService.getStatus(negocio.id);
    if (negocio.tipo === 'productos') {
      this.router.navigate([`negocio/${this.categoria}/${negocio.id}/${infoNeg.abierto}`]);
    } else {
      this.router.navigate([`negocio-servicios/${this.categoria}/${negocio.id}/${infoNeg.abierto}`]);
    }
  }

  async verOfertas() {
    const modal = await this.modalController.create({
      component: OfertasPage,
      componentProps: {categoria: this.categoria, batch: this.batchOfertas}
    });

    return modal.present();
  }

  async irAOferta(oferta: Oferta) {
    const infoNeg: InfoGral = await this.ofertaService.getStatus(oferta.idNegocio);
    this.router.navigate(['/negocio', infoNeg.categoria, oferta.idNegocio, infoNeg.abierto]);
  }

  // Filtra por categoria

  async getNegociosSub(subCategoria) {
    this.subCategoria = subCategoria;
    this.negocios = [];
    this.lastValue = null;
    this.lastKey = '';
    this.noMore = false;
    this.status = 'abiertos';
    this.infiniteScroll.disabled = false;
    this.getNegocios();
  }

  // Infinite Scroll

  async loadData(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    this.getNegocios(event);
    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

}
