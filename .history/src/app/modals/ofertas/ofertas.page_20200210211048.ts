import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OfertasService } from 'src/app/services/ofertas.service';
import { Oferta } from 'src/app/interfaces/negocio';
import { Router } from '@angular/router';

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
    private ofertaService: OfertasService,
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

  verOferta(oferta: Oferta) {
    this.router.navigate([`negocio/${oferta.categoria}/${oferta.idNegocio}/${oferta.abierto}`]);
    this.modalCtrl.dismiss();
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
