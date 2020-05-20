import { createAnimation, Animation } from '@ionic/core';

export const enterAnimation = (baseEl: any) => {
    const backdropAnimation = createAnimation('')
      .addElement(baseEl.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = createAnimation('')
      .addElement(baseEl.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' }
      ]);

    return createAnimation('')
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  }
// import { AnimationBuilder } from '@ionic/core';

// export function EnterAnimation(AnimationC: Animation, baseEl: HTMLElement): Promise<Animation> {



    // const baseAnimation = new AnimationC();

    // const backdropAnimation = new AnimationC();
    // backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

    // const wrapperAnimation = new AnimationC();
    // wrapperAnimation.addElement(baseEl.querySelector('.modal-wrapper'));

    // wrapperAnimation.beforeStyles({ 'opacity': 1 })
    //     .fromTo('translateX', '100%', '0%');

    // backdropAnimation.fromTo('opacity', 0.01, 0.4);

    // return Promise.resolve(baseAnimation
    //     .addElement(baseEl)
    //     .easing('cubic-bezier(0.36,0.66,0.04,1)')
    //     .duration(1000)
    //     .beforeAddClass('show-modal')
    //     .add(backdropAnimation)
    //     .add(wrapperAnimation));

// }
