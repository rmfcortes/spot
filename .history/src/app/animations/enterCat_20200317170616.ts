import { createAnimation } from '@ionic/core';

export const enterAnimationCategoria = (baseEl: any) => {

    const backdropAnimation = createAnimation('')
      .addElement(baseEl.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation('')
      .addElement(baseEl.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0.5', translateY: '0%' },
        { offset: 1, opacity: '0.99', translateY: '100%' }
      ])

    return createAnimation('')
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }