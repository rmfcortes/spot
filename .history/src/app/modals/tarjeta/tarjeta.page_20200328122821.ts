import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Tarjeta, TarjetaSafe } from 'src/app/interfaces/tarjeta.interface';

import { AnimationsService } from 'src/app/services/animations.service';
import { DisparadoresService } from 'src/app/services/disparadores.service';

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

  loading = false;

  constructor(
    private modalCtrl: ModalController,
    private animationService: AnimationsService,
    private commonService: DisparadoresService,
  ) { }

  ngOnInit() {
    Conekta.setPublicKey('key_D9tzmzTnFqz2xbkTdeqQ9ZA'); //key_D9tzmzTnFqz2xbkTdeqQ9ZA
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
    this.loading = true;
    const vencimiento = this.tarjeta.expiracion.split('/');
    const newCard: Tarjeta = {
      number: this.tarjeta.numero,
      name: this.tarjeta.nombre,
      exp_year: '20' + vencimiento[1],
      exp_month: vencimiento[0],
      cvc: this.tarjeta.cvv,
      tipo: ''
    }
    if (!Conekta.card.validateNumber(newCard.number)) return this.tarjetaInvalida('Número de tarjeta inválido.');
    if (!Conekta.card.validateExpirationDate(newCard.exp_month, newCard.exp_year)) return this.tarjetaInvalida('Fecha de vencimiento inválida');
    if (!Conekta.card.validateCVC(newCard.cvc)) return this.tarjetaInvalida('Código de seguridad inválido');
    newCard.tipo = Conekta.card.getBrand(newCard.number);
    console.log(newCard);
    Conekta.card.validateNumber(newCard.number);
    Conekta.Token.create({card: newCard}, (response: any) => {
      this.loading = false
      console.log(response)
      if (response.id && response.object !== 'error') {
        const data: TarjetaSafe = {
          tipo: newCard.tipo,
          last_four: newCard.number.slice(newCard.number.length - 4)
        }
        console.log(data);
        this.modalCtrl.dismiss(data);
      }
    }, err => {
      console.log(err);
      this.tarjetaInvalida(err.message)
    })
  }

  tarjetaInvalida(msn: string) {
    this.loading = false
    this.commonService.presentAlert('Error', msn);
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
