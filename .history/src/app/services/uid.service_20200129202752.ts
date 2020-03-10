import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UidService {

  uid: string;

  constructor() {  }

  setUid(uid) {
    this.uid = uid;
  }

  getUid() {
    return this.uid;
  }

}
