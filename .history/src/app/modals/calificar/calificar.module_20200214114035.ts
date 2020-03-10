import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxStarRatingModule } from 'ngx-star-rating';

import { IonicModule } from '@ionic/angular';

import { CalificarPage } from './calificar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxStarRatingModule,
  ],
  declarations: [CalificarPage],
  entryComponents: [CalificarPage]
})
export class CalificarPageModule {}
