import { Component } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { LoginPage } from './modals/login/login.page';

import { UidService } from './services/uid.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  uidSub: Subscription;
  isLog = false;

  constructor(
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
        this.isLog = true;
      } else {
        this.isLog = false;
      }
    });
  }

  async login() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
    });

    return await modal.present();
  }

  salir() {
    this.authService.logout();
  }
}
