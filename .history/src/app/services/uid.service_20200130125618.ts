import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UidService {

  uid: string;
  nombre: string;

  constructor() {  }

  setUid(uid) {
    this.uid = uid;
  }

  getUid() {
    return this.uid;
  }

  setNombre(nombre) {
    this.nombre = nombre;
  }

  getNombre() {
    return this.nombre;
  }

}
