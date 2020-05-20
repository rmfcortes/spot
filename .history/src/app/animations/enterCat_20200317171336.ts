import { createAnimation } from '@ionic/core';

export const enterAnimationCategoria = (baseEl: any) => {

    const backdropAnimation = createAnimation('')
      .addElement(baseEl.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', '0.4');

    const wrapperAnimation = createAnimation('')
      .addElement(baseEl.querySelector('.modal-wrapper')!)
      .beforeStyles({ 'opacity': 1 })
    .fromTo('translateX', '100%', '0%')

    return createAnimation('')
      .addElement(baseEl)
      .easing('ease-out')
      .duration(1500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }