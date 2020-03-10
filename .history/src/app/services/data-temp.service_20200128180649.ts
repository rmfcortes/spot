import { Injectable } from '@angular/core';
import { Negocio } from '../interfaces/negocio';

@Injectable({
  providedIn: 'root'
})
export class DataTempService {

  negocio: Negocio;

  constructor() { }

  setNegocio(negocio: Negocio) {
    this.negocio = negocio;
  }

  getNegocio() {
    return this.negocio;
  }
}
