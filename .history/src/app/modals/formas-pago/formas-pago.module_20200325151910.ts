import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormasPagoPage } from './formas-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [FormasPagoPage],
  entryComponents: [FormasPagoPage]
})
export class FormasPagoPageModule {}
