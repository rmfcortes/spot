import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { } from 'googlemaps';

import { DisparadoresService } from 'src/app/services/disparadores.service';
import { CartService } from 'src/app/services/cart.service';

import { Direccion, Ubicacion } from 'src/app/interfaces/direcciones';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
})
export class DireccionesPage implements OnInit {

  direcciones: Direccion[]

  inputDir = '';
  direccion: Direccion = {
    direccion: '',
    lat: null,
    lng: null
  };

  paths: Ubicacion[] = []
  polygon: any;

  zoom = 17;
  dirReady = false;
  lejos = false;

  icon = '../../../assets/img/iconos/pin.png';

  back: Subscription;
  sugerencias = [];

  constructor(
    private ngZone: NgZone,
    private platform: Platform,
    private modalCtrl: ModalController,
    private alertService: DisparadoresService,
    private cartService: CartService,
  ) { }

  ngOnInit() {
    this.getPolygon();
    this.getDirecciones()
  }

  getDirecciones() {
    this.cartService.getDirecciones()
    .then(direcciones => this.direcciones = direcciones)
    .catch(err => console.log(err))
  }

  getPolygon() {
    this.cartService.getPolygon().then(ubicacion => {
      this.paths = ubicacion
      this.polygon = new google.maps.Polygon({paths: ubicacion})
    });
  }

  ionViewWillEnter() {
    this.back = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.regresar();
    });
  }

  updateSearchResults(){
    if (this.inputDir === '') {
      return;
    }
    const pred = new google.maps.places.AutocompleteService();
    pred.getPlacePredictions({ input: this.inputDir },
    (predictions, status) => {
      this.ngZone.run(() => {
          this.sugerencias = predictions;
        });
      });
  }

  dirSelectedGuardada(dir: Direccion) {
    this.direccion = dir
    this.inputDir = '';
    this.sugerencias = []
    this.dirReady = true;
    this.alertService.presentToast('De ser necesario, puedes mover el pin a tu ubicación exacta');
  }

  dirSelected(id: string) {
    const geocoder = new google.maps.Geocoder
    geocoder.geocode({'placeId': id}, (results, status) => {
      this.ngZone.run(async () => {
        if (status === 'OK') {
          if (results[0]) {
            const place = results[0]
            const dentro = google.maps.geometry.poly.containsLocation(place.geometry.location, this.polygon)
            if (dentro) {
              this.direccion.lat = place.geometry.location.lat();
              this.direccion.lng = place.geometry.location.lng();
              this.direccion.direccion = place.formatted_address;
              this.inputDir = '';
              this.sugerencias = []
              this.dirReady = true;
              this.alertService.presentToast('De ser necesario, puedes mover el pin a tu ubicación exacta');
            } else {
              this.dirReady = false;
              this.alertService.presentAlert('Fuera de cobertura',
                'Lo sentimos. Por el momento no tenemos cobertura de reparto en tu zona.');
            }
          }
        }
      })
    })
  }

  async guardaLoc(evento) {
    const dentro = google.maps.geometry.poly
    .containsLocation(new google.maps.LatLng(evento.coords.lat, evento.coords.lng), this.polygon)
    console.log(dentro);
    if (dentro) {
      this.lejos = false;
      this.direccion.lat = evento.coords.lat;
      this.direccion.lng = evento.coords.lng;
    } else {
      this.lejos = true;
      this.alertService.presentAlert('Fuera de cobertura',
        'Lo sentimos. Por el momento no tenemos cobertura de reparto en tu zona.');
    }
  }

  setDireccion() {
    this.cartService.guardarDireccion(this.direccion);
    this.modalCtrl.dismiss(this.direccion);
  }

  regresar() {
    if (this.back) {this.back.unsubscribe()}
    this.modalCtrl.dismiss(null);
  }

}
