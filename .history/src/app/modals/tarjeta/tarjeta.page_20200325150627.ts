import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Tarjeta } from 'src/app/interfaces/tarjeta.interface';

import { enterAnimationAyuda } from 'src/app/animations/enterAyuda';
import { leaveAnimationAyuda } from 'src/app/animations/leaveAyuda';

import { AyudaPage } from '../ayuda/ayuda.page';
import { AnimationsService } from 'src/app/services/animations.service';

declare var Conekta: any;

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.page.html',
  styleUrls: ['./tarjeta.page.scss'],
})
export class TarjetaPage implements OnInit {

  tarjeta = {
    numero: null,
    expiracion: '',
    cvv: '',
    nombre: '',
  }

  titulo: string;
  mensaje: string;
  imagen: string
  cuadroAyuda: any;
  claseAyuda: any;

  imagenes =  {
    cvc: '../../../assets/img/cvc.jpg',
    fecha: '../../../assets/img/vencimiento.jpg'
  }

  constructor(
    private modalCtrl: ModalController,
    private animationService: AnimationsService,
  ) { }

  ngOnInit() {
    const key = Conekta.getPublicKey();
    console.log(key);
    Conekta.setPublicKey(key);
    Conekta.setLanguage('es');
  }

  async ayuda(titulo: string, mensaje: string, imagen: string) {
    this.titulo = titulo
    this.mensaje = mensaje
    this.imagen = this.imagenes[imagen]
    if (!this.claseAyuda) this.claseAyuda = document.querySelector('.cuadro-ayuda') as HTMLElement
    this.claseAyuda.style.setProperty('visibility', 'visible')
    if (!this.cuadroAyuda) this.cuadroAyuda= document.getElementById('ayuda')
    this.animationService.animEntradaDebajo(this.cuadroAyuda)
  }

  quitaAyuda() {
    this.claseAyuda.style.setProperty('visibility', 'hidden')
    this.animationService.salidaDebajo(this.cuadroAyuda)
  }

  borraNum() {
    if (this.tarjeta.numero.length === 5 ||
        this.tarjeta.numero.length === 10 ||
        this.tarjeta.numero.length === 15) this.tarjeta.numero = this.tarjeta.numero.substring(0, this.tarjeta.numero.length - 1)
  }

  numeroCambio() {
    if (this.tarjeta.numero.length === 4 ||
        this.tarjeta.numero.length === 9 || 
        this.tarjeta.numero.length === 14) this.tarjeta.numero = this.tarjeta.numero + ' '
  }

  borraVigencia() {
    if (this.tarjeta.expiracion.length === 3) this.tarjeta.expiracion = this.tarjeta.expiracion.substring(0, this.tarjeta.expiracion.length - 1)
  }

  vigenciaCambio() {
    if (this.tarjeta.expiracion.length === 2) this.tarjeta.expiracion = this.tarjeta.expiracion + '/'
  }

  moveFocus(nextElement) {
    nextElement.setFocus();
  }

  spaceKey(text: string) {
    this.tarjeta[text] = this.tarjeta[text].trim() 
    return
  }

  agregarTarjeta() {
    console.log(this.tarjeta);
    const vencimiento = this.tarjeta.expiracion.split('/');
    console.log(vencimiento);
    const newCard: Tarjeta = {
      number: this.tarjeta.numero,
      name: this.tarjeta.nombre,
      exp_year: '20' + vencimiento[1],
      exp_month: vencimiento[0],
      cvc: this.tarjeta.cvv
    }
    console.log(newCard);
    Conekta.card.validateNumber(newCard.number);
    Conekta.Token.create({card: newCard}, (response: any) => console.log(response))
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
