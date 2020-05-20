import { Injectable } from '@angular/core';
import { createAnimation, Animation } from '@ionic/core';


@Injectable({
  providedIn: 'root'
})
export class AnimationsService {

  constructor( ) { }

  animBrincaPoco(element) {
    createAnimation()
      .addElement(element)
      .duration(500)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'scale(0.9)', opacity: '0.5' },
        { offset: 0.5, transform: 'scale(1.5)', opacity: '1' },
        { offset: 1, transform: 'scale(1)', opacity: '1' }
      ])
      .play()
  }

  animBrinca(element) {
    createAnimation()
      .addElement(element)
      .duration(500)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'scale(0.9)', opacity: '0.5' },
        { offset: 0.5, transform: 'scale(2)', opacity: '1' },
        { offset: 1, transform: 'scale(1)', opacity: '1' }
      ])
      .play()
  }

  animEntradaIzquierda(element) {
    createAnimation()
      .addElement(element)
      .duration(750)
      .iterations(1)
      .fromTo('transform', 'translateX(-100%)', 'translateX(0%)')
      .play()
  }

  animEntradaDebajo(element) {
    createAnimation()
      .addElement(element)
      .duration(750)
      .iterations(1)
      .fromTo('transform', 'translateY(80%)', 'translateY(0%)')
      .play()
  }

  animEntradaCrescent(element) {
    createAnimation()
      .addElement(element)
      .duration(500)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'scale(0.1)', opacity: '0.5' },
        { offset: 0.5, transform: 'scale(0.5)', opacity: '0.75' },
        { offset: 1, transform: 'scale(1)', opacity: '1' }
      ])
      .play()
  }

  salida(element) {
    createAnimation()
    .addElement(element)
    .duration(500)
    .iterations(1)
    .keyframes([
      { offset: 0, transform: 'scale(1)', opacity: '0.99' },
      { offset: 1, transform: 'scale(0)', opacity: '0' }
    ])
    .play()
  }

  regresaContenido(element) {
    createAnimation()
    .addElement(element)
    .duration(600)
    .iterations(1)
    .keyframes([
      { offset: 0, transform: 'scale(1)', opacity: '0.3' },
      { offset: 1, transform: 'translateY(0%)', opacity: '1' }
    ])
    .play()
  }

}
