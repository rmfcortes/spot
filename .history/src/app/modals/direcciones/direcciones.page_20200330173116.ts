import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { } from 'googlemaps';

import { DisparadoresService } from 'src/app/services/disparadores.service';
import { CartService } from 'src/app/services/cart.service';
import { UidService } from 'src/app/services/uid.service';

import { Direccion, Ubicacion } from 'src/app/interfaces/direcciones';
import { Region } from 'src/app/interfaces/region.interface';

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
  region: Region
  regiones: Region[] = []
  polygon: any;

  zoom = 17;
  dirReady = false;
  lejos = false;

  icon = '../../../assets/img/iconos/pin.png';

  back: Subscription
  sugerencias = []

  hasRegion = true

  constructor(
    private ngZone: NgZone,
    private platform: Platform,
    private modalCtrl: ModalController,
    private alertService: DisparadoresService,
    private cartService: CartService,
    private uidService: UidService,
  ) { }

  ngOnInit() {
    const region = this.uidService.getRegion()
    if (region) this.getPolygon()
    else this.getPoligonos()
    this.getDirecciones()
  }

  getDirecciones() {
    this.cartService.getDirecciones()
    .then(direcciones => this.direcciones = direcciones)
    .catch(err => console.log(err))
  }

  getPolygon() {
    this.cartService.getPolygon().then(ubicacion => {
      this.hasRegion = true
      this.paths = ubicacion
      this.polygon = new google.maps.Polygon({paths: ubicacion})
    });
  }

  getPoligonos() {
    this.cartService.getPolygons().then(regiones => {
      this.hasRegion = false
      this.regiones = regiones
      console.log(this.regiones);
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
    const map = google.maps
    geocoder.geocode({'placeId': id}, (results, status) => {
      this.ngZone.run(async () => {
        if (status === 'OK') {
          if (results[0]) {
            const place = results[0]
            let dentro = false
            console.log(this.hasRegion)
            if (this.hasRegion) dentro = await map.geometry.poly.containsLocation(place.geometry.location, this.polygon)
            else {
              for (const region of this.regiones) {
                this.polygon = await new map.Polygon({paths: region.ubicacion})
                dentro = await map.geometry.poly.containsLocation(place.geometry.location, this.polygon)
                if (dentro) {
                  this.region = region
                  break
                }
              }
            }
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
    const dentro = await google.maps.geometry.poly
    .containsLocation(new google.maps.LatLng(evento.coords.lat, evento.coords.lng), this.polygon)
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
    if (this.hasRegion) {
      this.cartService.guardarDireccion(this.direccion);
      this.modalCtrl.dismiss(this.direccion);
    }
    console.log(this.region);
  }

  regresar() {
    if (this.back) {this.back.unsubscribe()}
    this.modalCtrl.dismiss(null);
  }

}
