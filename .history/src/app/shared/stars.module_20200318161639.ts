import { NgModule } from '@angular/core';

import { StarsComponent } from '../components/stars/stars.component';

@NgModule({
    declarations: [
      StarsComponent,
    ],
    exports: [
      StarsComponent,
    ]
  })

  export class StarsModule {}
