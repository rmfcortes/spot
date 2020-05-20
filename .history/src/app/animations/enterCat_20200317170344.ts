import { createAnimation } from '@ionic/core';

export const enterAnimationCategoria = (baseEl: any) => {

    const backdropAnimation = createAnimation('')
      .addElement(baseEl.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation('')
      .addElement(baseEl.querySelector('.modal-wrapper')!)
      .beforeStyles({ 'opacity': 1 })
      .fromTo('translateY', '0%', '100%');

    return createAnimation('')
      .addElement(baseEl)
      .easing('ease-out')
      .duration(800)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }