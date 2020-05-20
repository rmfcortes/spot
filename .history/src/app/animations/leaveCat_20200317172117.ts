import { enterAnimationCategoria } from './enterCat';

export const leaveAnimationCategoria = (baseEl: any) => {
  return enterAnimationCategoria(baseEl).direction('reverse');
}