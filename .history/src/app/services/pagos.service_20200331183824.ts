import { Injectable } from '@angular/core';

import { HTTP } from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(
    private http: HTTP,
  ) { }

  newClient() {
    const httpOptions = {
      method: 'post',
      data: {id: 15, message: 'test'},
      headers: {Authorization: 'secret-key-test'}
     };
     let data = {name: 'Dale Nguyen'};
     this.http.post('https://us-central1-dale-nguyen.cloudfunctions.net/request', data, {Authorization: 'secret-key-test'})
     .then(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
      }
     )
  }

}
