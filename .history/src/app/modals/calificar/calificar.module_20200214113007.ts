import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RatingModule } from 'ng-starrating';

import { IonicModule } from '@ionic/angular';

import { CalificarPage } from './calificar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RatingModule,
  ],
  declarations: [CalificarPage],
  entryComponents: [CalificarPage]
})
export class CalificarPageModule {}
