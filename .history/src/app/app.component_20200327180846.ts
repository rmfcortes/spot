import { Component, OnDestroy } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { UidService } from './services/uid.service';
import { AuthService } from './services/auth.service';
import { ChatPage } from './modals/chat/chat.page';
import { NetworkService } from './services/network.service';
import { VersionService } from './services/version.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnDestroy{

  uid: string;
  uidSub: Subscription;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private modalCtrl: ModalController,
    private versionService: VersionService,
    private netService: NetworkService,
    private authService: AuthService,
    private uidService: UidService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', (event) => {
          event.preventDefault();
          event.stopPropagation();
        }, false);
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.netService.checkNetStatus();
      this.getUser();
      this.versionService.checkUpdates();
      const script = document.createElement('script')
      script.src = 'https://cdn.conekta.io/js/latest/conekta.js'
      script.async = true
      document.body.appendChild(script)
      const jquery = document.createElement('script')
      jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js'
      jquery.async = true
      document.body.appendChild(jquery)
    });
  }

  getUser() {
    this.authService.getUser();
    this.uidSub = this.uidService.usuario.subscribe(uid => {
      this.uid = uid;
    });
  }

  async soporte() {
    const modal = await this.modalCtrl.create({
      component: ChatPage,
      componentProps: {
        idVendedor: 'soporte',
        idPedido: 'soporte',
        nombre: 'Soporte',
        foto: '../assets/img/avatar/soporte.jpg'
      }
    });

    return await modal.present();
  }

  salir() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.netService.stopCheckNet();
  }
}
