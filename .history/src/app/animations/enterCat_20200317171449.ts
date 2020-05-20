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
      .easing('cubic-bezier(0.36,0.66,0.04,1)')
      .duration(2500)
      .beforeAddClass('show-modal')
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }