import { Injectable } from '@angular/core';
import { Negocio } from '../interfaces/negocio';
import { Direccion } from '../interfaces/direcciones';


@Injectable({
  providedIn: 'root'
})
export class DataTempService {

  negocio: Negocio;
  direccionCliente: Direccion;
  direccionNegocio: Direccion;

  constructor() { }

  setNegocio(negocio: Negocio) {
    this.negocio = negocio;
  }

  getNegocio() {
    return this.negocio;
  }

  setDireccionCliente(direccion) {
    this.direccionCliente = direccion;
  }

  getDireccionCliente() {
    return this.direccionCliente;
  }

  setDireccionNegocio(direccion) {
    this.direccionNegocio = direccion;
  }

  getDireccionNegocio() {
    return this.direccionNegocio;
  }
}
