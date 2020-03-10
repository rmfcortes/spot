import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public isConnected = new BehaviorSubject(true);
  connectSub: Subscription;
  disconnectSub: Subscription;

  reporte = [];

  constructor(
    private network: Network,
  ) { }

  checkNetStatus() {
    if (!this.disconnectSub) {
      this.disconnectSub = this.network.onDisconnect().subscribe(() => {
        const rep = {
          connect: false,
          time: Date.now()
        };
        this.reporte.push(rep);
        this.saveNetStatus();
        this.isConnected.next(false);
      });
    }

    if (!this.connectSub) {
      this.connectSub = this.network.onConnect().subscribe(() => {
        const rep = {
          connect: true,
          time: Date.now()
        };
        this.reporte.push(rep);
        this.saveNetStatus();
        this.isConnected.next(true);
      });
    }
  }

  saveNetStatus() {
    localStorage.setItem('netStatus', JSON.stringify(this.reporte));
  }

  getNetStatus() {
    return new Promise ( (resolve, reject) => {
        if ( localStorage.getItem('netStatus') ) {
          resolve(JSON.parse(localStorage.getItem('netStatus')));
        } else {
          resolve(null);
        }
    });
  }

  stopCheckNet() {
    if (this.disconnectSub) { this.disconnectSub.unsubscribe(); }
    if (this.connectSub) { this.connectSub.unsubscribe(); }
  }
}
