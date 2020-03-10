import { Component } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { UidService } from './services/uid.service';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoginPage } from './modals/login/login.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  appPages = [];
  isLog = [
    {
      title : 'Historial pedidos',
      url   : '/mapa',
      icon  : 'cart'
    },
    {
      title : 'Perfil',
      url   : '/balance',
      icon  : 'person'
    },
    {
      title : 'Soporte',
      url   : '/usuarios',
      icon  : 'contacts'
    },
  ];

  notLog =  [
    {
      title : 'Iniciar sesión',
      boton   : this.iniciarSesion,
      icon  : 'cart'
    },
    {
      title : 'Soporte',
      boton   : 'soporte',
      icon  : 'contacts'
    },
  ];

  uidSub: Subscription;

  constructor(
    private router: Router,
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private uidService: UidService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.getUser();
    });
  }

  getUser() {
    this.authService.getUser();
    this.uidSub = this.uidService.usuario.subscribe(uid => {
      console.log(uid);
      if (uid) {
        this.appPages = this.isLog;
      } else {
        this.appPages = this.notLog;
      }
    });
  }

  ir(item) {
    if (item.url) {
      this.router.navigate([`/${item.url}`]);
    } else {
      item.boton;
    }
  }

  async iniciarSesion() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
    });

    return await modal.present();
  }

  salir() {
    this.authService.logout();
  }
}
