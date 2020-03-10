import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PreloadImageComponent } from '../components/pre-load-image/pre-load-image.component';
import { ScrollVanishDirective } from '../directives/scroll-vanish.directive';
import { TitleScrollVanishDirective } from '../directives/scroll-vanish-title.directive';

@NgModule({
    imports: [
      CommonModule,
      IonicModule,
    ],
    declarations: [ PreloadImageComponent ],
    exports: [ PreloadImageComponent ]
  })

  export class SharedModule {}
