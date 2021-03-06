import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OfertasService } from 'src/app/services/ofertas.service';
import { Oferta, InfoGral } from 'src/app/interfaces/negocio';
import { Router } from '@angular/router';
import { UidService } from 'src/app/services/uid.service';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-ofertas',
  templateUrl: './ofertas.page.html',
  styleUrls: ['./ofertas.page.scss'],
})
export class OfertasPage implements OnInit {

  @Input() categoria;
  @Input() batch;

  lastKey = '';
  ofertas: Oferta[] = [];

  noMore = false;

  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private categoriaService: CategoriasService,
    private ofertaService: OfertasService,
    private uidService: UidService,
  ) { }

  ngOnInit() {
    this.getOfertas();
  }

  // Carga de ofertas

  getOfertas(event?) {
    this.ofertaService.getOfertasModal(this.categoria, this.batch + 1, this.lastKey)
      .then((ofertas: Oferta[]) => {
        this.cargaOfertas(ofertas, event);
      });
  }

  cargaOfertas(ofertas, event) {
    if (ofertas.length === this.batch + 1) {
      this.lastKey = ofertas[0].id;
      ofertas.shift();
    } else {
      this.noMore = true;
    }
    this.ofertas = this.ofertas.concat(ofertas.reverse());
    if (event) {
      event.target.complete();
    }
  }

  async loadData(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    this.getOfertas(event);
    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  // Acciones

  async verOferta(oferta: Oferta) {
    const uid = this.uidService.getUid();
    if (uid) {
      this.categoriaService.setVisitaNegocio(uid, oferta.idNegocio);
    }
    const infoNeg: InfoGral = await this.ofertaService.getStatus(oferta.idNegocio);
    this.router.navigate(['/negocio', infoNeg.categoria, oferta.idNegocio, infoNeg.abierto]);
    this.modalCtrl.dismiss();
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
