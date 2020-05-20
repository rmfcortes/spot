import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HTTP } from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(
    private http: HTTP,
    private platform: Platform,
    private httpAngular: HttpClient

  ) { }

  newClient(card) {
    if (this.platform.is ('cordova')) {
      this.http.post('https://us-central1-revistaojo-9a8d3.cloudfunctions.net/request', card, {Authorization: 'secret-key-test'})
      .then(
       res => {
         console.log(res);
       },
       err => {
         console.log("Error occured");
       }
      )
    } else {

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'secret-key'
        })
       };
       this.httpAngular.post('https://us-central1-revistaojo-9a8d3.cloudfunctions.net/request', card, httpOptions)
       .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
       )

    }
  }

}
