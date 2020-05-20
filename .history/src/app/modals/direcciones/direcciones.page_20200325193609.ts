import { Component, OnInit, NgZone } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';


import { MapsAPILoader } from '@agm/core';
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

  inputDir = '';
  direccion: Direccion = {
    direccion: '',
    lat: null,
    lng: null
  };

  centro: Ubicacion = {
    lat: null,
    lng: null,
  };

  cobertura = 5;
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
    private mapsAPILoader: MapsAPILoader,
    private alertService: DisparadoresService,
    private cartService: CartService,
  ) { }

  ngOnInit() {
    this.getCentro();
  }

  getCentro() {
    this.cartService.getCentro().then(ubicacion => {
      this.centro.lat = ubicacion.lat;
      this.centro.lng = ubicacion.lng;
    });
  }

  ionViewWillEnter() {
    this.cambiarDir();
    this.back = this.platform.backButton.subscribeWithPriority(9999, () => {
      this.regresar();
    });
  }

  cambiarDir() {
    this.dirReady = false;
    setTimeout(() => {
      // this.setAutocomplete();
    }, 500);
  }

  updateSearchResults(){
    if (this.inputDir === '') {
      return;
    }
    const pred = new google.maps.places.AutocompleteService();
    pred.getPlacePredictions({ input: this.inputDir },
    (predictions, status) => {
      this.ngZone.run(() => {
          console.log(predictions);
          this.sugerencias = predictions;
        });
      });
  }

  dirSelected(id: string) {
    console.log(id);
    const geocoder = new google.maps.Geocoder
    geocoder.geocode({'placeId': id}, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log(results[0].geometry.location.lat())
        }
      }
    })
  }

  // setAutocomplete() {
  //   this.mapsAPILoader.load().then(async () => {
  //     const nativeHomeInputBox = document.getElementById('txtHome').getElementsByTagName('input')[0];
  //     const autocomplete = new google.maps.places.Autocomplete(nativeHomeInputBox, {
  //       types: ['address']
  //     });
  //     autocomplete.addListener('place_changed', () => {
  //         this.ngZone.run(async () => {
  //             // get the place result
  //             const place: google.maps.places.PlaceResult = autocomplete.getPlace();

  //             // verify result
  //             if (place.geometry === undefined || place.geometry === null) {
  //                 return;
  //             }
  //             // set latitude, longitude and zoom
  //             const d = await this.calculaDistancia(
  //               this.centro.lat,
  //               this.centro.lng,
  //               place.geometry.location.lat(),
  //               place.geometry.location.lng()
  //             );
  //             if (d <= this.cobertura) {
  //               this.direccion.lat = place.geometry.location.lat();
  //               this.direccion.lng = place.geometry.location.lng();
  //               this.direccion.direccion = place.formatted_address;
  //               this.inputDir = '';
  //               this.dirReady = true;
  //               this.alertService.presentToast('De ser necesario, puedes mover el pin a tu ubicación exacta');
  //             } else {
  //               this.dirReady = false;
  //               this.alertService.presentAlert('Fuera de cobertura',
  //                 'Lo sentimos. Por el momento no tenemos cobertura de reparto en tu zona.');
  //             }
  //         });
  //     });
  //   });
  // }

  async guardaLoc(evento) {
    const d = await this.calculaDistancia(
      this.centro.lat,
      this.centro.lng,
      evento.coords.lat,
      evento.coords.lng
    );
    if (d <= this.cobertura) {
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

  // Auxiliares

  calculaDistancia( lat1, lng1, lat2, lng2 ): Promise<number> {
    return new Promise ((resolve, reject) => {
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1);  // this.deg2rad below
      const dLon = this.deg2rad(lng2 - lng1);
      const a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
         Math.sin(dLon / 2) * Math.sin(dLon / 2)
         ;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Distance in kms
      resolve(d);
    });
  }

  deg2rad( deg ) {
    return deg * (Math.PI / 180);
  }

}
