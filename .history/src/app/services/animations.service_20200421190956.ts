import { Injectable } from '@angular/core';
import { createAnimation, Animation, Gesture, GestureConfig, createGesture } from '@ionic/core';


@Injectable({
  providedIn: 'root'
})
export class AnimationsService {

  constructor( ) { }

  enterAnimation(element) {
    createAnimation()
      .addElement(element)
      .easing('ease-out')
      .duration(500)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' }
      ])
      .play();
  }

  animBrincaDelay(element, inicial, final, delay) {
    createAnimation()
      .addElement(element)
      .duration(500)
      .iterations(1)
      .delay(delay * 70)
      .keyframes([
        { offset: 0, transform: inicial, opacity: '0.5' },
        { offset: 0.5, transform: final, opacity: '0.8' },
        { offset: 1, transform: 'scale(1)', opacity: '1' }
      ])
      .play()
  }

  animBrincaCustom(element, inicial, final) {
    createAnimation()
      .addElement(element)
      .duration(500)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: inicial, opacity: '0.5' },
        { offset: 0.5, transform: final, opacity: '0.8' },
        { offset: 1, transform: 'scale(1)', opacity: '1' }
      ])
      .play()
  }

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
      .duration(400)
      .iterations(1)
      .fromTo('transform', 'translateY(80%)', 'translateY(0%)')
      .play()
  }

  salidaDebajo(element) {
    createAnimation()
      .addElement(element)
      .duration(400)
      .iterations(1)
      .fromTo('transform', 'translateY(0%)', 'translateY(80%)')
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
    return new Promise((resolve, reject) => {
      const anim: Animation = createAnimation()
      .addElement(element)
      .duration(500)
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'scale(1)', opacity: '0.99' },
        { offset: 1, transform: 'scale(0)', opacity: '0' }
      ]);
      anim.play()
      anim.onFinish(() => resolve())
    });
    
  }

}
