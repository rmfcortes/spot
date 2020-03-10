import { Component } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { LoginPage } from './modals/login/login.page';

import { UidService } from './services/uid.service';
import { AuthService } from './services/auth.service';
import { ChatPage } from './modals/chat/chat.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  uid: string;
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
      this.uid = uid;
    });
  }

  async login() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
    });

    return await modal.present();
  }

  async soporte() {
    const modal = await this.modalCtrl.create({
      component: ChatPage,
      cssClass: 'my-custom-modal',
      componentProps: {
        idVendedor: 'soporte',
        idPedido: this.uid,
        nombre: 'Soporte',
        foto: '../assets/img/avatar/soporte.jpg'
      }
    });

    return await modal.present();
  }

  salir() {
    this.authService.logout();
  }
}
