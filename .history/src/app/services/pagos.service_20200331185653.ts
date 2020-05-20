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

  newClient() {
    if (this.platform.is ('cordova')) {
      let data = {name: 'Dale Nguyen'};
      this.http.post('https://us-central1-revistaojo-9a8d3.cloudfunctions.net/request', data, {Authorization: 'secret-key-test'})
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
       let data = {name: 'Dale Nguyen'};
       this.httpAngular.post('https://us-central1-dale-nguyen.cloudfunctions.net/request', data, httpOptions)
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
